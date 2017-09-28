/**关闭打开窗口**/
function closeWin() {
	$('#myWindow').window('destroy');
	$('#windowParent').html("<div id='myWindow'></div><div id='mySubWindow'></div>");
}

/**
 * 加载界面
 * @param url 支持以下两种格式
 * 	/logon/home.form 
 * 	www.baidu.com 
 */
function addFrame(url,title1,title2,title3){
	$('#centerFrame').attr("src", basepath +url);
	if(title1!=''){
		$('#titleIndex1').html('>');
		$('#homeTitle1').html(title1);
	}
	if(title2!=''){
		$('#titleIndex2').html('>');
		$('#homeTitle2').html(title2);
	}
	if(title3!=''){
//		var ck = "addf('" + url + "')";
		var a = " <span style='color:red'>" + title3 + "</span>";
		$('#titleIndex3').html('>');
		$('#homeTitle3').html(a);
	}else{
		$('#titleIndex3').html('');
		$('#homeTitle3').html('');
	}
}

// zhangpei add by 2015.9.21
function addf(url){
	$('#centerFrame').attr("src",url);
}

/**
 * 增加tab
 * */
function addTab(url) {
//	$('#centerArea').panel({
//		href:url,
//		cache:false
//	});
	console.info(url)
	location.href = url;
}

/**
 * 增加tab
 * */
function loadPanel(url) {
	$('#centerArea').panel({
		href:url,
		cache:false
	});
}

/**显示加载进度条**/
function showProgress(){
	$.messager.progress({
        msg: '努力加载中...',
		interval:10
	});
}

/**关闭加载进度条**/
function closeProgress(){
	setTimeout(function() {
        $.messager.progress('close');
    }, 100);
}

/**返回首页**/
function goToHome(){
	$('#titleIndex1').html('');
	$('#titleIndex2').html('');
	$('#titleIndex3').html('');
	$('#homeTitle1').html('');
	$('#homeTitle2').html('');
	$('#homeTitle3').html('');
	$('#centerFrame').attr("src",basepath+"/login/home.form");
}

/**
 * 
 * 关闭页面
 */
function tabsWin(){
	window.location.reload(); 
	//$("#centerArea").panel('refresh');
	//var mytab = $("#centerArea").tabs('getSelected');
	//$("#centerArea").tabs('update', {tab : mytab,
	//	options:{title : mytab.panel('options').title,
	//		href : mytab.panel('options').href,
	//		closable : true,
	//		cache : false
	//	}
	//});
}

/**
 * 
 * 打开弹出窗口
 */
function showWindow(url,inwidth,inheight,intitle){
	$('#myWindow').window({
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closable : true,
		href : url,
		width :inwidth,
		height :inheight,
		cache : false,
		style : 'font-size:35px;',
		title : intitle
		
	});
}

/**
 * 
 * 用户注销
 */
function exitOperater(){
	$.messager.confirm('消息', '您确定要退出系统?', function(r){
		if(r){
			var url=getUrl("login/loginout.form");
			ajaxUtils.post(url, null,function(json) {//回调函数
				var json=eval('('+json+')');
				if (json.result=='success') {
					$.messager.alert('消息','注销成功','info');
					window.location.href=getUrl("login.jsp");
				}else {
					$.messager.alert('错误','操作失败','error');
				}
			});	
		}
	});
}

/**
 * 
 * 跳转至修改密码页面
 */
function changePassword(){
	showWindow(getUrl('/login/changePassword.form'),400,300,'修改密码');
}

/**
 * 
 * 修改密码
 */
function modifyPassword(){
	 var operatorPassword=$("#operatorPassword").val();
	 var newOperatorPassword=$("#newOperatorPassword").val();
	 var newOperatorPasswordConf=$("#newOperatorPasswordConf").val();
	 if(operatorPassword==''||operatorPassword==null){
		 $.messager.alert('消息',"原始密码不能为空！", 'info');
		 return false;
	 }else if(newOperatorPassword==''||newOperatorPassword==null){
		 $.messager.alert('消息',"新密码不能为空！", 'info');
		 return false;
	 }else if(newOperatorPasswordConf==''||newOperatorPasswordConf==null){
		 $.messager.alert('消息',"确认密码不能为空！", 'info');
		 return false;
	 }else if(newOperatorPassword!=newOperatorPasswordConf){
		 $.messager.alert('消息',"2次密码不相同！", 'info');
		 return false;
	 }else if(newOperatorPassword.length<6||newOperatorPassword.length>18){
		 $.messager.alert('消息',"新密码长度在6和18之间！", 'info');
		 return false;
	 }else {
		$.messager.confirm('消息', '确定要修改的密码?', function(r){
			if(r){
				
				ajaxUtils.post(getUrl("login/confirmPassword.form?id="+$("#operatorId").val()
						+'&psw='+$("#operatorPassword").val()
						+'&newpsw='+$("#newOperatorPassword").val()),null,function(json) {//回调函数
					closeProgress();
					var json=eval('('+json+')');
					alert(json.result);
					if (json.result=='success') {
						$.messager.show({msg : '修改成功',title : '提示'});
						closeWin();
					}else {
						$.messager.alert('错误',json.result,'error');
					}
					showProgress();
				});
				
			}
		});
	 }
}
/**
 * 构建省市区联动下拉列表
 * @param options
 * 使用示例：
 * 
	buildAddressJoinSelection({
		provinceSelectId: 'addProvince',
		citySelectId: 'addCity',
		areaSelectId: 'addArea',
		provinceId: '100000',
		cityId: '100001',
		areaId: '100002',
	});
 */
