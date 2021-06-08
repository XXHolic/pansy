// 批量清除文件
var fs = require("fs");
var path = require("path");
// 有 4 个值 serial short single appendix
var dealPath = '../../static/jojo6/single'
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
      if ([".json"].includes(path.extname(file))) {
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



function clearFile() {
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
    fs.unlinkSync(ele)
    console.log(`clear ${ele} done`)
  })
  console.log('clear all file done')
}

clearFile()