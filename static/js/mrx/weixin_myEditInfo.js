var countdown=60;
var isFst = true;
function getUserDetail(){
	var url = basepath + "/weixinWeb/getUserDetail.form";
	ajaxUtils.post(url, {},function(data) {
		
		var json = eval('('+data+')');
		if(json != null && json.length != 0 ){
			$("#user_detail_title").val(json[0].title);
			$("#user_detail_name").val(json[0].name);
			$("#user_detail_sex").val(json[0].sex);
			$("#user_detail_cards").val(json[0].cards);
			$("#user_detail_qq").val(json[0].qq);
			$("#user_detail_weixin").val(json[0].weixin);
			$("#user_detail_email").val(json[0].email);
			$("#user_detail_city").val(json[0].city);
			$("#user_detail_like_role").val(json[0].like_role);

		}
	});
}

var settime2 = function() {
	console.info("settime2" , isFst);
	if(isFst){
		if (countdown <= 0) {
			//		$("#yzm_btn")[0].disabled = false;
			countdown = 60;
			//		clearTimeout(settime);
//			window.clearInterval(id);
			isFst = false;
			return;
		} else {
			//		$("#yzm_btn")[0].disabled = true;
			$("#yzm_btn").text(countdown + "S后重试");
			countdown--;
		}

	}
};

function UpdateGetCode(){

	if(countdown != 60){
		return;
	}
	var phone = $("#edit_phone").val();
	var msg1 = checkPhone(phone);
	if(msg1 != ""){
		alert(msg1);
		return;
	}
	console.info("UpdateGetCode  进入")
	var url = basepath + "/weixinWeb/getYzm.form?phone="+phone;
	ajaxUtils.post(url, {},function(json) {
		setInterval(settime2,1000);
	});
}
function checkPhone(phone){
	var res = "";
	if(phone == "" || phone == null){
		res = "手机号不能为空";
	}else{
		var reg = /^1\d{10}$/;
		res = reg.test(phone) ? "" : "手机号码不合法";
	}
	return res;
}

function UpPhone(){
	var phone = $("#edit_phone").val();
	var msg1 = checkPhone(phone);
	if(msg1 != ""){
		alert(msg1);
		return;
	}
	var yzm = $("#edit_yzm").val();
	var msg3 = checkName(yzm);
	if(msg3 != ""){
		alert(msg3);
		return;
	}
	var param ="?phone=" + phone + "&yzm=" + yzm ;
	var url = basepath + "/weixinWeb/ensurePhone.form" + param;

	ajaxUtils.post(url, {},function(data) {
		var data = eval('('+data+')');
		var code = data.code
		console.info("jinru")
		console.info("code",code)
		console.info("data",data)
		//-1 系统异常 	1 已注册 	0 成功  3 线上只绑定过手机的用户  绑定  openid和 unionid
		if (code=='0') {
			alert('绑定成功');
			window.location.reload();
		}else if(code=='1'){
			alert('该手机已经绑定了其它微信号');
		}else if(code=='2'){
			var firstMap = data.firstMap;
			var secondMap = data.secondMap;
			document.getElementById("firstId").value=firstMap.id;
			$("#p_name_1").text(firstMap.name);
			$("#p_trophy_1").text(firstMap.trophy);
			$("#p_rou_1").text(firstMap.rou);
			$("#p_create_time2_1").text(firstMap.create_datetime);
			document.getElementById("secondId").value=secondMap.id;
			$("#p_name_2").text(secondMap.name);
			$("#p_trophy_2").text(secondMap.trophy);
			$("#p_rou_2").text(secondMap.rou);
			$("#p_create_time2_2").text(secondMap.create_datetime);

			$(".pop_edit_info").hide();
			$(".login_popup").show();
			$(".pop_phoneUnionid").show();
		}else if(code == "3"){
			alert('该手机已经绑定了当前微信号');
			window.location.reload();
		}
	});
}

function chooseFirst(index){


	var firstId  =  document.getElementById("firstId").value;
	var secondId =  document.getElementById("secondId").value;

	console.info("firstId",firstId)
	console.info("secondId",secondId)

	var url = basepath + "/weixinWeb/chooseFirst.form?firstId="+firstId+"&secondId="+secondId+"&index="+index;
	ajaxUtils.post(url, {},function(json) {
		//-1 系统异常 	1 已注册 	0 成功  3 线上只绑定过手机的用户  绑定  openid和 unionid
		if (json=='0') {
			alert('绑定失败');
		}else if(json=='1'){
			alert('绑定成功');
			$(".login_popup").hide();
			$(".pop_phoneUnionid").hide();
			window.location.reload();
		}
	});

}

function chooseSecond(){}


function checkName(name){
	var res = "";
	if(name == "" || name == null){
		res = "昵称不能为空";
	}
	return res;
}