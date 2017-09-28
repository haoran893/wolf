







$(function(){
	//底部四个按钮切换
	$("#myinfo_menu a").each(function(o){
		$(this).click(function(){
			mainHander(o);
		});
	});
	
	createAndSearch();
	
	//点击半透明图层关闭弹框(且关闭自己)
	$(".popup").click(function(e){
		closeGamePopup(e);
	});
	
	//点击编辑个人信息
	$(".edit_info").click(function(e){
		$(".popup").show();
		$(".pop_edit_info").show();
	});

	//点击编辑个人信息
	$(".userDetail_edit").click(function(e){
		$(".popup").show();
		$(".pop_edit_userDetail").show();
		getUserDetail();
	});



	
	//close
	function closeGamePopup(e){
		$(".popup").hide();
		var current_x = e.offsetX;
		var current_y = e.offsetY;
		
		$("#pop_1,#pop_2,#pop_3,#pop_4,#pop_5,#pop_6,#bl_search_div_id,#bl_create_div_id,#myBlInfo_div_id,#pop_detail").hide();
		$(".bl_dd,.bl_add,.bl_search,.bl_con,.pop_introduce,.pop_introduce_pop,.pop_myrou,.pop_product,.pop_product_order,.pop_edit_info,.pop_edit_userDetail").hide();
		
		var count = 0;
		for(var i = 1; i <=4; i++){
			var b = showNewWindowTabs(i, current_x, current_y);
			if(b){
				count = i;
				break;
			}
		}
		if(count != 0){
			mainHander(count - 1);
		}else{
			setBackGroudImages(5);
		}
		
	}
	
	//下方四个亮图
	$("#main_enable_cj,#main_enable_top,#main_enable_shop").click(function(){
		newClose();
	});
	
	$(".pop_bl_bg").each(function(o){
		$(this).click(function(){
			newClose();
		});
	});
	
	
	
	//左点
	$(".role_btn_left").click(function(){
		$("#roleImgId").removeClass("role_animation");
		if(f == true){
			$("#roleImgId").addClass("role_img role_animation");
			$("#roleImgId")[0].src="/mrx/static/weixin/images/main_role3.png";
			f = false;
		}else{
			$("#roleImgId").addClass("role_img role_animation");
			$("#roleImgId")[0].src="/mrx/static/weixin/images/main_role2.png";
			f = true;
		}
	});
	
	//右点
	var f = false;
	$(".role_btn_right").click(function(){
		$("#roleImgId").removeClass("role_animation");
		if(f == true){
			$("#roleImgId").addClass("role_img role_animation");
			$("#roleImgId")[0].src="/mrx/static/weixin/images/main_role3.png";
			f = false;
		}else{
			$("#roleImgId").addClass("role_img role_animation");
			$("#roleImgId")[0].src="/mrx/static/weixin/images/main_role2.png";
			f = true;
		}
		
	});
	
	function showNewWindowTabs(i , current_x, current_y){
		var bool = false;
		var className = "";
		switch (i) {
			case 1:
				className = "btn_cj";
				break;
			case 2:
				className = "btn_bl";
				break;
			case 3:
				className = "btn_ph";
				break;
			case 4:
				className = "btn_js";
				break;
			default:
				break;
		}
		
		var start_x = $("." + className).offset().left;
		var start_y = $("." + className).offset().top;
		var end_x = start_x + $("." + className).width();
		var end_y = start_y + $("." + className).height();
		if(current_x > start_x && current_x < end_x && current_y > start_y && current_y < end_y){
			bool = true;
		}
		return bool;
	}
	
	//搜索部落
	$("#searchAForDivListId").click(function(){
		var name = $("#searchDetailInputId").val();
		serachBl(name);
	});
	
	//我的战绩
	$("#myinfo_left").click(function(){
		$(".popup").show();
		$(".pop_zj").show();
		var url = basepath + "/weixinWeb/getZj.form?";
		ajaxUtils.post(url, {},function(json) {
			var temp = eval('('+json+')');
			var result = temp.result;
			var detail = temp.detail;
			var max_trophy = result.max_trophy;
			var trophy = result.trophy;
			var game_sl_count = result.game_sl_count;
			//var like_count = result.like_count;
			$("#max_trophy_id").text(max_trophy); //innerText 
			$("#trophy_id").text(trophy);
			$("#game_sl_count_id").text(game_sl_count);
			//$("#like_count_id").text(like_count);
			
			var html = "";
			for(var i = 0; i < detail.length; i++){
				var dt = detail[i].dt * 1000;
				var dt_bool = dt < (24 * 60 * 60 * 1000) ? true : false;
				var t = (dt_bool ? MillisecondToDate(dt) : detail[i].dt2);
				var className = detail[i].game_result == "1" ? "odd" : "even";
				var temp = "<li class='" + className + "' onclick='gameDetail(" + detail[i].gameId + ")' > " +
					"<span>" + detail[i].roleName +"</span> " +
					"<p>" + detail[i].game_trophy + "</p> " +
					"<label>" + t + "</label> " +
				"</li>";
				html += temp;
			}
			$("#zj_ul_id").html(html);
		});	
	});
	
	//商城
	$("#myinfo_right").click(function(){
		$(".popup").show();
		$(".pop_myrou").show();
	});
	
	//主页等级长条点击事件
	$(".myinfo_duan").click(function(){
		$(".popup").show();
		$(".pop_introduce").show();
	});
	//常用术语点击
	$(".pop_introduce_btn").click(function(){
		$(".popup").show();
		$(".pop_introduce_pop").show();
	});
	
	//个人排行榜与部落排行榜 tab切换
	$(".mytop_tab a").each(function(o){
		$(this).click(function(){
			debugger;
			$(this).addClass('hover').siblings().removeClass('hover');
			$(".mytop_tab_con"+(o+1)).show().siblings().hide();
			getTop(o == 1 ? "group" : "");
		});
	});
	
//	$("#vipEndTimeId").val($("#vip_endDate").val());
	
	//分享获取
//	shareCj();
});

