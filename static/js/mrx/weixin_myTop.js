//个人排行榜与部落排行榜 tab切换
//$(".mytop_tab a").each(function(o){
//	$(this).click(function(){
//		$(this).addClass('hover').siblings().removeClass('hover');
//		$(".mytop_tab_con"+(o+1)).show().siblings().hide();
//	});
//});


function getTop(flg){
	var url = basepath + "/weixinWeb/getMyTop.form?flg=" + flg;
	ajaxUtils.post(url, {},function(results) {
		var datas = eval('('+results+')');
		var json = datas.list;
		var topList = datas.topList;
		var dr = datas.datetime_res;
		$("#last_time_id").text(dr);
		
		var topHtml = "";
		for(var i = 0; i < topList.length; i++){
			var temp = " <p class='ph_list ph_list" + (i + 1) +"'> "+
				"<span>"  + topList[i].name +"</span> "+
				"<label>"  + topList[i].trophy +"</label> "+
			"</p> ";
			topHtml += temp;
		}
		$("#myTopSeason_id").html(topHtml);
		
		var html = "";
		for(var i = 0; i < json.length; i++){
			var className = i % 2 == 0 ? "mytop_odd" : "mytop_even";
			var mytopList = getTableClass(i);
			var temp = " <li class='" + className + "'> " +
				"<i class='"+mytopList+"'>" + (i+1) + "</i> " +
				"<span>" + json[i].name + "</span> " +
				"<label>" + parseInt(json[i].trophy) + "</label> " +
				"</li> "; 
			html += temp;
		}
		var id = (flg == "" ? "myTop_ul_all_id" : "myTop_ul_group_id");
		$("#" + id).html(html);
	});	
}

