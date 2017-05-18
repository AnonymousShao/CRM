var btn = document.getElementById("submit");
var userName = document.getElementById("userName");

String.prototype.myUrlToObj = function () {
    var obj = {};
    var reg = /([^#&=?]+)=([^#&=?]+)/g;
    this.replace(reg,function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
};

var customId = location.href.myUrlToObj()["id"];
if(typeof customId !== "undefined"){
    ajax({
        url:"/getInfo",
        method:"get",
        data:{
            id:customId
        },
        success:function (result) {
            if(result && result.code === 0){
                userName.value = result.data.name;
            }
        }
    });
}
btn.onclick = function () {
    if(typeof customId !== "undefined"){
        ajax({
            url:"/updateInfo",
            method:"post",
            data:{
                id:customId,
                name:userName.value
            },
            success:function (result) {
                if(result && result.code === 0){
                    alert("修改成功");
                    location.href = "index.html";
                }else{
                    alert("修改失败");
                }
                return;
            }
        });
        return;
    }
    ajax({
        url:"/addInfo",
        method:"post",
        data:{
          name:userName.value
        },
        success:function (result) {
            if(result && result.code === 0){
                alert("添加成功");
                location.href = "index.html";
            }else{
                alert("添加失败");
            }
        }
    });
};
