function getCompanyData($http,$cookies,companyId,callback){
	simplePostData({
		"$http":$http,
		"url":HOST_URL+"/admin/account_company",
		"params":"&id="+companyId,
		"$cookies":$cookies,
		"method":"GET",
		"callbackFunction":callback
	});
}
function getProjectData($http,$cookies,pageNum,companyId,callback){
	simplePostData({
		"$http":$http,
		"url":HOST_URL+"/admin/account_project",
		"params":"&companyId="+companyId+"&pageNum="+pageNum+"&pageSize="+10,
		"$cookies":$cookies,
		"method":"GET",
		"callbackFunction":function(response) {
			console.log(response);
			$scope.projectData = response.data;
		}
	});
}