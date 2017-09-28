function getProductTypeArray(json){
	var arr= [];
	var last_type_id = "";
	for(var i = 0; i < json.length; i++){
		if(i == 0){
			arr.push(i);
		}else{
			last_type_id = json[i - 1].type_id;
			if(last_type_id != json[i].type_id){
				arr.push(i);
			}
		}
	}
	return arr;
}

function checkProductType(arr, count){
	var b = false;
	for(var i = 0; i < arr.length; i++){
		if(count == arr[i]){
			b = true;
			break;
		}
	}
	return b;
}

var pop_feed_bei = null;
var clickOrderSkuId = null;
var allCount = 0;
function productMain(){
	store_id=$("#store_id").val();
	openid=$("#openid").val();
	var url = basepath + "/weixinWeb/getProductList.form";
	ajaxUtils.post(url, {},function(jsonData) {
		var json = eval('('+jsonData+')');
		var html = "";
		feedJson=json;
		allCount = json.length;
		var arr = getProductTypeArray(json);
		for(var i = 0; i < json.length; i++){
			var b = checkProductType(arr, i);
			var temp = "";
			if(b){
				temp += '<li class="pop_product_title">' +
							'<span>' + json[i].en_type + '</span>' +
							'<label>' + json[i].type + '</label>' +
						'</li>';
			}
			var className = i % 2 == 0 ? "pop_product_odd" : "pop_product_even";
			temp +=
				'<li class=' + className + '>' +
					'<div class="pop_product_left">' +
						'<p class="first">' +

							'<input type="hidden" value="' + json[i].id +'" id="product_id_' + i +'" />' +
							//'<span class="product_en_name">' + json[i].en_name + '</span>' +


						'</p>' +
						'<p class="second">' +
							'<span>' + json[i].name + '</span>' +
							'<span class="product_sopt">………</span>' +
							'<label id="pop_product_price_' + i +'"  >' + json[i].price + 'rmb</label>' +
							'<i class="pop_product_bei" id="product_count_'+ (i) +'">0</i>' +
							'<input type="hidden" id="product_hidden_sku_' + (i) +'" />' +
						'</p>' +
					'</div>' +
					"<a href='javascript:;' class='product_order_btn' " +
					"onclick='showProductSku(" + i + ",\"" + json[i].sku_type_id + "\")' ></a>" +
				'</li>';
			html += temp;
		}
		html += '<input type="hidden" id="product_hidden_sku_value" />';

		$("#product_dynamic_main").html(html);
		//$("#product_submit_btn").html("￥0");

		var temp2= '<a href="javascript:" class="product_submit_btn" id="product_submit_btn"  onclick="createWaterOrder()" >&yen;0</a>';
		$("#product_submit").html(temp2);

	});
}


function addSpot(name){
	//var h = obj.offsetHeight;
	//var w = obj.offsetWidth;
	//console.log(w + "    " + h);
	var s = 35 - name.length;
	var res = name;
	for(var i = 0; i < s; i++){
		res += ".";
	}
	return res;
}
var selectIndex;
function showProductSku(i, sku_type_id){
	selectIndex= i ;
	//var b = checkDianBtn();
	//if(b){
	//	alert("一次只允许点一种饮料！");
	//	return;
	//}

	$(".popup").show();
	$(".pop_product").hide();
	$(".pop_product_order").show();
	$(".product_enter_btn").hide();

	var url = basepath + "/weixinWeb/getProductSkuListByTypeId.form?sku_type_id="+sku_type_id;
	ajaxUtils.post(url, {},function(jsonData) {
		var json = eval('('+jsonData+')');
		var html = "";
		var arr0 = json.key0;
		var arr1 = json.key1;
		var arr2 = json.key2;

		var classCounts = 0;
		if(arr0 != null && arr0 != ""){
			classCounts++;
			html += createProductSkuHtml(arr0, classCounts);
		}

		if(arr1 != null && arr1 != ""){
			classCounts++;
			html += createProductSkuHtml(arr1, classCounts);
		}

		if(arr2 != null && arr2 != ""){
			classCounts++;
			html += createProductSkuHtml(arr2, classCounts);
		}
		html+= '<input type="number" class="order_shu" value="1" id="product_water_count" />';
		$("#order_select_div").html(html);
	});




//	var arr = sku.split(",");
//	$("#product_order_en_name").html(en_name);
//	$("#product_order_name").html(name);
//	$("#order_hot_btn").text(arr[0]);
//	$("#order_cool_btn").text(arr[1]);
//	$("#order_hot_btn").attr("name",sku_id[0]);
//	$("#order_cool_btn").attr("name",sku_id[1]);
	clickOrderId = "product_count_" + i;
	clickOrderSkuId = "product_hidden_sku_" + i;

}

function getProductSelectSkuData(){
	var res = "";
	$("#order_select_div").find("select").each(function(index,element){
		res += $(element).val() + "|";
	});
	$("#product_hidden_sku_value").val(res);
	$("#product_hidden_sku_"+selectIndex).text($("#product_hidden_sku_value").val());
	return res;
}

function createProductSkuHtml(arr,s_class){
	var temp = "";
	temp += "<select class='sel" + s_class + "'>";
	for(var i = 0; i < arr.length; i++){
		temp += "<option>" + arr[i] + "</option>";
	}
	temp += "</select>";
	return temp;
}

