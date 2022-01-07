    // ==UserScript==
    // @name         zjooc在浙学刷课
    // @namespace    GAEE
    // @version      1.1.0
    // @description  网页端/安卓端 一键刷课
    // @match        https://www.zjooc.cn/*
    // @grant        unsafeWindow
    // @license      none
    // ==/UserScript==
    let APP_Version = "1.2.0";
     
    //
    // 由于网页脚本维护不便，无法及时更新请见谅。
    // 如需获得更好体验请移步介绍页下载安卓脚本
    //
     
    var startTime = 5000;   //刷课间隔时间 //若超过该时间页面还未加载则自动跳过
    var IntervalTime = 2000;//监测时长
    var Video_muted = true; //开启静音
    var Video_speed = 4;    //倍速设置 最大16
     
    (function() {
        'use strict';
        const urls = {'course':'https://www.zjooc.cn/ucenter/student/course/study/[A-Za-z0-9]+/plan/detail/[A-Za-z0-9]+'};
     
        var ListStudy_main = [];
        var ListStudy_view = [];
     
        var ListStudy_main_now;
        var ListStudy_view_now;
     
        var Interval;
        var LN = 0;
        var MN = 0;
     
     
        var url = unsafeWindow.location.href;
        var href = new RegExp(urls.course);
        console.log(href.test(url));
        if(href.test(url)){
            unsafeWindow.setTimeout(function(){
                console.log("============ 开始执行脚本 =================");
                for(var i=0;i<document.querySelectorAll('.el-submenu__title').length;i++){if(i>0)document.querySelectorAll('.el-submenu__title')[i].click()}
                GET_MAIN_LIST();
                console.log("------------");
                GET_VIEW_LIST();
                console.log("------------");
                //console.log(ListStudy_main);
                //console.log(ListStudy_view);
                if(ListStudy_main == ""){
                    console.log("全部完成");
                }else{
                    ListStudy_main_now.click();
                    if(ListStudy_view == ""){
                        console.log("当前小节已完成");
                        NEXT_MAIN();
                    }else{
                        ListStudy_view_now.click();
                        unsafeWindow.setTimeout(AUTO_COURSE,startTime);
                    }
                }
            },startTime);
        }
     
        function AUTO_COURSE(){
            if(Interval){
                unsafeWindow.clearInterval(Interval);
            }
            console.log("============ 开始刷课 ==============");
            console.log("当前课时:"+ListStudy_view_now.innerText);
            if(document.querySelector('iframe')){
                console.log("类型【文档】");
                var document_ok = document.querySelector('.contain-bottom').querySelectorAll('button.el-button.el-button--default');
                console.log("文档按钮"+document_ok);
                if(document_ok){
                    for(var i=0;i<document_ok.length;i++) document_ok[i].click();
                    console.log("正在执行文档程序");
                }
                console.log("============ 结束刷课 ==============");
                NEXT_VIEW();
            }else{
                console.log("类型【视频】");
                var video = document.querySelector('video');
                console.log("[寻找VIDEO]"+video);
                if(video){
                    video.autoplay = "autoplay";
                    video.muted = Video_muted;
                    video.playbackRate = Video_speed;
                    var p = document.querySelector('video');
                    if(p)p.click();
                    Interval = unsafeWindow.setInterval(VIDEO_OK,IntervalTime);
                }
            }
        }
     
        function VIDEO_OK(){
            try{
                var video=document.querySelector('video');
                var bar = video.parentNode.children[2];
                var processBar = bar.children[7];
                var times = processBar.innerText.split('/');
                var now = times[0].trim();
                var end = times[1].trim();
                console.log(times);
                if(now==end){
                    if(Interval){
                        unsafeWindow.clearInterval(Interval);
                    }
                    console.log("============ 结束刷课 ==============");
                    unsafeWindow.setTimeout(NEXT_VIEW,startTime);
                }
            }catch(err) {
                console.log("[ERROR] "+err);
                if(Interval){
                    unsafeWindow.clearInterval(Interval);
                }
                unsafeWindow.setTimeout(NEXT_VIEW,startTime);
            }
        }
     
        function NEXT_MAIN(){
            MN += 1;
            if(MN >= ListStudy_main.length){
                console.log("全部完成");
                alert("🎉 本课程学习完毕");
            }else{
                ListStudy_main_now = ListStudy_main[MN];
                ListStudy_main_now.click();
                console.log("正在切换下一章节");
                unsafeWindow.setTimeout(function(){
                    GET_VIEW_LIST();
                    if(ListStudy_view == ""){
                        console.log("当前小节已完成");
                        NEXT_MAIN();
                    }else{
                        ListStudy_view_now.click();
                        unsafeWindow.setTimeout(function(){AUTO_COURSE()},startTime);
                    }
                },startTime);
            }
        }
     
        function NEXT_VIEW(){
            LN += 1;
            if(LN >= ListStudy_view.length){
                console.log("当前小节已完成");
                NEXT_MAIN();
            }else{
                ListStudy_view_now = ListStudy_view[LN];
                ListStudy_view_now.click();
                //console.log("当前课时:"+ListStudy_view_now.innerText);
                //console.log("下一课时:"+ListStudy_view_now.nextSibling.innerText);
                unsafeWindow.setTimeout(AUTO_COURSE,startTime);
            }
        }
     
        function GET_MAIN_LIST(){
            ListStudy_main = [];
            MN = 0;
            console.log("[学习章节]");
            console.log("-------------");
            //get main list
            var main_list = document.querySelector('.base-asider ul[role="menubar"]');
            for(var a=0; a<main_list.childElementCount; a++){
                var sec_list = main_list.children[a].children[1];
                for(var b=0; b<sec_list.childElementCount; b++){
                    var _e = sec_list.children[b];
                    //if(_e.getAttribute('tabindex')=='0')//-1 unfinish 0 finish
                    //{
                    //    console.log("finished");
                    //}else{
                    console.log(_e.innerText);
                    ListStudy_main.push(_e);
                    //}
                }
            }
            //end
            ListStudy_main_now = ListStudy_main[0];
            ListStudy_main_now.click();
            console.log("-------------");
        }
     
        function GET_VIEW_LIST(){
            ListStudy_view = [];
            LN = 0;
            console.log("[学习小节]");
            console.log("-------------");
            var list = document.querySelector('.plan-detailvideo div[role="tablist"]');
            for(var i=0; i<list.childElementCount; i++){
                var e = list.children[i];
                if(e.querySelector('i').classList.contains('complete'))//finished
                {
                    console.log("finished");
                }else{
                    console.log(e.innerText);
                    ListStudy_view.push(e);
                }
            }
            ListStudy_view_now = ListStudy_view[0];
            console.log("-------------");
        }
     
    })();
