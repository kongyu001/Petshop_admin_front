app.controller('CategoryController', function($scope, $http, $cookies) {
	$scope.loadList = function(pageNum) {
		if(pageNum == undefined) {
			pageNum = 1;
		}
		simplePostData({
			"$http": $http,
			"url": HOST_URL + "/categories",
			"params": "?pageNum=" + pageNum + "&pageSize=" + 8,
			"$cookies": $cookies,
			"method": "GET",
			"callbackFunction": function(response) {
				$scope.category = response.data
				$scope.pageParams = getPageParams(response.pageNum, response.pages);
			}
		});
	}
	$scope.loadList();
	
	//添加品类
	$scope.addCate=function(data){
		$('#myModal').modal('show');
		$scope.addCategory={};
	}
	$scope.addCategoryClick = function(data) {
		console.log(data);
		simplePostData({
			"$http": $http,
			"url": HOST_URL + "/categories",
			"$cookies": $cookies,
			"data": {
				"data": data
			},
			"method": "POST",
			"callbackFunction": function(response) {
				$('#myModal').modal('hide');
				toastr.success('添加品类成功！');
				$scope.category = {};
				$scope.loadList();
			}
		});

	}

	//编辑品类
	$scope.editCategory = function(cate) {
		$('#editModal').modal('show');
		$scope.editMode = 1;
		simplePostData({
			"$http":$http,
			"url":HOST_URL+"/categories/"+cate.id,
			"$cookies":$cookies,
			"method": "GET",
			"callbackFunction": function(response) {
				$scope.editCate=response.data;
			}
		})
		$scope.editCategoryClick = function(data) {
			if(data.categoryName === "" || data.categoryName === undefined) {
				toastr.info('您还没有填写正确的品类名称！');
			} else {
				simplePostData({
					"$http": $http,
					"url": HOST_URL + "/categories/" + data.id,
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

	//删除品类

	$scope.deleteCate = function(cate) {
			$('#deleteModal').modal('show');
			$scope.cateName = cate.cateName;
			$scope.deleteCateClick = function() {
				simplePostData({
					"$http": $http,
					"url": HOST_URL + "/categories/" + cate.id,
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
	
		//搜索品类
	$scope.searchCate = function(Cate) {
		simplePostData({
			"$http": $http,
			"url": HOST_URL + "/categories/search/" + Cate.cateName,
			"$cookies": $cookies,
			"method": "GET",
			"callbackFunction": function(response) {
				console.log(response.data);
				$scope.category = response.data;
				toastr.success('查找成功！');
			},
			"errorCallbackFunction":function(){
				$scope.category={};
			}
		});
	}
})