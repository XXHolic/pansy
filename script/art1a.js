// 针对 漫画DB 的特定解析
const {
  sortChapterLink,
} = require('./helper')
const {
  regMatch,
} = require('./utils')

const getChapterImageData = (pageData, url) => {
  let data = {
    list:[],
    total:0,
    title:''
  }

  // <script>var img_data =
  const reg = /<script>var img_data([\s\S]*?)<\/script*?>/g
  const matchResult = regMatch(pageData,reg)
  const chapterReg = /'+.*?'/g
  const chapterStr = regMatch(matchResult,chapterReg)
  const mainStr = chapterStr.substring(1,chapterStr.length-1)
  // console.log('---chapterStr---')
  // console.log(chapterStr)
  const chapterArr = JSON.parse(base64.decode(mainStr))

  const divReg = /<div class="d-none vg-r-data"+.*?>([\s\S]*?)<\/div*?>/g
  const divStr = regMatch(pageData,divReg)
  const totalReg = /data-total="\d{1,4}"/g
  const totalStr = regMatch(divStr,totalReg,2)
  const totalNum = Number(totalStr)

  const hostReg = /data-host="+.*?"/g
  const hostStr = regMatch(divStr,hostReg,2)

  const preReg = /data-img_pre="+.*?"/g
  const preStr = regMatch(divStr,preReg,2)

  const imgPre = `${hostStr}${preStr}`

  const listData = chapterArr.reduce((acc,cur) => {
    const url = `${imgPre}${cur.img}`
    acc.push(url)
    return acc;
  },[])



  const titleReg = /<title>+.*?<\/title>/g
  const titleStr = regMatch(pageData,titleReg)
  const pattern = /<(\S*?)[^>]*>.*?|<.*? \/>/g
  const title = titleStr.replace(pattern,'')

  data.list = listData
  data.total = totalNum
  data.title = title

  return data

}


const formatChapter = (data) => {
    // <a class="" href="/manhua/420/413_4650.html" title="[异能者][山本英夫][文传][C.C]Vol_01">1</a>
    const linkMatchResult = data.match(/\/+.*?.html/g)
    const link = linkMatchResult[0]
    const pattern = /<(\S*?)[^>]*>.*?|<.*? \/>/g
    const value = data.replace(pattern,'')
    const order = value?Number(value):0
    const nameMatchResult = data.match(/title=+.*?."/g)
    const nameStr = nameMatchResult[0]
    const name = nameStr.substring(7,nameStr.length-1)
    chapterLink = {
      name: name,
      link: link,
      order: order
    }
}

// 如果本地原本就有数据，则要进行合并，而不是全覆盖
const classifyData = (data,localData) => {
  // 常见的有 serial-正式连载，short-短篇，single-单行本，appendix-卷附录，
  let intiData = {
    serial:[],
    short:[],
    single:[],
    appendix:[],
  }
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element.indexOf('角色书')>-1 || element.indexOf('番外')>-1) {
    // if (element.indexOf('短篇')>-1 || element.indexOf('番外')>-1||element.indexOf('角色书')>-1 || element.indexOf('小四格')>-1) {
      const formatData = formatChapter(element)
      intiData.short.push(formatData)
      continue;
    }
    if (element.indexOf('附录')>-1) {
      const formatData = formatChapter(element)
      intiData.appendix.push(formatData)
      continue;
    }
    if (element.indexOf('单行')>-1) {
      const formatData = formatChapter(element)
      intiData.single.push(formatData)
      continue;
    }

    // if (element.indexOf('before')>-1) {
    //   continue;
    // }

    const formatData = formatChapter(element)
    intiData.serial.push(formatData)

  }

  // 有的网站并不是按照正确顺序排列，所以还是排序一下
  if (localData && localData.serial) {
    // 可以根据情况覆盖不同的部分
    localData.serial = sortChapterLink(intiData.serial,3)
    localData.short = sortChapterLink(intiData.short,3)
    // localData.single = sortChapterLink(intiData.single,3)
    localData.appendix = sortChapterLink(intiData.appendix,3)
    return localData
  }

  intiData.serial = sortChapterLink(intiData.serial,3)
  intiData.short = sortChapterLink(intiData.short,3)
  intiData.single = sortChapterLink(intiData.single,3)
  intiData.appendix = sortChapterLink(intiData.appendix,3)

  return intiData

}

module.exports = {
  getChapterImageData,
  classifyData,
}
