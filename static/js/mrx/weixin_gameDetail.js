//战绩明细
function gameDetail(gameId){
	newClose();
	var url = basepath + "/weixinWeb/getGameDetail.form?gameId=" + gameId;
	ajaxUtils.post(url, {},function(d) {
		$(".popup").show();
		$("#pop_detail").show();
		var json = eval('('+d+')');
		
		var html = "";
		for(var i = 0; i < json.length; i++){
			var data = json[i];
			html += getGamePicHtml(i, data, json.length);
		}
//		html += "<span class='origin' >" + getGameResult(json) + "</span>";
		html += "<img class='origin' id='gameDetail_gameResult' src='" + basepath + "/static/weixin/images/gameresult_" + json[0].gameRes +".png'>";
		$("#pop_detail").html(html);
	});	
}

/**
 *	获取战绩明细的标志的HTML
 * */
function getGamePicHtml(i, data, len){
	var name = data.name;
	var roleName = data.roleName;
	var isMy = data.isMy;
	var isMyRes = isMy == "1" ? "hover" : "" ;
	var is_prophet_first_view = data.is_prophet_first_view;//首验
	var is_first_kill = data.is_first_kill;//首杀
	
	var two = getDC(is_prophet_first_view, is_first_kill);
//	var f = getDCS(is_witch_rescued, is_witch_kill, is_hunter_kill, is_constable_view);
	
	var	html = "<a href='javascript:;' class='dk" + getGameForI(len, i) + " "+ isMyRes +"'>"+
			"<i class='game_jiaobiao'>" + (i+1) + "</i>"+
			"<span class='game_name'> " + name + "</span>"+
			"<span class='game_name_cn'>" + roleName + "</span>";
	var temp = "";
	switch (two) {
		case 0:
			temp = "<div class='style3'>" + getFlagHtml(data) + "</div>";
			break;
		case 1:
			temp = "<div class='style2'>" + getFlagHtml(data) + "</div>";;
			break;
		case 2:
			temp = "<div class='style1'>" + getFlagHtml(data) + "</div>";
			break;
		default:
			break;
	}
	var endHtml = "</a>";
	return html + temp + endHtml;
}

/**
 * flag:
 * 1: 首验
 * 2: 首杀
 * 3: 毒
 * 4: 枪
 * 5: 救
 * 6: 警长
 * */
function getFlagHtml(data){
	var html = "";
	var is_prophet_first_view = data.is_prophet_first_view;//首验
	var is_first_kill = data.is_first_kill;//首杀
	
	var is_witch_kill = data.is_witch_kill;//毒
	var is_hunter_kill = data.is_hunter_kill; //枪
	var is_witch_rescued = data.is_witch_rescued;//救
	var is_constable_view = data.is_constable_view;//警长
	var imgConfig = {
			img1:'<img class="biao_img1" src="' + basepath +'/static/weixin/images/game_ss.png" />',
			img2:'<img class="biao_img2" src="' + basepath +'/static/weixin/images/game_sy.png" />',
			img3:'<img class="biao_img3" src="' + basepath +'/static/weixin/images/game_jz.png" />',
			img4:'<img class="biao_img4" src="' + basepath +'/static/weixin/images/game_qiang.png" />',
			img5:'<img class="biao_img5" src="' + basepath +'/static/weixin/images/game_jiu.png" />',
			img6:'<img class="biao_img6" src="' + basepath +'/static/weixin/images/game_du.png" />'
	};
	
	html += parseInt(is_first_kill) == 1 ? "<i class='" + getBiaoIndex(html) + "'>" + imgConfig.img1 + "</i> " : " ";
	html += parseInt(is_prophet_first_view) == 1 ? "<i class='" + getBiaoIndex(html) + "'>" + imgConfig.img2 + "</i> " : " ";
	html += parseInt(is_constable_view) == 1 ? "<i class='" + getBiaoIndex(html) + "'>"  + imgConfig.img3 + "</i> " : " ";
	html += parseInt(is_hunter_kill) == 1 ? "<i class='" + getBiaoIndex(html) + "'>" + imgConfig.img4 + "</i> " : " ";
	html += parseInt(is_witch_rescued) == 1 ? "<i class='" + getBiaoIndex(html) + "'>" + imgConfig.img5 + "</i> " : " ";	
	html += parseInt(is_witch_kill) == 1 ? "<i class='" + getBiaoIndex(html) + "'>" + imgConfig.img6 + "</i> " : " ";	
	return html;
}

function getBiaoIndex(html){
	var cust = "biao_postion_";
	var res = 1;
	var last = html.lastIndexOf(cust);
	if(last <= 0){
		return cust + res;
	}
	var temp = last + cust.length;
	res = html.substring(temp, temp + 1);
	return cust + (parseInt(res) + 1);
}



/**
 * 1：狼人胜利,
 * 2：神民胜利,
 * 3：人狼恋胜利,
 * 4：吹笛者胜利,
 * 5：平局
 * */
function getGameResult(json){
	var k = json[0].gameRes;
	var res = "";
	switch (k) {
		case 1:
			res = "狼人胜利";
			break;
		case 2:
			res = "神民胜利";
			break;
		case 3:
			res = "人狼恋胜利";
			break;
		case 4:
			res = "吹笛者胜利";
			break;
		case 5:
			res = "平局";
			break;
		default:
			break;
	}
	return res;
}

function getGameForI(len, i){
	if(len > 12){
		return i + 1;
	}
	var res = i;
	if(i >= 1 && i < 5){
		res +=2;
	}else if(i >= 5 && i < 7){
		res +=3;
	}else if(i >= 7 && i < 11){
		res +=4;
	}else if(i >= 11){
		res +=5;
	}else{
		res +=1;
	}
	return res;
}

function getDC(is_prophet_first_view, is_first_kill){
	return parseInt(is_prophet_first_view) + parseInt(is_first_kill);
}

function getDCS(is_witch_rescued, is_witch_kill, is_hunter_kill, is_constable_view){
	return parseInt(is_witch_rescued) + parseInt(is_witch_kill) + parseInt(is_hunter_kill) + parseInt(is_constable_view);
}