function shareCj(){
	wx.onMenuShareTimeline({
	    title: title, // 分享标题
	    link: link, // 分享链接
	    imgUrl: imgUrl, // 分享图标
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    	alert('分享成功！');
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
}





function newClose(){
	$(".popup").hide();
	$("#pop_1,#pop_2,#pop_3,#pop_4,#pop_5,#pop_6,#bl_search_div_id,#bl_create_div_id,#myBlInfo_div_id,#pop_detail").hide();
	$(".bl_dd,.bl_add,.bl_search,.bl_con,.pop_introduce,.pop_introduce_pop,.pop_myrou,.pop_product,.pop_product_order,.pop_edit_info,.pop_edit_userDetail").hide();
	setBackGroudImages(5);
}

function mainHander(x){
	if(x != 3){
		setBackGroudImages(x);
		$(".popup").show();
		$("#pop_"+(x + 1)).show();
	}
	switch (x) {
		case 0:
			cjMain();
			break;
		case 1:
			myBl();
			break;
		case 2:
			getTop("");
			break;
		case 3:
			shopMain();
			break;
		default:
			break;
	}
	var obj = $('#jiaobiao' + (x+1));
	if(obj.length > 0){
		userClickNotify(x + 1);
	}
}


function setBackGroudImages(x){
	for(var i = 0; i < 4; i++){
		if(x != i){
			$("#bg_below_button_id_" + i).show();
		}else{
			$("#bg_below_button_id_" + i).hide();
		}
		
	}
	
}


function updateUserInfo(){
	var title = $("#user_detail_title").val();
	var name = $("#user_detail_name").val();
	var sex = $("#user_detail_sex").val();
	var cards = $("#user_detail_cards").val();
	var qq = $("#user_detail_qq").val();
	var weixin = $("#user_detail_weixin").val();
	var email = $("#user_detail_email").val();
	var city = $("#user_detail_city").val();
	var like_role = $("#user_detail_like_role").val();
	
	if(title == null || title == "" ){
		alert("请输入口头禅");return;
	}
	if(title.length > 15){
		alert("口头禅不能超过15个字");return;
	}
	
	
	if(name == null || name == ""){
		alert("请输入姓名");return;
	}
	
	if(sex == null || sex == ""){
		alert("请选择性别");return;
	}
	
	if(like_role == null || like_role == ""){
		alert("请输入喜欢的身份");return;
	}
	


	//if(email == null || email == ""){
	//	alert("请输入邮箱地址");return;
	//}
	//
	//if(city == null || city == ""){
	//	alert("请输入所在城市");return;
	//}
	var param ="?title=" + title + "&name=" + name + "&sex=" + sex + "&cards=" + cards
	 + "&qq=" + qq + "&weixin=" + weixin + "&email=" + email + "&city=" + city + "&like_role=" + like_role;
	var url = basepath + "/weixinWeb/insertUserDetail.form" + param;
	
	ajaxUtils.post(url, {},function(data) {
		var json = eval('('+data+')');
		//-1 系统异常 	1 已注册 	0 成功
		if (json.result != 'success') {
			alert('系统异常！');
		}else{
			alert('保存成功！');
			newClose();
		}
	});	
}

var vipid = '';