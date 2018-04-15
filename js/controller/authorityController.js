app.controller('AuthController', function($scope, $http, $cookies) {
	$scope.loadList = function(pageNum) {
		if(pageNum == undefined) {
			pageNum = 1;
		}
		simplePostData({
			"$http": $http,
			"url": HOST_URL + "/auths",
			"params": "?pageNum=" + pageNum + "&pageSize=" + 8,
			"$cookies": $cookies,
			"method": "GET",
			"callbackFunction": function(response) {
				$scope.auths = response.data
				$scope.pageParams = getPageParams(response.pageNum, response.pages);
			}
		});
	}
	$scope.loadList();

	//添加权限
	$scope.addAuthority=function(){
		$scope.creatAuthority = {};
		$('#myModal').modal('show');
	}
	$scope.addAuthorityClick = function(data) {
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/auths",
				"$cookies": $cookies,
				"data": {
					"data": data
				},
				"method": "POST",
				"callbackFunction": function(response) {
					$('#myModal').modal('hide');
					toastr.success('添加成功！');
					$scope.loadList();
				}
			});

		}
		//编辑权限

	$scope.editAuthority = function(data) {
			$('#editModal').modal('show');
			$scope.editMode = 1;
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/auths/"+data.id,
				"$cookies": $cookies,
				"method": "GET",
				"callbackFunction": function(response) {
					console.log(response.data);
					$scope.editAuth=response.data;
				}
			});
			$scope.editAuthorityClick = function(data) {
				console.log(data);
				if(data.authName === "" || data.authName === undefined) {
					toastr.info('您还没有填写正确的权限！');
				} else {

					simplePostData({
						"$http": $http,
						"url": HOST_URL + "/auths/" + data.id,
						"$cookies": $cookies,
						"data": {
							"data": data
						},
						"method": "PUT",
						"callbackFunction": function(response) {
							$('#editModal').modal('hide');
							toastr.success('修改成功！');
							$scope.loadList();
						}
					});
				}
			}
		}
		//删除权限

	$scope.deleteAuth = function(auth) {
		$('#deleteModal').modal('show');
		$scope.authName = auth.authName;
		$scope.deleteAuthClick = function() {
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/auths/" + auth.id,
				//"url":"./pages/test/data1.json"+ auth.id,
				"$cookies": $cookies,
				"method": "DELETE",
				"callbackFunction": function(response) {
					$('#deleteModal').modal('hide');
					toastr.success('删除成功！');
					$scope.loadList();
				}
			});
		}
	}
})