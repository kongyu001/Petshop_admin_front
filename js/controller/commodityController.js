app.controller('CommodityController', function ($scope, $http, $cookies) {
    //请求图片前，加入authorization
    $scope.loadList = function (pageNum) {
        if (pageNum == undefined) {
            pageNum = 1;
        }
        simplePostData({
            "$http": $http,
            "url": HOST_URL + "/commodities",
            "$cookies": $cookies,
            "method": "GET",
            "params": "?pageNum=" + pageNum + "&pageSize=" + 8,
            "callbackFunction": function (response) {
                $scope.commodities = response.data;
                $scope.pageParams = getPageParams(response.pageNum, response.pages);
            }
        });
    }
    $scope.loadList();

    //获取品类列表
    simplePostData({
        "$http": $http,
        "url": HOST_URL + "/categories",
        "$cookies": $cookies,
        "method": "GET",
        "callbackFunction": function (response) {
            $scope.resources = response.data.map(function (category) {
                return {
                    id: category.id,
                    categoryName: category.categoryName
                }
            });
        }
    });

    //限制input输入
    $scope.input_limit = function (data) {
        var ok = true;
        if (data.commodityName === undefined || data.commodityName === "") {
            toastr.error('必须填写商品名称哦！');
            ok = false;
        } else if (data.commodityPrice < '0' || data.commodityPrice === undefined || data.commodityPrice === "") {
            toastr.error('请填写正确的价格！');
            ok = false;
        } else if (data.commodityLast === undefined || data.commodityLast === "") {
            toastr.error('请填写正确的库存数量！');
            ok = false;
        } else if (data.commoditySold === undefined || data.commoditySold === "") {
            toastr.error('请填写正确的已售数量！');
            ok = false;
        }
        return ok;
    }

    //上传图片时，直接显示缩略图
    $scope.show_photo = function () {
        var reader = new FileReader();
        var file = document.getElementById("edit_upload").files[0];
        var img = document.getElementById('imgEdf');
        //读取File对象的数据
        reader.onload = function (evt) {
            //data:img base64 编码数据显示
            img.width = "100";
            img.height = "100";
            img.src = evt.target.result;
        }
        reader.readAsDataURL(file);
        document.getElementById("imgEdf").style.visibility = "visible";
        $('#edit_uploadModal').modal('hide');

    }

    //修改信息，put方法
    $scope.edit_info = function (edit) {
        simplePostData({
            "$http": $http,
            "url": HOST_URL + "/commodities/" + edit.id,
            "$cookies": $cookies,
            "data": {
                "data": edit
            },
            "method": "PUT",
            "callbackFunction": function (response) {
            }
        });
    }

    //上传信息后得到ID，再上传图片并显示
    $scope.info_photo = function (data) {
        simplePostData({
            "$http": $http,
            "url": HOST_URL + "/commodities",
            "$cookies": $cookies,
            "data": {
                "data": data
            },
            "method": "POST",
            "callbackFunction": function (response) {
                $('#myModal').modal('hide');
                $scope.addphoto = response.data;
                var form = new FormData();
                var file = document.getElementById("upload").files[0];
                form.append('file', file);
                $http({
                    method: 'POST',
                    url: HOST_URL + '/images/commodities/' + $scope.addphoto.id,
                    data: form,
                    headers: {
                        'Authorization': $.cookie('userId') + ';' + nonce + ';' + generateSign($.cookie('userId'), nonce, $.cookie("token")),
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {
                    console.log('upload success!!!!!');
                }).error(function (data) {
                    toastr.error('图片上传失败！');

                })
            }
        });

    }

    //添加商品
    $scope.addCommodity = function () {
        $('#myModal').modal('show');
        $scope.editMode = 0;
        $scope.newCommodity = {};
        document.getElementById("imgSdf").style.visibility = "hidden";//清空图片
        $('#resourceList').selectpicker("val", []);
        $scope.add_submit = function (data) {
            //直接显示缩略图
            var reader = new FileReader();
            var file = document.getElementById("upload").files[0];
            var img = document.getElementById('imgSdf');
            //读取File对象的数据
            reader.onload = function (evt) {
                //data:img base64 编码数据显示
                img.width = "100";
                img.height = "100";
                img.src = evt.target.result;
            }
            reader.readAsDataURL(file);
            document.getElementById("imgSdf").style.visibility = "visible";
            $('#uploadModal').modal('hide');
        }
        $scope.editCommodityClick = function (data) {
            console.log(data);
            if ($scope.input_limit(data)) { /*限制input*/
                $scope.info_photo(data);
                toastr.success('添加成功！');
                $scope.loadList();
            }
        }
    }

    //编辑商品
    $scope.editCommodity = function (old_Cmdt) {
        $('#myModal').modal('show');
        $scope.editMode = 1;
        //获取商品信息
        simplePostData({
            "$http": $http,
            "url": HOST_URL + "/commodities/" + old_Cmdt.id,
            "$cookies": $cookies,
            "method": "GET",
            "callbackFunction": function (response) {
                console.log(response.data);
                var auth = $.cookie('userId') + ';' + nonce + ';' + generateSign($.cookie('userId'), nonce, $.cookie("token"));
                $scope.newCommodity = {};
                $scope.newCommodity = response.data;
                $scope.newCommodity.getfile = HOST_URL + "/images/commodities/" + $scope.newCommodity.id + "?authorization=" + auth; //获取图片
                //下拉品类列表
                $scope.newCommodity.commodityCategoryIdList = [];
                if ($scope.newCommodity.commodityCategoryList !== []) {
                    $scope.newCommodity.commodityCategoryIdList = $scope.newCommodity.commodityCategoryList.map(function (a) {
                        console.log($scope.newCommodity.commodityCategoryIdList);
                        return a.id + "";
                    })
                }
                $('#categoryList').selectpicker("val", $scope.newCommodity.commodityCategoryIdList);
            }
        });
    }
    $scope.cancel = function () {
        $scope.newCommodity = {};
    }
    $scope.submit = function (data) {
        if ($scope.input_limit(data)) { /*限制input*/
            $scope.show_photo();//显示缩略图
        }
    }
    $scope.editCommodityClick = function (commodity_info) {
        console.log(commodity_info);
        if ($scope.input_limit(commodity_info)) { /*限制input*/
            //上传图片
            var form = new FormData();
            var file = document.getElementById("edit_upload").files[0];
            form.append('file', file);
            $http({
                method: 'POST',
                url: HOST_URL + '/images/commodities/' + $scope.newCommodity.id,
                data: form,
                headers: {
                    'Authorization': $.cookie('userId') + ';' + nonce + ';' + generateSign($.cookie('userId'), nonce, $.cookie("token")),
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).success(function (data) {
            }).error(function (data) {
                toastr.error('图片修改失败');
            })

            $scope.edit_info(commodity_info);
            toastr.success('修改成功！');
            $('#myModal').modal('hide');
        }
    }


    //删除商品
    $scope.deleteCommodity = function (commodity) {
        $('#deleteModal').modal('show');
        $scope.name = commodity.name;
        $scope.deleteUserClick = function () {
            simplePostData({
                "$http": $http,
                "url": HOST_URL + "/commodities/" + commodity.id,
                "$cookies": $cookies,
                "method": "DELETE",
                "callbackFunction": function (response) {
                    $('#deleteModal').modal('hide');
                    toastr.success('删除成功！');
                    $scope.loadList();
                }
            });
        }
    }

    //搜索商品
    $scope.searchCommodity = function (searchname) {
        simplePostData({
            "$http": $http,
            "url": HOST_URL + "/commodities/search?q=" + searchname + "&pageNum=1&pageSize=20",
            "$cookies": $cookies,
            "method": "GET",
            "callbackFunction": function (response) {
                toastr.success('搜索成功！');
                $scope.commodities = response.data;
            },
            "errorCallbackFunction": function () {
                $scope.commodities = {};
            }
        });
    }

    //限制商品价格输入格式
    $scope.input_price = function (obj, attr) {
        //先把非数字的都替换掉，除了数字和.
        obj[attr] = obj[attr].replace(/[^\d.]/g, "");
        //必须保证第一个为数字而不是.
        obj[attr] = obj[attr].replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj[attr] = obj[attr].replace(/\.{2,}/g, "");
        //保证.只出现一次，而不能出现两次以上
        obj[attr] = obj[attr].replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    }

});