app.controller('customController', function($scope, $http, $cookies) {

	//获取列表以及搜索功能
	$scope.loadList = function(pageNum, searchName) {
		if(searchName === undefined || searchName === "") {
			if(pageNum === undefined) {
				pageNum = 1;
			}
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/customs",
				"$cookies": $cookies,
				"method": "GET",
                "params": "?pageNum=" + pageNum + "&pageSize=" + 8,
				"callbackFunction": function(response) {
					$scope.customs = response.data;
					$scope.pageParams = getPageParams(response.pageNum, response.pages);
				},
				"errorCallbackFunction":function(){
				$scope.customs={};
			}
			});
		} else {
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/customs/search?q=" + searchName,
				"$cookies": $cookies,
				"params": "&pageNum=" + pageNum + "&pageSize=" + 8,
                "method": "GET",
				"callbackFunction": function(response) {
					$scope.customs = response.data;
                    $scope.pageParams = getPageParams(response.pageNum, response.pages);
				},
				"errorCallbackFunction":function(){
				$scope.customs={};
			}
			});
		}

	}
	$scope.loadList();
	//获取新建用户的角色列表
	simplePostData({
		"$http": $http,
		"url": HOST_URL + "/roles",
		//"url":"test/merchant.json",
		"$cookies": $cookies,
		"method": "GET",
		"callbackFunction": function(response) {
			$scope.roles = response.data.map(function(role) {
				return {
					id: role.id.toString(),
					roleName: role.roleName
				}
			});
		}
	});
	//添加用户
	$scope.addCustom = function() {
			$('#myModal').modal('show');
			document.getElementById("imgSdf").style.visibility = "hidden";
			$scope.editMode = 0;
			$scope.custom = {};
			$('#roleAddList').selectpicker("val", []);

			$scope.add_submit = function() {
				var reader = new FileReader();
				var file = document.getElementById("upload").files[0];
				var img = document.getElementById('imgSdf');
				//读取File对象的数据  
				reader.onload = function(evt) {
					//data:img base64 编码数据显示  
					img.width = "100";
					img.height = "100";
					img.src = evt.target.result;
				}
				reader.readAsDataURL(file);
				document.getElementById("imgSdf").style.visibility = "visible";
				$('#uploadModal').modal('hide');

			}
			$scope.addCustomClick = function(data) {
				if(data.roleList !== undefined && data.roleList !== []) {
					data.roleList = data.roleList.map(function(a) {
						if(data.roleList[0].id === undefined) {
							return {
								"id": a
							}
						}
					});
				}
				if(data.customName === undefined || data.customName === '') {
					toastr.info('请填写用户名！');
				} else if(data.password === undefined || data.password === '') {
					toastr.info('请填写密码！');
				} else if(data.customPhoneNumber === "") {
					console.log(data.customPhoneNumber);
					data.customPhoneNumber = undefined;
				} else {
					simplePostData({
						"$http": $http,
						"url": HOST_URL + "/customs",
						"$cookies": $cookies,
						"data": {
							"data": {
								customName: data.customName,
								customNickname: data.customNickname,
								customNameEncrypted: getPwdEncryptStr(data.customName),
								password: getPwdEncryptStr(data.password),
								customEmail: data.customEmail,
								customPhoneNumber: data.customPhoneNumber,
								roleList: data.roleList,
							}
						},
						"method": "POST",
						"callbackFunction": function(custom) {
							$('#myModal').modal('hide');
							toastr.success("新建成功！");
							$scope.addphoto = custom.data;
							//上传图片
							var form = new FormData();
							var file = document.getElementById("upload").files[0];
							form.append('file', file);
							$http({
								method: 'POST',
								url: HOST_URL + '/images/customs/' + $scope.addphoto.id,
								data: form,
								headers: {
									'Authorization': $.cookie('userId') + ';' + nonce + ';' + generateSign($.cookie('userId'), nonce, $.cookie("token")),
									'Content-Type': undefined
								},
								transformRequest: angular.identity
							}).success(function(data) {}).error(function(data) {
								toastr.error('upload fail');
							})
							$scope.loadList();
						},
						"errorCallbackFunction":function(result) {
							toastr.error('输入的格式不对哦！');
							$scope.addCustom();
						}
					})
				}
			}
		}
		//编辑用户
	$scope.editCustom = function(custom) {
			$('#myEditModal').modal('show');
			$scope.editMode = 1;
			var file = null;
			//获取用户
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/customs/" + custom.id,
				"$cookies": $cookies,
				"method": "GET",
				"callbackFunction": function(response) {
					var auth = $.cookie('userId') + ';' + nonce + ';' + generateSign($.cookie('userId'), nonce, $.cookie("token"));
					$scope.custom = response.data;
					$scope.custom.getfile = HOST_URL + "/images/customs/" + custom.id + "?authorization=" + auth; //获取图片
					if($scope.custom.roleList !== []) {
						$scope.custom.roleList = $scope.custom.roleList.map(function(a) {
							return a.id + "";
						})
					}
					$('#roleEditList').selectpicker("val", $scope.custom.roleList);
				}
			});
			$scope.add_submit = function(file) {
				var reader = new FileReader();
				file = document.getElementById("upload").files[0];
				var img = document.getElementById('imgEdit');
				//读取File对象的数据  
				reader.onload = function(evt) {
					//data:img base64 编码数据显示  
					img.width = "100";
					img.height = "100";
					img.src = evt.target.result;
				}
				reader.readAsDataURL(file);
				document.getElementById("imgSdf").style.visibility = "visible";
				$('#uploadModal').modal('hide');
			}
			$scope.addCustomClick = function(data) {
				if(data.roleList.length > 0) {
					if(data.roleList[0].id === undefined) {
						data.roleList = data.roleList.map(function(a) {
							return {
								"id": a
							}
						});
					}
				}
				simplePostData({
					"$http": $http,
					"url": HOST_URL + "/customs/" + custom.id,
					"$cookies": $cookies,
					"data": {
						"data": {
							customName: data.customName,
							customNickname: data.customNickname,
							customNameEncrypted: getPwdEncryptStr(data.customName),
							customEmail: data.customEmail,
							customPhoneNumber: data.customPhoneNumber,
							roleList: data.roleList,
						}
					},
					"method": "PUT",
					"callbackFunction": function(custom) {
						$('#myEditModal').modal('hide');
						toastr.success('编辑成功！');
						$scope.addphoto = custom.data;
						var form = new FormData();
						var file = document.getElementById("upload").files[0];
						if(file) {
							form.append('file', file);
							$http({
								method: 'POST',
								url: HOST_URL + '/images/customs/' + $scope.addphoto.id,
								data: form,
								headers: {
									'Authorization': $.cookie('userId') + ';' + nonce + ';' + generateSign($.cookie('userId'), nonce, $.cookie("token")),
									'Content-Type': undefined
								},
								transformRequest: angular.identity
							}).success(function(data) {
								var auth = $.cookie('userId') + ';' + nonce + ';' + generateSign($.cookie('userId'), nonce, $.cookie("token"));
								$scope.custom.getfile = HOST_URL + "/images/customs/" + $scope.addphoto.id + "?authorization=" + auth; //获取图片
							}).error(function(data) {
								toastr.error('upload fail');
							})
						}
						$scope.loadList();
					}
				});
			}
		}
		//删除用户
	$scope.deleteCustom = function(custom) {
		$('#deleteModal').modal('show');
		$scope.customName = custom.customName;
		$scope.deletecustomClick = function() {
			simplePostData({
				"$http": $http,
				"url": HOST_URL + "/customs/" + custom.id,
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