var content = document.getElementById("content");

ajax({
    url:"/getAllList",
    success:function (result) {
        if(result && result.code===0)
            result = result.data;
            var str = "";
            result.forEach(function (item,index) {
                str += ` <li>
                            <span>${item.id}</span>
                            <span>${item.name}</span>
                            <span>
                                <a href="detail.html?id=${item.id}">修改</a>
                                <a href="javascript:;" data-id = ${item.id}>删除</a>
                            </span>
                        </li>`;
            });
            content.innerHTML = str;
        }
    });

content.onclick = function (e) {
    e = e||window.event;
    var tar = e.target || e.srcElement;
    if(tar.tagName.toUpperCase() === "A" && tar.innerHTML === "删除"){
       ajax({
           url:"/removeInfo",
           data:{
               id:tar.getAttribute("data-id")
           },
           success:function (result) {
               if(result && result.code === 0){
                   alert("删除成功");
                   content.removeChild(tar.parentNode.parentNode);
               }else{
                   alert("删除失败");
               }
           }
       });
    }
};