function buildAddressJoinSelection(options) {

	function fillSelect(selectId, parentId, firstOptionText, defaultValue) {
		if (firstOptionText != '') {
			$('#' + selectId).html('<option value="">' + firstOptionText + '</option>');
		}
		if (parentId != null) {
			$.ajax(basepath+"/area/findChildAreas.form",{
				type:"POST",
				dataType:"json",
				data:{parentId: parentId},
				success:function(data){
					if (null != data) {
						for(var i=0;i < data.length;i++){
							$("#" + selectId).append("<option value='"+data[i].id+"'>"+data[i].areaName+"</option>");
						}
						if(null != defaultValue){
							$("#" + selectId).val(defaultValue);
						}
					}
				}
			});
		}
	}

	function loadProvince(defaultValue) {
		if (!!options.provinceSelectId) {
			fillSelect(options.provinceSelectId, 0, '--省--', defaultValue);
		}
	}

	function loadCity(provinceId, defaultValue) {
		if (!!options.citySelectId) {
			fillSelect(options.citySelectId, provinceId, '--市--', defaultValue);
		}
	}

	function loadArea(cityId, defaultValue) {
		if (!!options.areaSelectId) {
			fillSelect(options.areaSelectId, cityId, '--区/县--', defaultValue);
		}
	}

	loadProvince(options.provinceId);
	loadCity(options.provinceId, options.cityId);
	loadArea(options.cityId, options.areaId);

	$("#" + options.provinceSelectId).change(function(){
		loadCity(this.value);
		loadArea();
	});

	$("#" + options.citySelectId).change(function(){
		loadArea(this.value);
	});
}

/**
 * 
 * @requires jQuery,EasyUI
 * 
 * 防止panel/window/dialog组件超出浏览器边界
 * @param left
 * @param top
 */
//var easyuiPanelOnMove = function(left, top) {
//	var l = left;
//	var t = top;
//	if (l < 1) {
//		l = 1;
//	}
//	if (t < 1) {
//		t = 1;
//	}
//	var width = parseInt($(this).parent().css('width')) + 14;
//	var height = parseInt($(this).parent().css('height')) + 14;
//	var right = l + width;
//	var buttom = t + height;
//	var browserWidth = $(window).width();
//	var browserHeight = $(window).height();
//	if (right > browserWidth) {
//		l = browserWidth - width;
//	}
//	if (buttom > browserHeight) {
//		t = browserHeight - height;
//	}
//	$(this).parent().css({/* 修正面板位置 */
//		left : l,
//		top : t
//	});
//};
//$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
//$.fn.window.defaults.onMove = easyuiPanelOnMove;
//$.fn.panel.defaults.onMove = easyuiPanelOnMove;

function getUrl(path){
	if(!path)return basePath;
	if(path.charAt(0)=="/"){
		return basepath+path;
	}else{
		return basepath+"/"+path;
	}
}

function bindKeydown(id,callback){
	$("#"+id).keydown(function(event){
		if(event.keyCode==13){
			callback();
		}
	});
}

// checkBox全选、全反选
function commonCheckBoxSelect(obj,name){
	var ck = obj.checked;
	var checkBoxs = $("input[name='" + name + "']");
	for(var i = 0; i < checkBoxs.length; i++){
		checkBoxs[i].checked = ck;
	}
}

/**
 * 
 * 排序通用
 * 
 */

function monitorSort(url, formId, column, obj, pageNumber, pageRows){
	var par = $("#" + formId).serialize();
	var type = "";
	if(obj.children[0].alt == "default"){
		type = "asc";
	}else if(obj.children[0].alt == "desc"){
		type = "asc";
	}else if(obj.children[0].alt == "asc"){
		type = "desc";
	}
	var fy = "&curPage=" + pageNumber + "&pageRows=" + pageRows;
	var newUrl = url + "?" + par + "&orderColumn=" + column + "&orderType="+type + fy;
	addTab(newUrl,null);
}
