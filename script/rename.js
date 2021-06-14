// 文件批量重命名
var fs = require("fs");
var path = require("path");
// 有 4 个值 serial short single appendix
var dealPath = '../../static/zhiBuMieDeNi/serial'
// var dealPath = './test'
var dealFile = [] // 测试 需要重命名的文件夹
// var dealFile = [11,12,13,14,15,16,17,18,19,20,21,22,23] // 需要重命名的文件夹
var fileArr = []; // 存储目标文件路径

/**
 * 递归目录及下面的文件，找出目标文件，
 * @param {String} dir 文件夹路径
 */
function readDirFile(dir) {
  var exist = fs.existsSync(dir);
  // 排除不需要遍历的文件夹或文件
  var excludeDir = /^(\.|node_module)/;
  if (!exist) {
    console.error("目录路径不存在");
    return;
  }
  var pa = fs.readdirSync(dir);

  for (let index = 0; index < pa.length; index++) {
    let file = pa[index];
    var pathName = path.join(dir, file);
    var info = fs.statSync(pathName);
    if (info.isDirectory() && !excludeDir.test(file)) {
      readDirFile(pathName);
    } else {
      if ([".jpg",".png",".jpeg"].includes(path.extname(file))) {
        fileArr.push(pathName);
      }
    }
  }
}

// 只读文件夹，不读文件
function readDir(dir) {
  var exist = fs.existsSync(dir);
  // 排除不需要遍历的文件夹或文件
  var excludeDir = /^(\.|node_module)/;
  if (!exist) {
    console.error("目录路径不存在");
    return;
  }
  var pa = fs.readdirSync(dir);

  for (let index = 0; index < pa.length; index++) {
    let file = pa[index];
    var pathName = path.join(dir, file);
    var info = fs.statSync(pathName);
    if (info.isDirectory() && !excludeDir.test(file)) {
      fileArr.push(pathName);
    }
  }
}

function getFileNewName(data,type) {
  let newName = data
  let hasChange = false;
  if (type == 1) {
    const eleTypePos =  data.lastIndexOf('.')
    const fileType = ele.substring(eleTypePos)
    let eleSplitFirst =  ele.split('\\')
    const posFirst = eleSplitFirst.length-1
    const eleSplitEle = eleSplitFirst[posFirst]
    let eleSplit =  eleSplitEle.split('.')
    const fileName = eleSplit[0]
    const matchArr = fileName.match(/\d{1,6}/g)
    const matchData = Number(matchArr[0])
    const newName = `${matchData}${fileType}`

    eleSplitFirst[posFirst] = newName
    newName = eleSplitFirst.join('\\')
  }
  if (type == 2) {
    let strSplit =  data.split('\\')
    const lastIndex = strSplit.length-1
    const oldNameType = strSplit[lastIndex]
    let oldNameSplit =  oldNameType.split('.')
    const fileType = oldNameSplit[oldNameSplit.length-1]
    const fileName = oldNameSplit[0]
    if (fileName.indexOf('0') == 0) {
      hasChange = true
      const matchArr = fileName.match(/\d{1,6}/g)
      const oldName = Number(matchArr[0])
      strSplit[lastIndex] = `${oldName}.${fileType}`
      newName = strSplit.join('\\')
    }
  }
  return {newName,hasChange}
}

function renameFile() {
  if(dealFile.length) {
    const dealFilePath = dealFile.map(ele => (`${dealPath}/${ele}`))
    dealFilePath.map(ele => {
      readDirFile(ele)
    })
  } else {
    readDirFile(dealPath)
  }

  // console.log(fileArr)
  fileArr.map(ele => {
    const {newName, hasChange} = getFileNewName(ele,2)
    if (hasChange) {
      console.log(`rename one done ${ele}`)
      fs.renameSync(ele, newName)
    }
  })
  console.log('rename all file done')
}


function getDirectoryNewName(data,order,type) {
  let newNamePath = data
  if (type == 1) {
    let eleSplitFirst =  data.split('\\')
    const posFirst = eleSplitFirst.length-1
    const eleSplitEle = eleSplitFirst[posFirst]
    let eleSplit =  eleSplitEle.split('.')
    const pos = eleSplit.length-1
    const newName = String(Number(eleSplit[pos]))
    eleSplitFirst[posFirst] = newName
    newNamePath = eleSplitFirst.join('\\')
  }
  if (type == 2) {
    let strSplit =  data.split('\\')
    const lastIndex = strSplit.length-1
    // const oldName = strSplit[lastIndex]
    strSplit[lastIndex] = order + 1
    newNamePath = strSplit.join('\\')
  }
  return newNamePath
}

function renameDirectory() {
  readDir(dealPath)
  console.log(fileArr)
  fileArr.map((ele,index) => {
      let newName = getDirectoryNewName(ele,index,2)
      fs.renameSync(ele, newName)
  })

  console.log('rename Directory done')
}

renameFile()
// renameDirectory()