var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function (req,res) {
    var urlObj = url.parse(req.url,true);
    var pathName = urlObj.pathname;
    var query = urlObj.query;

    var reg = /\.([0-9a-zA-Z]+)/i;
    if(reg.test(pathName)){
        var conFile = null;
        var status = 200;
        try{
            conFile = fs.readFileSync("."+pathName);
        }catch(e){
            conFile = "Not Found!";
            status = 404;
        }
        var suffix = reg.exec(pathName)[1].toUpperCase();
        var MIMEType = "text/plain";
        switch(suffix){
            case "HTML":
                MIMEType = "text/html";
                break;
            case "CSS":
                MIMEType = "text/css";
                break;
            case "JS":
                MIMEType = "text/javascript";
                break;
        }

        res.writeHead(status,{"content-type":MIMEType + ";charset = utf-8"});
        res.end(conFile);
        return;
    }

    var customPath = "./json/custom.json";
    var customList = JSON.parse(fs.readFileSync(customPath));
    var ResultTmp = {
        code:1,
        msg:"error",
        data:null
    };
    //获取全部信息
    if(pathName === "/getAllList"){
        if(customList){
            ResultTmp = {
                code:0,
                msg:"success",
                data:customList
            };
            res.writeHead(200,{"content-type":"application/json"});
            res.end(JSON.stringify(ResultTmp));
            return;
        }
    }
    //增加客户
    if(pathName === "/addInfo"){
        var pass = "";
        req.on("data",function (chunk) {
            pass += chunk;
        });
        req.on("end",function () {
            pass = pass.myUrlToObj();
            pass["id"] = customList.length === 0 ? 0 : parseFloat(customList[customList.length - 1]["id"]) + 1;
            customList.push(pass);
            fs.writeFileSync(customPath,JSON.stringify(customList));
            ResultTmp = {
                code:0,
                msg:"success",
                data:null
            };
            res.writeHead(200,{"content-type":"application/json"});
            res.end(JSON.stringify(ResultTmp));
            return;
        });
    }
    //更新
    if(pathName === "/updateInfo"){

        var pass = "";
        req.on("data",function (chunk) {
            pass += chunk;
        });
        req.on("end",function () {
            pass = pass.myUrlToObj();
            customList.forEach(function (item,index) {
                if(item.id == pass.id){
                    customList[index] = pass;
                    fs.writeFileSync(customPath,JSON.stringify(customList));
                    ResultTmp = {
                        code:0,
                        msg:"success",
                        data:null
                    };
                    res.writeHead(200,{"content-type":"application/json"});
                    res.end(JSON.stringify(ResultTmp));
                    return;
                }
            });
        });
    }
    //查找指定信息
    if(pathName === "/getInfo"){
        var customId = query["id"];
        customList.forEach(function (item,index) {
            if(item.id == customId){
                ResultTmp = {
                    code:0,
                    msg:"success",
                    data:item
                };
                res.writeHead(200,{"content-type":"application/json"});
                res.end(JSON.stringify(ResultTmp));
                return;
            }
        });
    }
    //移除指定用户
    if(pathName === "/removeInfo"){
        var customId = query["id"];
        customList.forEach(function (item,index) {
            if(item.id == customId){
                customList.splice(index,1);
                fs.writeFileSync(customPath,JSON.stringify(customList));
                ResultTmp = {
                    code:0,
                    msg:"success",
                    data:null
                };
                res.writeHead(200,{"content-type":"application/json"});
                res.end(JSON.stringify(ResultTmp));
                return;
            }
        });
    }

});

String.prototype.myUrlToObj = function () {
  var obj = {};
  var reg = /([^#&=?]+)=([^#&=?]+)/g;
    this.replace(reg,function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
};
server.listen(8080,function () {
    console.log("server 8080!");
});