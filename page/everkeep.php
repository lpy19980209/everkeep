<?php
session_start();
require_once '../server/permission_manager.php';
require_once '../server/response_code.php';

if(!isLogin())
{
    header("Location: ../page/signin.html" );
    die;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>小小笔记</title>
    <script type="text/javascript" src="../lib/js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="../script/main_frame.js"></script>
    <script src="../lib/js/tinymce/tinymce.js"></script>
    <script src="../script/note_manager.js"></script>
    <script src="../script/noteSaveNotification.js"></script>
    <script src="../script/topNotification.js"></script>
    <script src="../script/logout.js"></script>
    <link rel="stylesheet" type="text/css" href="../css/main_frame.css"/>
    <link rel="stylesheet" type="text/css" href="../css/note_area.css"/>
    <link rel="stylesheet" type="text/css" href="../css/note_style.css"/>
</head>
<body>
<div style="width: 100%;height: 100%;">
    <div id="slide1" class="sidebar">
        <div class="div3">
            <span id="span1">快捷方式</span>
            <!--<hr id="hr2">-->
        </div>
        <div class="div4" id="star_list">
            <div id="no_star_tip">
            <img src="../image/main_frame/photo1.png" alt="" id="photo1"><br><br>
            <span id="span2">工作更高效</span><br>
                <span id="span3">移动鼠标至列表中的某个笔记或笔记本，并点击<img src="../image/main_frame/photo2.png">创建快捷方</span><br>
            <span id="span4">式。</span>
            </div>
        </div>
    </div>

    <div id="slide2" class="sidebar">
        <div class="div5">
            <span id="span5">笔记</span>
            <button id="button">网页剪藏</button><br>
            <div class="div6">
                <span id="span6" class="span_count_of_note">0条笔记</span>
                <div id="photo3">选项
                    <img src="../image/main_frame/photo3.png" alt="">
                </div>
            </div>
        </div>

        <div id="note_list">
            <div id="no_note_tip">
                <img src="../image/main_frame/photo4.png" alt="" id="photo4"><br>
                <span id="span7">点击<img src="../image/main_frame/photo5.png" alt="">添加笔记</span><br>
                <span id="span8">创建灵感笔记本，随时收集灵感创意，并</span><br>
                <span id="span9">与他人共享。</span>
            </div>
        </div>


    </div>

    <div id="trash_container" class="sidebar sub_note_list_container">
        <div class="trash_logo_div">
            <div class="trash_logo_div_name">废纸篓</div>
            <div class="clear_trash_div">清空废纸篓</div>
        </div>
        <div class="trash_count_container">
            <span id="span_count_of_trash_note" class="span_count_of_trash_note">0条笔记</span>
        </div>

        <div id="trash_list">

        </div>


    </div>

    <div id="search_container" class="sidebar sub_note_list_container">
        <div class="search_input_container">
            <input class="search_input_div" placeholder="请输入关键词"/>
            <div class="begin_search_div">搜索</div>
        </div>
        <div class="search_count_container">
            <span id="span_count_of_search_note" class="span_count_of_search_note">0条笔记</span>
        </div>

        <div id="search_list">

        </div>


    </div>

    <div id="list1" >
        <span id="span11">排序方式</span>
        <ul id="ul1">
            <li class="note_order_method" data-ordermethod="c_a"><span>创建日期（最早优先）</span></li>
            <li class="note_order_method" data-ordermethod="c_d"><span>创建日期（最新优先）</span></li>
            <li class="note_order_method" data-ordermethod="u_a"><span>更新日期（最早优先）</span></li>
            <li class="note_order_method" data-ordermethod="u_d"><span>更新日期（最新优先）</span></li>
            <li class="note_order_method" data-ordermethod="t_a"><span>标题（升序排列）</span></li>
            <li class="note_order_method" data-ordermethod="t_d"><span>标题（降序排列)</span></li>
        </ul>
        <hr id="hr4">
        <span id="span12">查看选项</span>
        <ul id="ul2">
            <li><span>显示图片</span></li>
            <li><span>显示文字</span></li>
        </ul>
    </div>

    <div id="slide3" class="sidebar">
        <div style="margin-top: 20px;">
            <span id="span13">笔记本</span>
            <img src="../image/main_frame/photo6.png" alt="" title="创建笔记本" id="photo6"><br>
            <input type="text" placeholder="查找笔记本" id="input">
        </div>
        <div style="position:absolute;">
        <hr id="hr5">
         <ul id="ul3">
             <li><span style="margin-left: 20px;color: black">&lt;Inbox&gt;</span><br>
                 <span style="margin-left: 20px;">0条笔记</span></li>
             <li><span style="margin-left: 20px;color: black">项目1</span><br>
                 <span style="margin-left: 20px;">0条笔记</span></li>
             <li class="trash_entry_div"><img src="../image/main_frame/photo7.png" alt="" style="margin-left: 20px;margin-top: 20px;">
                 <span style="margin-top: 20px;">废纸篓</span></li>
         </ul>
        </div>
    </div>

     <div id="slide4" class="sidebar">
         <div style="margin-top: 20px;">
             <span id="span14">标签</span>
             <img src="../image/main_frame/photo9.png" alt="" style="float: right;margin-right: 20px;"><br>
             <input type="text" placeholder="查找标签" id="input1">
         </div>
         <div>
         <hr style="margin-top: 80px;color: #a9a9a9;">
         <div>
             <img src="../image/main_frame/photo10.png" alt="" id="photo10"><br><br>
             <span id="span15">点击<span style="color: black">新建标签</span>添加新标签</span><br>
             <span id="span16">添加标签，查找更容易。</span><br>
         </div>
         </div>
     </div>
    <div class="div1">
        <img src="../image/main_frame/index0.png" alt="" id="img0">
        <img src="../image/main_frame/index1.png" alt="" id="img1" class="new_note_button" title="新建笔记">
        <img src="../image/main_frame/index4.png" alt="" id="img4" class="left_navigation_search" title="搜索">
        <img src="../image/main_frame/index8.png" alt="" id="img8" class="left_navigation_star" title="快捷方式">
        <img src="../image/main_frame/index2.png" alt="" id="img2" class="left_navigation_note" title="笔记">
        <img src="../image/main_frame/index3.png" alt="" id="img3" title="笔记本">
        <img src="../image/main_frame/index5.png" alt="" id="img5" title="标签">
        <div class="div2">
            <hr id="hr1">
            <img src="../image/main_frame/photo.png" class="left_menu_me" alt="" title="账户" id="photo">
        </div>
    </div>

    <div id="note_area">
        <div id="top_toolbar">
            <div id="top_toolbar_up">
                <span id="top_tool_delete" title="移到废纸篓"></span>
                <span id="top_tool_star" title="添加快捷方式"></span>
            <div id="top_toolbar_down">
            </div>

        </div>
        <div id="note_edit">
            <div id="mce_toolbar"></div>
            <div>
            <input type="text" placeholder="无标题" contentEditable="true" id="note_edit_title">
            </div>
        </div>
        <div name="mce_text" id="my_text_area"></div>
    </div>
    <div id="note_area_shadow">
    </div>
</div>
</body>
</html>