app.controller('RoleController', function($scope, $http, $cookies) {
	//加载角色列表
	$scope.loadList = function(pageNum, searchName) {
		if(searchName === undefined || searchName === "") {
			if(pageNum === undefined) {
				pageNum = 1;
			}
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/roles",
				"$cookies": $cookies,
				"method": "GET",
				"params": "?pageNum=" + pageNum + "&pageSize=" + 8,
				"callbackFunction": function(response) {
					$scope.roles = response.data;
					$scope.pageParams = getPageParams(response.pageNum, response.pages);
				},
				"errorCallbackFunction":function(){
				$scope.roles={};
			}
			});
		} else {
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/roles/name/" + searchName,
				"$cookies": $cookies,
				"method": "GET",
                "params": "?pageNum=" + pageNum + "&pageSize=" + 8,
				"callbackFunction": function(response) {
					$scope.roles = response.data;
                    $scope.pageParams = getPageParams(response.pageNum, response.pages);
				},
				"errorCallbackFunction":function(){
				$scope.roles={};
			}
			});
		}

	}
	$scope.loadList();
	simplePostData({
		"$http": $http,
		"url": HOST_URL + "/auths",
		//"url":"test/merchant.json",
		"$cookies": $cookies,
		"method": "GET",
		"callbackFunction": function(response) {
			$scope.auths = response.data.map(function(auth) {
				return {
					id: auth.id.toString(),
					authName: auth.authName
				}
			});
		}
	});
	//添加角色
	$scope.addRole = function() {
			$('#myModal').modal('show');
			$scope.editMode = 0;

			$('#authList').selectpicker("val", []);
			$scope.role = {};

			$scope.addRoleClick = function(data) {
				console.log(data);
				if(data.roleName === undefined || data.roleName === '') {
					toastr.info('请填写角色名！');
				} else {
					if(data.authList) {
						data.authList = data.authList.map(function(a) {
							return {
								"id": a
							}
						});
					}
					simplePostData({
						"$http": $http,
						"url": HOST_URL + "/roles",
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
			}
		}
		//编辑角色
	$scope.editRole = function(role) {
			$('#myModal').modal('show');
			$scope.editMode = 1;
			role.authIdList = [];
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/roles/" + role.id,
				"$cookies": $cookies,
				"method": "GET",
				"callbackFunction": function(response) {
					console.log(response.data);
					$scope.role = response.data;

					if($scope.role.authList !== []) {
						$scope.role.authList = $scope.role.authList.map(function(a) {
							return a.id + "";
						});
					}
					$('#authList').selectpicker("val", $scope.role.authList);
				}
			});

			$scope.addRoleClick = function(data) {
				console.log(data);
				if(data.authList.length !== 0) {
					if(data.authList[0].id === undefined) {
						data.authList = data.authList.map(function(a) {
							return {
								"id": a
							}
						});
					}
				}
				console.log(data);
				simplePostData({
					"$http": $http,
					"url": HOST_URL + "/roles/" + data.id,
					"$cookies": $cookies,
					"data": {
						"data": data
					},
					"method": "PUT",
					"callbackFunction": function(response) {
						$('#myModal').modal('hide');
						toastr.success('修改成功！');
						$scope.loadList();
					}
				});
			}
		}
		//删除角色
	$scope.deleteRole = function(role) {
		$('#deleteModal').modal('show');
		$scope.roleName = role.roleName;
		$scope.deleteRoleClick = function() {
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/roles/" + role.id,
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

});