
var canBuyWorkDay = true;
$(function(){
	//立即购买按钮
	$("#pop_js_vip_btn").click(function(){
		var invitation_code =    document.getElementById("invitation_code").value;
		console.info("invitation_code",invitation_code);
		var par = "vip=" + $("#vip").val() + "&productName=gameVip&money=0&body=vip&type=vip&invitation_code="+invitation_code;
		var url = basepath + "/weixinWeb/createOrder.form?" + par;
		ajaxUtils.post(url, {},function(json) {
			var data = eval('('+json+')');
			if(data.code == '0'){
				pay(data);
			}else if(data.code == '6'){
				alert("请先扫码登录游戏！");

			}else{
				alert("请至MRX狼人俱乐部线下门店登入系统后付款");

			}
		});
	});
	//买水
	$(".product_enter_btn").click(function(){
		$(".popup").show();
		$(".pop_product").show();
		$(".pop_js_content").hide();
		productMain();
	});
	
});

function shopMain(){
	/*$(".pop_js_vip_content").hide();
	$(".pop_js_month_content").hide();
	$(".pop_js_year_content").hide();*/
	
	var url = basepath + "/weixinWeb/getMyShop.form";
	ajaxUtils.post(url, {},function(r) {
		var datas = eval('('+r+')');
		console.info("dates",datas);
		var seat = datas.seat;
		console.info(seat.toString());
		 canBuyWorkDay = datas.canBuyWorkDay;

		if(seat == 1 || seat == '1'){
			setBackGroudImages(3);
			$(".popup").show();
			$("#pop_4").show();
			
			$(".product_enter_btn").show();
			$(".pop_js_common_content").hide();
			$(".pop_js_content").show();
			
			var json = datas.result;
			var vipMap = datas.vipMap;
			
			if(vipMap != undefined && vipMap != null && vipMap != '' ){
				var endTime = vipMap.vip_endDate;
				var vip = vipMap.vip;
				if(vip != undefined && vip != null && vip != ""){
					if(vip == "1" || vip == 1){
						if(endTime != undefined && endTime != null && endTime != ""){
							$("#vipMainPid").show();
							$("#vipEndTimeId").text(endTime);
						}
					}
				}
			}
			var html = "";
			for(var i = 0; i < json.length; i++){
				if(i==3&&!canBuyWorkDay){
						var temp1 ="<a href='javascript:;' class='js_pic5_unable' >";
				}else{
					var temp1 ="<a href='javascript:;' class='js_pic" + (i+2) +"' >";
				}
				var temp2 = i >= 1 ? "" : ("<label>" + json[i].rou_value + "</label>");
				var temp3 ="";
				if(json[i].sale_money_value == json[i].money_value){
					if(i==3&&!canBuyWorkDay){
						console.info("temp3 false i =" ,i );
					}else{
						console.info("temp3 true i =" ,i );
						temp3 = "<span class='font1'>&yen;&nbsp;" + json[i].money_value + "</span>";
					}
				}
				var temp4 = "<input type='hidden' value='" + json[i].id + "' id='vipLevelValue" + i + "' >";
				var temp5 = "";
				var temp6 = "";
				if(json[i].sale_money_value != json[i].money_value){
					temp6 = "<i class='icon-bg"+(i+2)+"'><i class='icon-arrow"+(i+2)+"'></i><label>"+json[i].money_value+"</label></i>";
					temp6 += "<span>&yen;&nbsp;" + json[i].sale_money_value + "</span>";
				}
				var temp7 = "</a>";
				html += (temp1 + temp2 + temp3 + temp4 + temp5 + temp6 + temp7);
			}
			$("#shopDataDiv").html(html);
		}else if(seat == 0 ||seat == "0"){
			alert('请至门店登录后查看！');
		}else if(seat == 2 ||seat == "2"){
			alert('法官未登陆！');
		}
	});	
	
	//下单
	$(".pop_js_content a").each(function(c){
		$(this).click(function(){
			console.info("c",c );
			console.info("canBuyWorkDay",canBuyWorkDay );
			if(c == 3 && !canBuyWorkDay){

			}else{
				$(".pop_js_content").hide();
				$(".pop_js_common_content").show();
				classHander(c);
				$("#vip").val($("#vipLevelValue" + c).val());
			}

		});
	});
}

function classHander(c){

	$("#pop_js_common_content_id").removeClass("myshop_order_day");
	$("#pop_js_common_content_id").removeClass("myshop_order_month");
	$("#pop_js_common_content_id").removeClass("myshop_order_year");
	if(c == 0){
		$("#pop_js_common_content_id").addClass("myshop_order_day");
	}else if(c == 1){//月卡
		$("#pop_js_common_content_id").addClass("myshop_order_month");
	}else if(c == 2){//年卡
		$("#pop_js_common_content_id").addClass("myshop_order_year");
	}else if(c == 3){//工作日月卡
			$("#pop_js_common_content_id").addClass("myshop_order_work_day");
	}
	$("#product_water_title").hide();
}

//唤起微信支付  
function pay(data){
	console.info("enter pay");
    if (typeof WeixinJSBridge == "undefined"){    
       if( document.addEventListener ){    
           document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);    
       }else if (document.attachEvent){    
           document.attachEvent('WeixinJSBridgeReady', onBridgeReady);     
           document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);    
       }    
    }else{    
       onBridgeReady(data);
    }
}

//开始支付  
function onBridgeReady(data){
	console.info("enter onBridgeReady");
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', 
        {    
            "appId" : data.appId,     //公众号名称，由商户传入         
            "timeStamp" : data.timeStamp,         //时间戳，自1970年以来的秒数         
            "nonceStr" : data.nonceStr, //随机串         
            "package" : data.prepay_id,         
            "signType" : data.signType,         //微信签名方式        
            "paySign" : data.paySign    //微信签名     
        },    
            
        function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
            	window.location.reload();
            	$("#vip").val("");
            }else if (res.err_msg == "get_brand_wcpay_request:cancel")  {  
            	window.location.reload();
            }else{
            	//支付失败  
            	window.location.reload();
            }
            
        }    
    );
}


function goShop(id){
	var body = id < 3 ? "rou" : "vip";
	var par = "productId=" + id + "&productName=" + body + "&money=" + 1 + "&body=" + body;
	var url = basepath + "/weixinWeb/createOrder.form?" + par;
	ajaxUtils.post(url, {},function(json) {
		alert(json);
	});
}

function MillisecondToDate(msd) {
    var time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
            time = parseInt(time / 60.0) + "分钟" ;
        }
        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                parseInt(time / 3600.0)) * 60) + "分钟" ;
        }
        else {
            time = parseInt(time) + "秒";
        }
    }
    return time;
}

function formatDate (strTime) {
    var date = new Date(strTime);
	var res =  date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    return res;
}


function getTableClass(i){
	var mytopList = "";
	if(i==0){
		mytopList = "mytop_first";
	}else if(i==1){
		mytopList = "mytop_second";
	}else if(i==2){
		mytopList = "mytop_three";
	}else{
		mytopList = "mytop_other";
	}
	return mytopList;
}


