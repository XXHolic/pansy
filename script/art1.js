/**
 * 只针对 漫画DB：https://www.manhuadb.com/ 的网页数据解析
 * 相关处理的文件前缀都是 art1
 */
const fs = require('fs');
const {
  createFold,
  writeLocalFile,
  requestPromise,
  readJsonFile,
  readFileText
} = require('./utils')
const {
  getChapterContainerReg,
  getChapterReg,
} = require('./helper')
const {
  classifyData,
  getChapterImageData,
} = require('./art1a')

const localName = 'xxx'
const localRoot = '../../static'
const baseRoot = `${localRoot}/${localName}/`
const comicMark = '24099'
const chapterReqUrl = "https://www.manhuadb.com/manhua/" + comicMark + '/'
const site = 'https://www.manhuadb.com'
const chapterFile = baseRoot + 'chapter.json' // 包含总的信息，也方便获取解析
const imagesJsonFileName = 'images.json'
const titleFileName = 'title.md'
const baseEmptyJsonFile = baseRoot+'empty.json'
const baseFailJsonFile = baseRoot+'down-fail.json'
const globalClassify = 'serial' // 有 4 个值 serial short single appendix
// 不同的部分可能来自不同的源，所以单独分开
const serialFile = baseRoot + 'serial.json'
const shortFile = baseRoot + 'short.json'
const singleFile = baseRoot + 'single.json'
const appendixFile = baseRoot + 'appendix.json'

// 获取所有章节的页面链接数据，并存放到本地
async function getChaptersData() {

  const chapterFileObj = readJsonFile(chapterFile)

  // 添加支持读取本地文件
  const result = readFileText('../public/index.html')
  // const result = await requestPromise(`${chapterReqUrl}`,{reqType:'https'})

  const linkReg = getChapterContainerReg(2)
  const matchResult = result.match(linkReg)
  // console.log('---matchResult---')
  // console.log(matchResult)

  if (matchResult && matchResult.length) {
    const chapterReg = getChapterReg(3,comicMark)
    // 默认先取第一个，一个结束后，手动修改
    const chapterLink = matchResult[0]
    const linkMatch = chapterLink.match(chapterReg)
    // console.log('---linkMatch---')
    // console.log(linkMatch)

    // return;

    if (linkMatch && linkMatch.length) {
      // 先按照 正式连载,短篇,卷附录，单行本, 进行分类，然后再分别放入数组
      const allLink = classifyData(linkMatch,chapterFileObj)
    // console.log('---allLink---')
    // console.log(allLink)

      // 综合的数据
      writeLocalFile(chapterFile,JSON.stringify(allLink))
      // 可以根据情况写入不同部分的文件
      writeLocalFile(serialFile,JSON.stringify({list:allLink.serial}))
      // writeLocalFile(shortFile,JSON.stringify({list:allLink.short}))
      // writeLocalFile(singleFile,JSON.stringify({list:allLink.single}))
      // writeLocalFile(appendixFile,JSON.stringify({list:allLink.appendix}))
      console.log('get all chapter links success')
    }

  }


}

// 获取每个章节下所有图片的链接并存放到本地 json 文件
// 这个适用于单个页面就可以获取所有图片源的情况
async function getImagesData() {
  // 四个 serialFile shortFile singleFile appendixFile
  const filePath = serialFile
  const fileData = readJsonFile(filePath)


  let baseFail = readJsonFile(baseEmptyJsonFile)
  // console.log('---chapterList---')
  // console.log(chapterList)
  const classify = globalClassify
  createFold(`${baseRoot}${classify}`)
  const chapterList = fileData.list
  const chapterNum = chapterList.length
  let startDire = 1 // 跟本地的文件夹命名顺序一致，从 1 开始
  while (startDire <= chapterNum) {
  // while (startDire <= 54) { // 测试用
    let startDownChapterObj = chapterList[startDire-1]
    const startDownChapter = startDownChapterObj.link
    const preBaseRoot = `${baseRoot}${classify}/`

    createFold(`${preBaseRoot}${startDire}`)

    const pathPre = `${preBaseRoot}${startDire}/`
    const imagesFile = `${pathPre}${imagesJsonFileName}`
    const titleFile = `${pathPre}${titleFileName}`
    if (fs.existsSync(titleFile) || baseFail.includes(startDownChapter)) {
      // console.log(`chapter ${startDire} all image src exist`)
      startDire += 1
      continue;
    }
    let url = `${site}${startDownChapter}`
    let imageData = {}
    const res = await requestPromise(url,{reqType:'https'}).catch((e) => {
      console.log(`chapter fail ${startDownChapter}`)
      baseFail.push(startDownChapter)
      writeLocalFile(baseEmptyJsonFile,JSON.stringify(baseFail))
    })

    if (!res) {
      startDire += 1
      continue;
    }

    imageData = getChapterImageData(res,url)
    imageData.title = startDownChapterObj.name // 有些网址是 gb 编码，就不用那个了
    if (!imageData.total) {
      return;
    }
    const imagesContent = JSON.stringify(imageData)

    await writeLocalFile(imagesFile,imagesContent)
    // await writeLocalFile(singleChapterFile,imagesContent)
    await writeLocalFile(titleFile,imageData.title)
    console.log(`get chapter ${startDire} all image src`)
    startDire += 1
  }
}

function initFold() {
  const name = 'xx'
  const viewFold = '../../view'
  const comicFold = `${localRoot}/${name}`
  createFold(localRoot)
  createFold(viewFold)
  createFold(comicFold)
}

function generateComicList() {
  const allPath = readDir(localRoot)
  let comicNameArr = []
  const len = allPath.length
  console.log(allPath)
  for (let index = 0; index < len; index++) {
    const name = allPath[index];
    const pathStr = `${localRoot}/${name}`
    const posterFile = readFileName(pathStr)
    const poster = posterFile[0]
    // const strSplit = str.split(path.sep)
    comicNameArr.push({
      name:name,
      poster: `${pathStr}/${poster}`
    })
  }
  let obj = {
    list: comicNameArr
  }
  writeLocalFile(listFile,JSON.stringify(obj))
}

// 初始化创建基本文件结构
// initFold()
// 第一步获取所有章节的请求页面
// getChaptersData()
// 第二步获取每个章节所有对应图片
// getImagesData()
// 下载完图片后生成用于页面展示的信息
// generateComicList()