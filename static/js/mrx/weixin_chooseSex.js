function getSex(){
    var url = basepath + "/weixinWeb/chooseSex.form";
    ajaxUtils.post(url, {},function(data) {
        var json = eval('('+data+')');
        console.info(json);
        if(!json){
            console.info("enter")
            UpdateSex()
        }

    });
}



    function UpdateSex() {
       // $(".pop_chooseSex").show();
       //console.info("sss", $(".pop_chooseSex").style.display = "");
        document.getElementById('pop_chooseSex').style.display ="block";
    }



    function chooseMan(){
        var url = basepath + "/weixinWeb/addSex.form?sex=0";
        ajaxUtils.post(url, {},function(data) {
            var json = eval('('+data+')');
            console.info(json);
            window.location.reload();
        });

    }
    function chooseLady(){
        var url = basepath + "/weixinWeb/addSex.form?sex=1";
        ajaxUtils.post(url, {},function(data) {
            var json = eval('('+data+')');
            console.info(json);
            window.location.reload();
        });

    }