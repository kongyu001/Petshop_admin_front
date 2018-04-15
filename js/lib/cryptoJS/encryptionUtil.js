/**
 * AES加密,key为nonce
 */
function getAesStringByNonce(data){
	return getAesString(data, nonce);
}
/**
 * AES加密
 */
function getAesString(data,key){
//	key = key.slice(0,16);
    key = CryptoJS.enc.Utf8.parse(key);
	key = CryptoJS.MD5(key);
    var encrypted = CryptoJS.AES.encrypt(data,key,
        {
            mode:CryptoJS.mode.ECB,
            padding:CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();
}
/**
 * AES解密,key为nonce
 */
function getDAesStringByNonce(encrypted){
	return getDAesString(encrypted, nonce);
}
/**
 * AES解密
 */
function getDAesString(encrypted,key){
//	key = key.slice(0,16);
    key = CryptoJS.enc.Utf8.parse(key);
	key = CryptoJS.MD5(key);
    var decrypted = CryptoJS.AES.decrypt(encrypted.toString(),key,
        {
            mode:CryptoJS.mode.ECB,
            padding:CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
}


//密码加密
function getPwdEncryptStr(str){
	var len = str.length;
	return CryptoJS.SHA1(len*len+str+Math.ceil(len*len/10)).toString();
}
