/**
 * Created by peilu.wang on 2016/7/20.
 * Modified by liang.zhou on 2016/11/07
 */

/**
 * 获得页面上显示的页码，默认前2页至后2页共5页
 * pageNum:当前页码
 * totalPages:页面总数
 */
function getPageParams(pageNum, totalPages) {
	pageNum = parseInt(pageNum);
	totalPages = parseInt(totalPages);
	//获得开始和结束页码
	fromId = pageNum-2<1?1:pageNum-2;
	toId = fromId+4>totalPages?totalPages:fromId+4;
	fromId = toId-4<1?1:toId-4;
	
	var pageArray = new Array();
	for(var i=fromId;i<=toId;i++){
		pageArray.push(i);
	}
	
	pageParams = {};
	pageParams["pageNum"] = pageNum;
	pageParams["pages"] = totalPages;
	pageParams["pageArray"] = pageArray;
	return pageParams;
}