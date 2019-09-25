const rq = require('request-promise');
const cheerio = require('cheerio');
const fs=require("fs");

//数据格式
// const data = {
//     url: '',
//     res: '',
// }
const url = "https://www.soogif.com/sort/124?pageSize=28&pageNumber=";
const ApiUrl = "https://www.soogif.com/material/query?query="
let index = 0;
let lasTextes = [];
let downloadPath = "";
let orUndefined = data => {
    return toString.call(data) == "[object Undefined]" ? true : false;
}
let delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let dirExit = (name) => {
    downloadPath = name;
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name);
      console.log(`${name}文件夹创建成功`);
      return true;
    } else {
      console.log(`${name}文件夹已经存在`);
      return false;
    }
}

let downloadImage = async (data,index)=>{
    if (data) {
        let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1"
        };//反防盗链
        await delay(500)
        await rq({
            url: data,
            resolveWithFullResponse: true,
            headers
        }).pipe(fs.createWriteStream(`${downloadPath}/${index}.gif`));//下载
        console.log(`${downloadPath}/${index}.gif下载成功`);
    } else {
        console.log(`${downloadPath}/${index}.gif加载失败`);
    }
}

let getUrl = async url => {
    let options = {
        url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1"
        }
    }
    try{
        let data = {
            url,
            res: await rq(options)
        }
        return data;
    }
    catch{
       // deal err
    }
}

let getText = async webData => {
    let $ = cheerio.load(webData.res);
    let text = $(".up").find('a').find('.bottom');
    let data = [];
    text.each((i, e) => {
        if (!orUndefined(e.children[0].data)) {
            data.push(
                e.children[0].data
            )
        } else {
            data.push(
                e.children[0].children[0].data
            )
        }
    })
    return data;
}

let getAllData = async () => {
    for (let i = 1; i <= 11; i++) {
        let webData = await getUrl(url + i);
        let textes = await getText(webData);
        lasTextes.push(textes);
    }
    return lasTextes;
}

let getAllApi = async (text) => {
    let data = await getUrl(ApiUrl + encodeURI(text));
    let res = JSON.parse(data.res);
    let list = res.data.list;
    let total = res.data.total;
    if(dirExit(text)){
        for (var i = 0; i < list.length; i++) {
            await downloadImage(list[i].url, i);
        }
    }
    index++;
    main()
}


let main = async () => {
    let data = [].concat.apply([], await getAllData());
    await getAllApi(data[index]);
}

main();