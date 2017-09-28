


function myBl(){
	var url = basepath + "/weixinWeb/getMyTribe.form";
	ajaxUtils.post(url, {},function(jsonData) {
		var json = eval('('+jsonData+')');
		var res = json.res;
		var result = json.result;
		
		
		if(res == "T"){
			$("#myBlInfo_div_id").show();
			$(".bl_con").show();
			
			$(".bl_dd").hide();
			var mapData = json.mapData;
			$("#bl_con_name_id").html(mapData.name);
			$("#bl_con_hua_id").html(mapData.group_trophy);
			$("#bl_con_detail_id").html(mapData.comment);
			var html = "";
			for(var i = 0; i < result.length; i++){
				var className = i % 2 == 0 ? "mytop_odd" : "mytop_even";
				var mytopList = getTableClass(i);
				var temp =
				"<li class='" + className + "'> " + 
					"<i class='" + mytopList + "'>" + (i+1) +"</i> " + 
					"<span>" + result[i].name + "</span> " + 
					"<label>" + parseInt(result[i].trophy) + "</label> " + 
				"</li>";
				html += temp;
			}
			$("#bln_ul_id").html(html);
			
			
		}else{
			$(".bl_dd").show();
		}
	});
}



function createAndSearch(){
	//goto搜索部落按钮事件
	$("#bl_searchBtn_id").click(function(){
		$("#pop_2").hide();
		$("#bl_search_div_id").show();
		$(".bl_search").show();
		
		var name = $("#bl_search_input_id").val();
		$("#searchDetailInputId").val(name);
		serachBl(name);
	});
	
	//goto创建部落按钮事件
	$("#bl_createBtn_id").click(function(){
		$("#pop_2").hide();
		$(".bl_dd").hide();
		$("#bl_create_div_id").show();
		$(".bl_add").show();
	});
	
	
	//创建部落按钮事件
	$("#create_bl_btn").click(function(){
		var name = $("#create_bl_name").val();
		var comment = $("#create_bl_comment").val();
		if(name == null || name == ''){
			alert("部落名称不能为空！");
			return;
		}
		if(name.length > 4){
			alert("部落名称最长为4个字！");
			return;
		}
		if(comment == null || comment == ''){
			alert("部落描述不能为空！");
			return;
		}
		if(comment.length > 20){
			alert("部落描述最长为20个字！");
			return;
		}
		var par = "name=" + name + "&comment=" + comment;
		var url = basepath + "/weixinWeb/insertUserGroup.form?" + par;
		ajaxUtils.post(url, {},function(r) {
			if(r == '0'){
				alert('部落创建成功!');
				newClose();
			}else if(r == '1'){
				alert('肉不足，请去充值！');
			}else if(r == '2'){
				alert('部落名称重复,');
			}else{
				alert('系统异常，请退出公众号重新进入');
			}
		});	
	});
}

//退出部落
function exitsGroup(){
	var url = basepath + "/weixinWeb/exitUserGroup.form";
	ajaxUtils.post(url, {},function(r) {
		window.location.reload();
	});
}

function serachBl(name){
	if(name == "" || name == null){
		alert("请输入要搜索的部落名称！");
		return;
	}
	$(".bl_dd").hide();
	$(".bl_search").show();
	var url = basepath + "/weixinWeb/selectGroup.form?name="+name;
	ajaxUtils.post(url, {},function(jsonData) {
		var json = eval('('+jsonData+')');
		if(json == null || json == "" || json.length == 0){
			alert("未搜索到相关部落名称！");
			return;
		}
		var html = "";
		for(var i = 0; i < json.length; i++){
			var temp = "<li> " +
			"<span>" + json[i].name + "</span> " +
			"<a href='javascript:;' id='" + json[i].id + "' class='bl_search_tab_btn'></a> " +
			"</li>";
			html += temp;
		}
		$("#search_ul_id").html(html);
		
		//加入部落
		$(".bl_search_tab_btn").each(function(){
			$(this).click(function(){
				$(".bl_search").hide();
				$(".bl_con").show();
				var url = basepath + "/weixinWeb/updateUserGroup.form?group_id=" + $(this)[0].id;
				ajaxUtils.post(url, {},function(json) {
					//$(".popup").hide();
					myBl();
				});
			});
		});
	});
}