function waterSelectOk(){
	var res = getProductSelectSkuData();
	$(".pop_product").show();
	$(".pop_product_order").hide();
	if(clickOrderId != null){
		$("#" + clickOrderId).html($("#product_water_count").val());
	}
	var all = 0;
	var f = getIsFF();
	for(var i = 0; i < allCount; i++){
		var p = parseInt($("#pop_product_price_"+i).html());
		var c = parseInt($("#product_count_"+i).html());

		if(f-c >=0){
			f=f-c;
			all+=0;
		}else {
			all += (p * (c == 0 ? 0 : (c - f)));
			f=0;
		}
		if(all!=0)
		{
			all_price = all;
		}
	}
	console.info(all);
	$("#product_hidden_sku_"+ selectIndex).text();
	$("#is_first_free_res").html(getIsFF()-f);
	$("#product_submit_btn").html("￥" + (all == 0 ? "0" : all));
	$(".product_enter_btn").show();
}

function getIsFF(){
	var res = 0;
	var f = $("#is_first_free").val();
	if(f != null && f != ""){
		res = parseInt(f);
	}
	return res;
}


var store_id;
var openid;
var feedJson;
var all_price;
function createWaterOrder(){
	$('.product_submit_btn').removeAttr('onclick');
	var allPC = 0;
	var res = [];
	for (var i = 0; i < allCount; i++) {
		if ($("#product_count_" + i).text() != 0 && $("product_count_" + i).text() != null) {
			var obj = {};
			obj.product_id = feedJson [i].id;
			obj.sku_type_id = feedJson[i].sku_type_id;
			obj.sku_id = $("#product_hidden_sku_" + i).text();
			obj.order_count = $("#product_count_" + i).text();
			obj.order_free = ($("#pop_product_price_" + i).text()).replace("rmb", "");
			res.push(obj);
		}
		var c = parseInt($("#product_count_"+i).html());
		allPC += c;
	}
	if(allPC == 0){
		alert("请先选择需要购买的饮料！");
		return;
	}





	var arr = JSON.stringify(res);

	var freeRes =$("#is_first_free_res").html();
	console.info("freeRes",freeRes);
	if($("#product_submit_btn").html() == "￥0"){
		var param = 'data=' + arr;
		console.info("免费支付       ");
		var url = basepath + "/weixinWeb/createOrderWaterFree.form?store_id= " + store_id + "&openid=" + openid;
		ajaxUtils.post(url,param,function(d) {
			var json=eval('('+d+')');
			if (json.result=='success') {
				alert('下单成功，水稍后会给您送到！');
			}   else {
				alert('请勿重复操作');
			}
			window.location.reload();
		});
	}
	else{
	var param = 'data=' + arr;
	var url = basepath + "/weixinWeb/createWaterOrder.form?store_id= " + store_id + "&openid=" + openid  + "&all_price=" + all_price * 100;

	ajaxUtils.post(url, param
		, function (json) {
			var data = eval('(' + json + ')');
			if (data.code == '0') {
				pay(data);
			} else if (data.code == '5') {
				alert("法官没有登录游戏！");
			} else if (data.code == '6') {
				alert("请先扫码登录游戏！");
			} else {
				alert("请至MRX狼人俱乐部线下门店登入系统后付款");
			}
		});}
}

//function createWaterOrder(){
//	var allPC = 0;
//	var res = "";
//	for(var i = 0; i < allCount; i++){
//		var p = $("#product_id_"+i).val();
//		var c = parseInt($("#product_count_"+i).html());
//		allPC += c;
//		if(p != null && p != '' && c != 0){
//			var sku = $("#product_hidden_sku_value").val();
//			res += (p + "," + ((sku == null || sku == "") ? " " : sku) + "," + c + ";");
//		}
//	}
//	if(allPC == 0){
//		alert("请先选择需要购买的饮料！");
//		return;
//	}
//	var freeRes =$("#is_first_free_res").html();
//	console.info("freeRes",freeRes);
//	var par = "vip=" + res + "&productName=water&money=0&body=product&type=product";
//	if($("#product_submit_btn").html() == "￥0"){
//		var url = basepath + "/weixinWeb/createOrderWaterFree.form?" + par;
//		ajaxUtils.post(url, {},function(d) {
//			var json=eval('('+d+')');
//			if (json.result=='success') {
//				alert('下单成功，水稍后会给您送到！');
//			}else {
//				alert('下单网络异常，请重试！');
//			}
//			window.location.reload();
//		});
//	}else{
//		var url = basepath + "/weixinWeb/createOrder.form?" + par;
//		ajaxUtils.post(url, {},function(json) {
//			var data = eval('('+json+')');
//			if(data.code == '0'){
//				pay(data);
//			}else if(data.code == '6'){
//				alert("请先扫码登录游戏！");
//				return;
//			}else{
//				alert("请至MRX狼人俱乐部线下门店登入系统后付款");
//				return;
//			}
//		});
//	}
//}




function setProductSkuValue(v){
	$("#" + clickOrderSkuId).val(v);
}


function checkDianBtn(){
	var b = false;
	for(var i  =0 ;i < allCount; i++){
		if($("#product_count_" + i).html() != "0"){
			b = true;
			break;
		}
	}
	return b;
}
