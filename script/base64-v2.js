function utf8_decode(str_data) {
  var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
  str_data += '';
  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 < 128) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if ((c1 > 191) && (c1 < 224)) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return tmp_arr.join('');
}

function base64_decode(data) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
  if (!data) { return data; }
  data += '';
  do {
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));
    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;
    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);
  dec = tmp_arr.join('');
  dec = utf8_decode(dec);
  return dec;
}
function ithmsh(nummhstr) {
  var x, num_out, num_in, str_out, realstr;
  x = nummhstr.replaceAll1("JLmh160", "");
  realstr = x;

  var PicUrlArr1 = x.split("$qingtiandy$");
  for (k = 0; k < PicUrlArr1.length; k++) {
    str_out = "";
    num_out = PicUrlArr1[k];
    for (i = 0; i < num_out.length; i += 2) {
      num_in = parseInt(num_out.substr(i, [2])) + 23;
      num_in = unescape('%' + num_in.toString(16));
      str_out += num_in;
    }
    realstr = realstr.replaceAll1(num_out, unescape(str_out));

  }
  //alert(realstr);
  return realstr;

}

function jsff(str, pwd) {
  if (str == "") return "";
  if (!pwd || pwd == "") { var pwd = "1234"; }
  pwd = escape(pwd);
  if (str == null || str.length < 8) {
    alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
    return;
  }
  if (pwd == null || pwd.length <= 0) {
    alert("Please enter a password with which to decrypt the message.");
    return;
  }
  var prand = "";
  for (var I = 0; I < pwd.length; I++) {
    prand += pwd.charCodeAt(I).toString();
  }
  var sPos = Math.floor(prand.length / 5);
  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
  var incr = Math.round(pwd.length / 2);
  var modu = Math.pow(2, 31) - 1;
  var salt = parseInt(str.substring(str.length - 8, str.length), 16);
  str = str.substring(0, str.length - 8);
  prand += salt;
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
  }
  prand = (mult * prand + incr) % modu;
  var enc_chr = "";
  var enc_str = "";
  for (var I = 0; I < str.length; I += 2) {
    enc_chr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor((prand / modu) * 255));
    enc_str += String.fromCharCode(enc_chr);
    prand = (mult * prand + incr) % modu;
  }
  return unescape(enc_str);
}
var z$="TWmh160";
function itwrnm(nummhstr) {
  var x, text, realstr;
  x = nummhstr.replaceAll1("TWmh160", "");
  realstr = x;
  var PicUrlArr1 = x.split("$qingtiandy$");
  for (k = 0; k < PicUrlArr1.length; k++) {
    last = "";
    text = PicUrlArr1[k];
    last = jsff(text, z$)
    realstr = realstr.replaceAll1(text, last);

  }
  return realstr;
}

//获取当前图片后缀
var currentChapterid = 0
function getUrlpics(data,id) {
  var PicUrls = data;
  currentChapterid = id;
  if (PicUrls.indexOf("mh160tuku") == -1)
    PicUrls = base64_decode(data);

  if (PicUrls.indexOf("JLmh160") != -1) { PicUrls = ithmsh(PicUrls); }
  else if (PicUrls.indexOf("TWmh160") != -1) {
    PicUrls = itwrnm(PicUrls);
  }
  var PicUrlArr = PicUrls.split("$qingtiandy$");
  const finalArr = PicUrlArr.map(ele => {
    return getrealurl(ele)
  })
  return finalArr


}

function getpicdamin()
{
//if (parseInt(cid)>10000){

     //yuming="https://mhpic6.hsvac.cn";
    //yuming="https://manhuapicdisk03.cdn.bcebos.com";

// }else{

    //yuming="https://mhpic7.kingwar.cn";
     // yuming="https://manhuapicdisk03.cdn.bcebos.com";
//}

//yuming="https://mhpic6.hsvac.cn";
 // yuming="https://mhpic6.szsjcd.cn";
  //yuming="https://mhpic6.miyeye.cn:20207";

   let yuming="https://res.gezhengzhongyi.cn:8443";

if (parseInt(currentChapterid)>542724){

     //yuming="https://mhpic5.miyeye.cn:8443";
     yuming="https://mhpic5.gezhengzhongyi.cn:8443";
     //yuming="https://mhpic5.hsvac.cn";
    //yuming="https://manhuapicdisk02.cdn.bcebos.com";

}
if (parseInt(currentChapterid)>885032)
   yuming="https://mhpic88.miyeye.cn:8443";




return yuming;
}

//获取当前完整图片 url
function getrealurl(urlstr) {
  var realurl = urlstr;

  if (realurl.indexOf("img1.fshmy.com") != -1) {

    realurl = realurl.replace("img1.fshmy.com", "img1.hgysxz.cn");
  }
  else if (realurl.indexOf("imgs.k6188.com") != -1) {

    realurl = realurl.replace("imgs.k6188.com", "imgs.zhujios.com");
  }
  else if (realurl.indexOf("073.k6188.com") != -1) {

    realurl = realurl.replace("073.k6188.com", "cartoon.zhujios.com");
  }
  else if (realurl.indexOf("cartoon.jide123.cc") != -1) {

    realurl = realurl.replace("cartoon.jide123.cc", "cartoon.shhh88.com");
  }
  else if (realurl.indexOf("imgs.gengxin123.com") != -1) {

    realurl = realurl.replace("imgs.gengxin123.com", "imgs1.ysryd.com");
  }
  else if (realurl.indexOf("www.jide123.com") != -1) {

    realurl = realurl.replace("www.jide123.com", "cartoon.shhh88.com");
  }
  else if (realurl.indexOf("cartoon.chuixue123.com") != -1) {

    realurl = realurl.replace("cartoon.chuixue123.com", "cartoon.shhh88.com");
  }
  else if (realurl.indexOf("p10.tuku.cc:8899") != -1) {

    realurl = realurl.replace("p10.tuku.cc:8899", "tkpic.tukucc.com");
  }
  else if (realurl.indexOf("http://") == -1) {


    realurl = encodeURI(getpicdamin() + realurl);


  }



  return realurl;

}


module.exports = {getUrlpics}
