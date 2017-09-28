

function cjMain(){
	var url = basepath + "/weixinWeb/getUserCjByUserId.form";
	ajaxUtils.post(url, {},function(json) {
		var data = eval('('+json+')');
		var htmls = "";
		for(var i = 0; i < data.length; i++){
			var caseId = getIsOkValue(data[i].is_ok_1, data[i].is_ok_2, data[i].is_ok_3);
			var getId = getIsGetValue(data[i].is_get_1, data[i].is_get_2, data[i].is_get_3);
			var config = getConfigName(caseId, getId, data[i]);
			var html = getHtml(caseId, data[i].cj_id, config);
			htmls += html;
		}
		$("#pop_cj_con_id").html(htmls);
	});
}


//领取成就
function receiveCj(obj, cj_id){
//	alert('2017-1-10日后开放');
//	return;
	var url = basepath + "/weixinWeb/updateOkcj.form?cj_id=" + cj_id;
	var liObj = obj.parentNode;
	ajaxUtils.post(url, {},function(json) {
		var data = eval('('+json+')');
		var caseId = getIsOkValue(data.is_ok_1, data.is_ok_2, data.is_ok_3);
		var getId = getIsGetValue(data.is_get_1, data.is_get_2, data.is_get_3);
		var config = getConfigName(caseId, getId, data);
		var html = getHtml(caseId, data.cj_id, config);
		liObj.outerHTML = html;
	}, true);
	
	
}

function getHtml(caseId, cj_id, config){
	var s1 = "<a href='javascript:;' class='cj_btn' onclick='receiveCj(this, " + cj_id + ")' ></a>";
	var s2 = "<span class='cj_txt'>未达成</span>";
	var s3 = "<span class='cj_txt_finish'>已领取</span>";
	var pHtml = getProcessHtml(caseId);
	var res =  "<li class='" + config.className + "'>"+
		"<p>"+
			"<span>" + config.comment +"</span>"+
			"<label>+" + config.rou + "</label>"+
		"</p>"+
		"<div class='loading_bg' >"+
			"<span class='loading_con' style='width:" + config.width + "' ></span>"+
			"<i class='default'></i>" +  pHtml + 
		"</div>"+
		(config.status == 1 ? s1 : (config.status == 2 ? s2 : s3)) +
	"</li>";
	return res;
}

/**
 * 
 * 奖杯颜色HTML控制
 * */
function getProcessHtml(caseId){
	var h1 = "<i class='tong'></i>";
	var h2 = "<i class='yin'></i>";
	var h3 = "<i class='jin'></i>"; 
	var res = "";
	switch (caseId) {
		case 1:
			res = h1;
			break;
		case 2:
			res = h1 + h2;
			break;
		case 3:
			res = h1 + h2 + h3;
			break;
		default:
			break;
	}
	return res;
}

/**
 * return 
 * {
 * 		"className" : "cj_bg1/cj_bg2/cj_bg3",
 * 		"comment" : "comment",
 * 		"rou" : "rou" 
 * 		"width" : "0%, 30%, 60%, 100%" 
 * }
 * 
 * 		cj_bg1 : 领取按钮
 * 		cj_bg2 : 灰色未达成
 * 		cj_bg3 : 已领取
 * */
function getConfigName(caseId, getId, obj){
	var width_arr = ["0%", "30%", "60%", "100%"];
	var config = {
			"className" : "",
			"comment" : "",
			"rou" : "",
			"status" : "",
			"width" : width_arr[caseId]
	};
	
	if(caseId == 0) {
			config.className = "cj_bg2";
			config.rou = obj.rou_1;
			config.comment = obj.comment_0;
			config.status = 2;
	}else{
		config.className = "cj_bg1";
		if(getId == 0){
			config.rou = obj.rou_1;
			config.comment = obj.comment_1;
			config.status = 1;
		}else if(getId == 1){
			config.rou = obj.rou_2;
			config.comment = obj.comment_2;
			if(getId < caseId){
				config.status = 1;
			}else if(getId == caseId){
				config.status = 2;
			}
		}else if(getId == 2){
			config.rou = obj.rou_3;
			config.comment = obj.comment_3;
			config.status = 2;
			if(getId < caseId){
				config.status = 1;
			}else if(getId == caseId){
				config.status = 2;
			}
		}else{
			config.className = "cj_bg3";
			config.rou = obj.rou_3;
			config.comment = obj.comment_3;
			config.status = 3;
		}
	}
	
	return config;
}

/**
 * 
 * 
 * */
function getWidth(){
	
}

function getIsOkValue(is_ok_1, is_ok_2, is_ok_3){
	return parseInt(is_ok_1 + is_ok_2 + is_ok_3);
}

function getIsGetValue(is_get_1, is_get_2, is_get_3){
	return parseInt(is_get_1 + is_get_2 + is_get_3);
}