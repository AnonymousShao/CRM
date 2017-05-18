
;(function () {
    function ajax(option) {
        var _default = {
            url:null,
            method:"get",
            async:true,
            cache:true,
            data:null,
            dataType:"json",
            success:null,
            error:null
        };

        for(var key in option){
            if(option.hasOwnProperty(key)){
                if(key === "type"){
                    _default["method"] = option[key];
                    continue;
                }
                _default[key] = option[key];
            }
        }
        var regGET = /^(GET|HEAD|DELETE)$/i;
        if(_default.data){
            if(typeof _default.data === "object"){
                var str = "";
                for(var key in _default.data){
                    if(_default.data.hasOwnProperty(key)){
                        str += key + "=" + _default.data[key] + "&";
                    }
                }
                _default.data = str.substring(0,str.length-1);
            }
            if(regGET.test(_default.method)){
                _default.url += checkMark(_default.url) + _default.data;
                _default.data = null;
            }
        }

        //cache
        if(regGET.test(_default.method) && _default.cache === false){
            _default.url += checkMark(_default.url) + "_=" + Math.random();
        }

        var xhr = new XMLHttpRequest();
        xhr.open(_default.method,_default.url,_default.async);
        xhr.onreadystatechange = function(){
          if(/^(2|3)\d{2}/.test(xhr.status)){
              if(xhr.readyState === 4){
                  console.log(44444);
                  var result = xhr.responseText;
                  switch(_default.dataType.toUpperCase()){
                      case "JSON":
                          result = "JSON" in window ? JSON.parse(result) : eval("("+result+")");
                          break;
                      case "XML":
                          result = xhr.responseXML;
                          break;
                  }
                  _default.success && _default.success.call(xhr,result);
              }
              return;
          }
            _default.error && _default.error.call(xhr);
        };
        xhr.send(_default.data);
    }
    function checkMark(url){
        return url.indexOf("?") === -1 ? "?" : "&";
    }
    window.ajax = ajax;
})();
