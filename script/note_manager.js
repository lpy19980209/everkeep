

let note_upload_url = "../server/note_receive.php";

/*****************************************************************************************/

/**
 * 编辑器配置
 */
tinymce.init({
    selector: '#my_text_area',
    theme: 'modern',
    inline: true,
    menubar: false,
    language: 'zh_CN',
    plugins: 'fileupload, link, preview, table, hr, textcolor, lists, autolink, save',
    toolbar: 'fontselect | fontsizeselect | forecolor textcolor bold italic underline strikethrough | ' +
        'bullist numlist | link fileupload | table hr | align indent outdent | ' +
        'subscript superscript removeformat | restoredraft save',
    fixed_toolbar_container: "#mce_toolbar",
    init_instance_callback: function (editor) {
        editor.on("Change", function(e) {
            // alert('Editor contents was changed.');
            note_submit();
        });
    }
});

/***************************************************************************************/
/**
 * 数据定义
 */

/**
 *
 * @type {{updateTime: string, createTime: string, remindTime: string, title: string}}
 */


let noteOrderMethod = {
    c_a : {order:"createTime", direction:"asc"},
    c_d : {order:"createTime", direction:"desc"},
    u_a : {order:"updateTime", direction:"asc"},
    u_d : {order:"updateTime", direction:"desc"},
    t_a : {order:"title", direction:"asc"},
    t_d : {order:"title", direction:"desc"},
}

/***************************************************************************************/

/**
 * 提交笔记
 * @returns {boolean} 成功为 true，失败为 false
 */
function note_submit() {
    let noteid = $("#note_area").data('noteid') == null ? -1 : $("#note_area").data('noteid');
    let notetitle = $("#note_edit_title").val();
    let notecontent = tinyMCE.activeEditor.getContent();
    // console.log("local: " + noteid + notetitle + notecontent);

    $.ajax({
       url: note_upload_url,
       type: 'post',
       data: {noteid: noteid, title: notetitle, content: notecontent},
       success: function (response_data) {
           // alert("保存成功");
           console.log(response_data);
           var response = JSON.parse(response_data);
           if(response['code'] == 0)
           {
               console.log("noteid: "+ response["data"]["noteid"]);
               $("#note_area").data("noteid", response["data"]["noteid"]);
               console.log("保存成功");
           }
           else
           {
               console.error("保存失败: " + response_data);
           }
       },
       error: function (e) {
           console.error("保存失败： " + e);
       },
    });

    return false;
}

/**********************************************************************************************/

/**
 * 从服务器获取数据列表
 * 并填充到 notelist 元素 里面
 *
 */
function fillNoteList(orderby, direction)
{
    console.error("../server/notelist_retrive.php?orderby=" + orderby + "&direction=" + direction);
    $.get({
        url : "../server/notelist_retrive.php?orderby=" + orderby + "&direction=" + direction,
        success : function (responsedata) {

            let response = JSON.parse(responsedata);

            if(response['code'] == 0)
            {
                var noteInfoList = response["data"];

                if(noteInfoList.length > 0) {
                    $("#no_note_tip").hide();

                    for (var i in noteInfoList) {

                        var noteInfo = noteInfoList[i];

                        var noteInfoContainer = $("<div></div>");
                        var noteTitle = $("<span></span>");
                        var noteTime = $("<p></p>")

                        console.log(noteInfo);

                        $(noteTitle).text(noteInfo["title"] == "" ? "无标题" : noteInfo["title"]);
                        $(noteTitle).addClass("note_info_title");

                        if(orderby == "createTime")
                            $(noteTime).text(noteInfo["createTime"]);
                        else
                            $(noteTime).text(noteInfo["updateTime"]);
                        $(noteTime).addClass("note_info_time");

                        $(noteInfoContainer).append(noteTitle);
                        $(noteInfoContainer).append(noteTime);

                        $(noteInfoContainer).data('noteinfo', noteInfo);
                        $(noteInfoContainer).addClass("note_info_container");

                        $("#note_list").append(noteInfoContainer);
                    }

                }
            }

            else
            {
                console.error("NOTE列表获取失败：" + responsedata);
            }
        },
        error : function(what) {
            console.error("NOTE列表获取失败: " + what);
        }
    });
}

/*************************************************************************************/
/**
 *
 * @param orderby
 * @param direction
 */
function updateNoteList(orderby, direction)
{
    $('.note_info_container').remove();
    fillNoteList(orderby, direction);
}
/*************************************************************************************/

/**
 * 将选中的noteInfo设置到编辑区
 * @param data
 */
function setEditArea(data) {
    console.log('settextarea' + data['noteid'] + data['title'] + data['content']);
    $("#note_area").data('noteid', data['noteid']);
    $("#note_edit_title").val(data['title']);
    $("#my_text_area").html(data['content']);

}

/********************************************************************************/
/**
 * 事件定义等初始化工作
 */
$(document).ready(function () {
    $("#note_edit_title").change(function () {
        note_submit();
    });

    window.onunload = function () {
        note_submit();
    };


    /**
     * 动态添加的元素 定义 click 事件的方法
     */
    $('body').on("click", ".note_info_container", function (e) {
        var noteInfo = $(this).data('noteinfo');

        // alert(JSON.stringify(noteInfo));

        $.get({
            url: "../server/note_retrive.php?noteid=" + noteInfo['noteid'],
            success: function (responsedata) {
                let response = JSON.parse(responsedata);
                console.log(responsedata);
                if (response['code'] == 0) {
                    // alert(response["data"]);
                    setEditArea(response["data"]);
                }
                else {
                    console.error("NOTE获取失败");
                }
            },
            error: function () {
                console.error("NOTE获取失败 in err");
            }
        });

    });

    $(".note_order_method").click(function () {
        let methodKey = $(this).data("ordermethod");
        updateNoteList(noteOrderMethod[methodKey].order, noteOrderMethod[methodKey].direction);

    });


    updateNoteList(noteOrderMethod["u_d"].order, noteOrderMethod["u_d"].direction);

    if($(".note_info_container").size > 0)
    {
        $(".note_info_container:first-child").click();
    }
});

/******************************************************************************/
