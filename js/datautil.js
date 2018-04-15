/**
 * 将数据提交到后台，数据格式为字典：
 * {key:value, key:value,...}
 * config属性:$http, url, data, encryptFunction, callbackFunction, errorCallbackFunction, httpConfig, method
 */
function simplePostData(config) {
	var method = config.method;
	if(!method){
		method = "POST";
	}
	var url = config.url;
	if(config.params!=undefined){
		url += config.params;
	}
	var nonce = $.cookie("nonce");
	//生成签名
	var sign = generateSign($.cookie('userId'),nonce,$.cookie("token"));
	//数据加密处理
	var data = config.data;
	if(config.encryptFunction != undefined){
		data = config.encryptFunction(data);
	}
	//head信息
//	var signConfig = {headers : {'Authorization' : $.cookie('userId')+';'+nonce+';'+sign }};
//	var httpConfig = $.extend(true, config.httpConfig, signConfig);
	//提交到服务器
	
	config.$http({
		method: method,
		url: url,
		data: data,
		headers: {'Authorization' : $.cookie('userId')+';'+nonce+';'+sign }
	}).success(function(result,status,headers,request) {
		var errorCode = result.errorCode;
		if(errorCode == 0) {
			config.callbackFunction(result,status,headers,request);
		} else {
			handleError(result,config.errorCallbackFunction);
		}
	})
	.error(function(result,status,headers,request) {
		if(status == '401'){
			// 验证信息过期则重发请求
			if(headers('stale') == 'true'){
				saveNonce(headers);
				simplePostData(config);
			} else {
				// 验证错误则重新登录
				toastr.error('您的登录已超时，请重新登录！');
				location.href="login.html";
			}
		} else {
			toastr.error('服务器错误，请联系管理员！');
		}
	})
}

/**
 * 对返回的错误做处理
 * @param {Object} result
 * @param {errorCallbackFunction} 错误处理方法,返回boolean，表示错误是否已经处理
 */
function handleError(result,errorCallbackFunction){
	//若定义了其他错误处理方法则先运行此方法
	if(typeof(errorCallbackFunction)!='undefined'){
		var isHandled = errorCallbackFunction(result);
		if(isHandled) return;
	}
				
	var errorCode = result["errorCode"];
	var errorInfo = result["errorInfo"];
	
	switch (errorCode){
		//token不正确跳到登录页面
		case 20002: location.href = "login.html";break;
		//无权限显示无权限
		//case 20003: alert("对不起，您无该操作权限");break;
		//其他情况显示错误信息，无错误信息显示错误码
		default: 
			if(errorInfo !=null && errorInfo != "") {
				toastr.error("错误: " + errorInfo);
			} else {
				toastr.error("错误: " + errorCode);
			}
			break;
	}
}

/***
 * 获取随机数
 */
function saveNonce(headers){
	nonce = getNonce(headers('authorization-info'));
}

/**
 * 生成签名
 */
function generateSign(userId,nouce,token){
	return CryptoJS.SHA1(token + userId + ":" + nouce)
}

function generateAuthorization(){
	return $.cookie('userId')+';'+nonce+';'+generateSign($.cookie('userId'),nonce,$.cookie("token"));
}

/**
 * 生成随机id
 */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

/**
 * 根据响应头中的authorizationInfo获取nonce
 */
function getNonce(authorization){
	return authorization.split("=")[1];
}

/**
 * 向url中添加签名信息
 */
function getSignUrl(url){
	var sign = generateSign($.cookie('userId'),nonce,$.cookie("token"));
	return url+'?authorization='+$.cookie('userId')+';'+nonce+';'+sign;
}

/**
 * 判断对象是否为空
 * @param {Object} obj
 */
function isEmpty(obj){
    for ( var name in obj ) {
        return false;
    }
    return true;
}

/**
 * 将空对象转为空字符串
 */
function emptyToBlank(obj){
	if(isEmpty(obj)) return "";
	return obj;
}

/**
 * 将null及"null"字符串转为空字符串
 */
function nullToBlank(obj){
	if(isEmpty(obj)) return "";
	if(obj=="null") return "";
	return obj;
}