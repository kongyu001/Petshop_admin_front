app.controller('HomeController', function($scope, $http, $cookies ) {
	
	/*simplePostData({
		"$http":$http,
		"url":HOST_URL+"/dashboard/stats",
		//"url":"test/stat_stats.json",
		"$cookies":$cookies,
		"method":"GET",
		"callbackFunction":function(response) {
			if(response.errorCode === 0){
				$scope.stats = response.data;
			}
		}
	});
	
	simplePostData({
		"$http":$http,
		"url":HOST_URL+"/dashboard/recent_count",
		//"url":"test/stat_stats.json",
		"$cookies":$cookies,
		"method":"GET",
		"callbackFunction":function(response) {
			$scope.generateChart(response.data);
		}
	});
	
	
	var rankeNumber = 5;
	simplePostData({
		"$http":$http,
		"url":HOST_URL+"/dashboard/month_rank",
		//"url":"test/stat_stats.json",
		"$cookies":$cookies,
		"method":"GET",
		"callbackFunction":function(response) {
			$scope.monthRank = response.data;
			if($scope.monthRank.length>rankeNumber){
				$scope.monthRank = $scope.monthRank.slice(0,rankeNumber)
			}
		}
	});
	
	simplePostData({
		"$http":$http,
		"url":HOST_URL+"/dashboard/year_rank",
		//"url":"test/stat_stats.json",
		"$cookies":$cookies,
		"method":"GET",
		"callbackFunction":function(response) {
			$scope.yearRank = response.data;
			if($scope.yearRank.length>rankeNumber){
				$scope.yearRank = $scope.yearRank.slice(0,rankeNumber)
			}
		}
	});
	
	var myChart = echarts.init(document.getElementById('main'));
	var option = {};
	$scope.generateChart = function(stat){
		option = {
			title : {
		        text: '近一个月总查询量',
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		    	data:stat.legend
		    },
		    color: ['#4380db','#7266ba'],
		    toolbox: {
		        show : true,
		        feature : {
		            dataView : {readOnly: false},
		            magicType : {type: ['line', 'bar']},
		            restore : {},
		            saveAsImage : {}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            data : stat.xAxis
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : stat.series.map(function(o){
		    	return $.extend(o,{
			        type:'line',
			        markPoint : {
			            data : [
			                {type : 'max', name: '最大值'},
			                {type : 'min', name: '最小值'}
			            ]
			        },
			        markLine : {
			            data : [
			                {type : 'average', name: '平均值'}
			            ]
			        }
		    	})
		    })
		}
		myChart.setOption(option);
	}*/

	
});