let note_upload_url = "../server/note_receive.php";

/*****************************************************************************************/

/**
 * 编辑器配置
 */

$(document).ready(function () {

    if (document.body.clientWidth > 1366)
        tinymce.init({
            selector: '#my_text_area',
            theme: 'modern',
            inline: true,
            menubar: false,
            language: 'zh_CN',
            plugins: 'fileupload, link, preview, table, hr, textcolor, lists, autolink',
            toolbar: 'fontselect | fontsizeselect | forecolor textcolor bold italic underline strikethrough | ' +
                'bullist numlist | link fileupload | table hr | align indent outdent | ' +
                'subscript superscript removeformat | restoredraft',
            fixed_toolbar_container: "#mce_toolbar",
            // toolbar_items_size: "small",
            // init_instance_callback: function (editor) {
            //     editor.on("Change", function(e) {
            //         // alert('Editor contents was changed.');
            //         note_submit();
            //     });
            // },
            setup: function (ed) {
                ed.on("input", function (event) {
                    note_submit();
                });
            }
        });

    else
        tinymce.init({
            selector: '#my_text_area',
            theme: 'modern',
            inline: true,
            menubar: false,
            language: 'zh_CN',
            plugins: 'fileupload, link, preview, table, hr, textcolor, lists, autolink',
            toolbar: 'fontselect | fontsizeselect | forecolor textcolor bold italic underline strikethrough | ' +
                'bullist numlist | link fileupload | table hr | align indent outdent | ' +
                'subscript superscript removeformat | restoredraft',
            fixed_toolbar_container: "#mce_toolbar",
            toolbar_items_size: "small",
            // init_instance_callback: function (editor) {
            //     editor.on("Change", function(e) {
            //         // alert('Editor contents was changed.');
            //         note_submit();
            //     });
            // },
            setup: function (ed) {
                ed.on("change", function (event) {
                    note_submit();
                });
            }
        });
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
    c_a: {order: "createTime", direction: "asc"},
    c_d: {order: "createTime", direction: "desc"},
    u_a: {order: "updateTime", direction: "asc"},
    u_d: {order: "updateTime", direction: "desc"},
    t_a: {order: "title", direction: "asc"},
    t_d: {order: "title", direction: "desc"},
}

/***************************************************************************************/

/**
 * 提交笔记  若传入参数，在成功后作为函数执行
 * @returns {boolean} 成功为 true，失败为 false
 *
 */
function note_submit() {


    let afterSuccess = null;
    if (arguments.length == 1) {
        afterSuccess = arguments[0];
    }


    let noteid = $("#note_area").data('noteinfo') == null ? -1 : $("#note_area").data('noteinfo')["noteid"];
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
            if (response['code'] == 0) {
                // console.log("noteid: " + response["data"]["noteinfo"]);
                // $("#note_area").data("noteinfo", response["data"]["noteinfo"]);
                console.log("保存成功");
                floatSaveSuccessSign();

                if (afterSuccess != null) {
                    afterSuccess();
                }

            }
            else {
                console.error("保存失败: " + response_data);
                sendErrorNotification("保存失败，请稍后再试！");

            }
        },
        error: function (e) {
            console.error("保存失败： " + e);
            sendErrorNotification("保存失败，请检查网络状态！");
        },
    });

    return false;
}

/**********************************************************************************************/

/**
 * 从服务器获取数据列表  若传入参数，在成功后作为函数执行
 * 并填充到 notelist 元素 里面
 *
 */
function fillNoteList(orderby, direction) {
    let afterSuccess = null;
    if (arguments.length == 3) {
        afterSuccess = arguments[2];
    }

    console.log("../server/notelist_retrive.php?orderby=" + orderby + "&direction=" + direction);
    $.get({
        url: "../server/notelist_retrive.php?orderby=" + orderby + "&direction=" + direction,
        success: function (responsedata) {

            let response = JSON.parse(responsedata);

            if (response['code'] == 0) {

                $("#note_list .note_info_container").remove();

                var noteInfoList = response["data"];

                if (noteInfoList.length > 0) {

                    for (var i in noteInfoList) {

                        var noteInfo = noteInfoList[i];

                        var noteInfoContainer = $("<div></div>");
                        var noteTitle = $("<span></span>");

                        //工具栏
                        var noteItemTool = $("<div></div>")
                        $(noteItemTool).addClass("note_item_tool");

                        var noteToolShortcut = $("<div></div>");
                        $(noteToolShortcut).addClass("note_tool_shortcut");
                        $(noteToolShortcut).hover(
                            function () {
                                $(this).attr('title', $(this).hasClass("is_star") ? "删除快捷方式" : "添加快捷方式");
                        },
                            function () {
                                //do nothing
                            });

                        if (noteInfo["isStar"] == 1) {
                            $(noteToolShortcut).addClass("is_star")
                        }

                        var noteToolDelete = $("<div></div>");
                        $(noteToolDelete).addClass("note_tool_delete");
                        $(noteToolDelete).attr('title',"删除笔记");


                        $(noteItemTool).append(noteToolShortcut);
                        $(noteItemTool).append(noteToolDelete);

                        //更新时间
                        var noteTime = $("<p></p>")

                        console.log(noteInfo);

                        $(noteTitle).text(noteInfo["title"] == "" ? "无标题" : noteInfo["title"]);
                        $(noteTitle).addClass("note_info_title");

                        if (orderby == "createTime")
                            $(noteTime).text(noteInfo["createTime"]);
                        else
                            $(noteTime).text(noteInfo["updateTime"]);
                        $(noteTime).addClass("note_info_time");

                        let noteSnippet = $("<div></div>");
                        noteSnippet.addClass("note_snippet");
                        noteSnippet.text(noteInfo['snippet']);

                        $(noteInfoContainer).append(noteTitle);
                        $(noteInfoContainer).append(noteTime);
                        $(noteInfoContainer).append(noteItemTool);
                        $(noteInfoContainer).append(noteSnippet);

                        $(noteInfoContainer).data('noteinfo', noteInfo);
                        $(noteInfoContainer).addClass("note_info_container");
                        $(noteInfoContainer).attr("id", "notelist_item_" + noteInfo["noteid"]);




                        $("#note_list").append(noteInfoContainer);
                    }

                }
            }

            else {
                console.log("NOTE列表获取失败：" + responsedata);
            }

            if (afterSuccess != null) {
                afterSuccess();
            }
        },
        error: function (what) {
            console.log("NOTE列表获取失败: " + what);
        }
    });
}

/*************************************************************************************/
/**
 * 从服务器获取星标列表  若传入参数，在成功后作为函数执行
 * 并填充到 starlist 元素 里面
 *
 */
function fillStarList(orderby, direction) {
    let afterSuccess = null;
    if (arguments.length == 3) {
        afterSuccess = arguments[2];
    }

    console.log("../server/starlist_retrive.php?orderby=" + orderby + "&direction=" + direction);
    $.get({
        url: "../server/starlist_retrive.php?orderby=" + orderby + "&direction=" + direction,
        success: function (responsedata) {

            let response = JSON.parse(responsedata);

            if (response['code'] == 0) {

                $("#star_list .note_info_container").remove();

                var noteInfoList = response["data"];

                if (noteInfoList.length > 0) {

                    for (var i in noteInfoList) {

                        var noteInfo = noteInfoList[i];

                        var noteInfoContainer = $("<div></div>");

                        var noteTitle = $("<span></span>");

                        //工具栏
                        var noteItemTool = $("<div></div>")
                        $(noteItemTool).addClass("note_item_tool");

                        var noteToolShortcut = $("<div></div>");
                        $(noteToolShortcut).addClass("note_tool_shortcut");

                        if (noteInfo["isStar"] == 1) {
                            $(noteToolShortcut).addClass("is_star")
                            $(noteToolShortcut).attr('title', "删除快捷方式");
                        }


                        $(noteItemTool).append(noteToolShortcut);

                        //更新时间
                        var noteTime = $("<p></p>")

                        console.log(noteInfo);

                        $(noteTitle).text(noteInfo["title"] == "" ? "无标题" : noteInfo["title"]);
                        $(noteTitle).addClass("note_info_title");

                        if (orderby == "createTime")
                            $(noteTime).text(noteInfo["createTime"]);
                        else
                            $(noteTime).text(noteInfo["updateTime"]);
                        $(noteTime).addClass("note_info_time");

                        $(noteInfoContainer).append(noteTitle);
                        $(noteInfoContainer).append(noteTime);
                        $(noteInfoContainer).append(noteItemTool);

                        $(noteInfoContainer).data('noteinfo', noteInfo);
                        $(noteInfoContainer).addClass("note_info_container");

                        $("#star_list").append(noteInfoContainer);
                    }

                }
            }

            else {
                console.log("星标NOTE列表获取失败：" + responsedata);
            }

            if (afterSuccess != null) {
                afterSuccess();
            }
        },
        error: function (what) {
            console.log("星标NOTE列表获取失败: " + what);
        }
    });
}


/*************************************************************************************/
/**
 * 从服务器获取Trash列表  若传入参数，在成功后作为函数执行
 * 并填充到 trashlist 元素 里面
 *
 */
function fillTrashList(orderby, direction) {
    let afterSuccess = null;
    if (arguments.length == 3) {
        afterSuccess = arguments[2];
    }

    console.log("../server/trashlist_retrive.php?orderby=" + orderby + "&direction=" + direction);
    $.get({
        url: "../server/trashlist_retrive.php?orderby=" + orderby + "&direction=" + direction,
        success: function (responsedata) {

            let response = JSON.parse(responsedata);

            if (response['code'] == 0) {

                $("#trash_list .note_info_container").remove();

                var noteInfoList = response["data"];

                if (noteInfoList.length > 0) {

                    for (var i in noteInfoList) {

                        var noteInfo = noteInfoList[i];

                        var noteInfoContainer = $("<div></div>");

                        var noteTitle = $("<span></span>");

                        //工具栏
                        var noteItemTool = $("<div></div>")
                        $(noteItemTool).addClass("note_item_tool");

                        var noteToolRestore = $("<div></div>");
                        $(noteToolRestore).addClass("note_tool_restore");
                        $(noteToolRestore).attr('title', "还原")
                        $(noteItemTool).append(noteToolRestore);

                        var noteToolReallyDelete = $("<div></div>");
                        $(noteToolReallyDelete).addClass("note_tool_really_delete");
                        $(noteToolReallyDelete).attr('title', "彻底删除")
                        $(noteItemTool).append(noteToolReallyDelete);

                        //更新时间
                        var noteTime = $("<p></p>")

                        console.log(noteInfo);

                        $(noteTitle).text(noteInfo["title"] == "" ? "无标题" : noteInfo["title"]);
                        $(noteTitle).addClass("note_info_title");

                        if (orderby == "createTime")
                            $(noteTime).text(noteInfo["createTime"]);
                        else
                            $(noteTime).text(noteInfo["updateTime"]);
                        $(noteTime).addClass("note_info_time");

                        $(noteInfoContainer).append(noteTitle);
                        $(noteInfoContainer).append(noteTime);
                        $(noteInfoContainer).append(noteItemTool);

                        $(noteInfoContainer).data('noteinfo', noteInfo);
                        $(noteInfoContainer).addClass("note_info_container");

                        $("#trash_list").append(noteInfoContainer);
                    }

                }
            }

            else {
                console.log("Trash NOTE列表获取失败：" + responsedata);
            }

            if (afterSuccess != null) {
                afterSuccess();
            }

        },
        error: function (what) {
            console.log("Trash NOTE列表获取失败: " + what);
        }
    });
}

/*************************************************************************************/
/**
 * 将选中的noteInfo设置到编辑区
 * @param data
 */
function setEditArea(data) {
    console.log('settextarea--------->');
    console.log(data);
    $("#note_area").show();
    $("#note_area").data('noteinfo', data);
    $("#note_edit_title").val(data['title']);
    $("#my_text_area").html(data['content']);

}
/******************************************************************************/
/**
 * 清除editarea数据并且隐藏div
 */
function clearAndHideNoteArea() {
    $("#note_area").removeData('noteinfo');
    $("#note_edit_title").val(null);
    $("#my_text_area").html(null);
    $("#note_area").hide();
}

/********************************************************************************/
/**
 * 事件定义等初始化工作
 */
$(document).ready(function () {

    //自动保存
    document.getElementById("note_edit_title").addEventListener( "input", function () {
        note_submit(function () {
            let title = $("#note_edit_title").val();
            if(title == "") title = "无标题";
            $("#notelist_item_" + $("#note_area").data('noteinfo')["noteid"] + " .note_info_title").text(title);
        });
    });

    window.onunload = function () {
        note_submit();
    };

    //定义元素变动事件
    document.getElementById("note_list").addEventListener('DOMSubtreeModified', function () {
        if($("#note_list  .note_info_container").length > 0)
            $("#no_note_tip").hide();
        else
            $("#no_note_tip").show();
        $(".span_count_of_note").text($("#note_list  .note_info_container").length + "条笔记");
        console.log($("#note_list .note_info_container").length + "条笔记");
    });

    document.getElementById("star_list").addEventListener('DOMSubtreeModified', function () {
        if($("#star_list  .note_info_container").length > 0)
            $("#no_star_tip").hide();
        else
            $("#no_star_tip").show();
    });

    document.getElementById("trash_list").addEventListener('DOMSubtreeModified', function () {
        if($("#trash_list  .note_info_container").length > 0)
            $(".clear_trash_div").show();
        else
            $(".clear_trash_div").hide();

        $(".span_count_of_trash_note").text($("#trash_list  .note_info_container").length + "条笔记");
        console.log($("#trash_list .note_info_container").length + "条已删除笔记");
    });

    /**
     * 动态添加的元素 定义 click 事件的方法
     */
    $('body').on("click", ".note_info_container", function (e) {
        var noteInfo = $(this).data('noteinfo');

        // alert(JSON.stringify(noteInfo));
        let theInfoContainer = this;

        $.get({
            url: "../server/note_retrive.php?noteid=" + noteInfo['noteid'],
            success: function (responsedata) {
                console.log('noteretrive------------responsedata------------------->');
                console.log(responsedata);
                let response = JSON.parse(responsedata);
                if (response['code'] == 0) {
                    // alert(response["data"]);
                    setEditArea(response["data"]);

                    $(".note_info_container").removeClass('note_item_selected');
                    $(theInfoContainer).addClass("note_item_selected");
                }
                else {
                    console.log("NOTE获取失败");
                }
            },
            error: function () {
                console.log("NOTE获取失败 in err");
            }
        });

    });

    //定义排序功能
    $(".note_order_method").click(function () {
        let methodKey = $(this).data("ordermethod");

        fillNoteList(noteOrderMethod[methodKey].order, noteOrderMethod[methodKey].direction);

    });

    //定义笔记添加功能
    $(".new_note_button").click(function () {
        $("#note_area").data('noteinfo', null);
        $("#note_edit_title").val(null);
        $("#my_text_area").html(null);

        note_submit(function () {
            fillNoteList(noteOrderMethod['u_d'].order, noteOrderMethod['u_d'].direction,
                function () {
                    $("#note_list .note_info_container:first").click();
                });
        });
    });


    //定义notelist笔记删除事件
    $("#note_list").on("click", ".note_tool_delete", function (event) {

        let noteInfo = $(this).parent().parent().data("noteinfo");
        let theNoteInfoDiv = $(this).parent().parent();

        $.get({
            url: "../server/note_trash_restore.php?noteid=" + noteInfo["noteid"] + "&operation=1",
            success: function (responsedata) {
                let response = JSON.parse(responsedata);
                if (response["code"] == 0) {
                    console.log(noteInfo + "deleted");

                    let nextNote = $(theNoteInfoDiv).next().length <= 0 ?$(theNoteInfoDiv).prev(): $(theNoteInfoDiv).next();

                    $(theNoteInfoDiv).fadeOut(function () {
                        $(theNoteInfoDiv).remove();
                    });
                    if ($("#note_area").data("noteinfo")["noteid"] == noteInfo["noteid"]) {
                        clearAndHideNoteArea();
                        nextNote.click();
                    }

                    sendSuccessNotification( (noteInfo["title"] == "" ? "无标题" : noteInfo["title"].substr(0,10))
                        + (noteInfo["title"].length>10?"...":"") + "  移入废纸篓");
                }
                else {
                    console.log(noteInfo + "delete failed." + response);
                }
            },
            error: function (msg) {
                console.log(noteInfo + "delete failed." + msg);
            }
        });

        event.stopPropagation();
    });


    //定义notearea笔记删除事件
    $("#top_tool_delete").click(function (event) {

        let noteInfo = $("#note_area").data("noteinfo");
        $("#notelist_item_" + noteInfo["noteid"] + " .note_tool_delete").click();
        event.stopPropagation();
    });

    //定义notearea笔记星标事件
    $("#top_tool_star").click(function (event) {

        let noteInfo = $("#note_area").data("noteinfo");
        $("#notelist_item_" + noteInfo["noteid"] + " .note_tool_shortcut").click();
        event.stopPropagation();
    });

    //
    //定义笔记星标事件
    $("#note_list").on("click", ".note_tool_shortcut", function (event) {

        let noteInfo = $(this).parent().parent().data("noteinfo");
        let starDiv = $(this);

        if ($(starDiv).hasClass("is_star")) {
            $.get({
                url: "../server/note_star_unstar.php?noteid=" + noteInfo["noteid"] + "&operation=0",
                success: function (responsedata) {
                    let response = JSON.parse(responsedata);
                    if (response["code"] == 0) {
                        console.log(noteInfo + "unstared");
                        $(starDiv).removeClass("is_star");
                        // sendSuccessNotification( (noteInfo["title"] == "" ? "无标题" : noteInfo["title"].substr(0,10))
                        //     + (noteInfo["title"].length>10?"...":"") + "  快捷方式删除成功");
                    }
                    else {
                        console.log(noteInfo + "unstar failed." + response);
                    }
                },
                error: function (msg) {
                    console.log(noteInfo + "unstar failed." + msg);
                }
            });
        }
        else {
            $.get({
                url: "../server/note_star_unstar.php?noteid=" + noteInfo["noteid"] + "&operation=1",
                success: function (responsedata) {
                    let response = JSON.parse(responsedata);
                    if (response["code"] == 0) {
                        console.log(noteInfo + "stared");
                        $(starDiv).addClass("is_star");
                        // sendSuccessNotification( (noteInfo["title"] == "" ? "无标题" : noteInfo["title"].substr(0,10))
                        //     + (noteInfo["title"].length>10?"...":"") + "  快捷方式添加成功");
                    }
                    else {
                        console.log(noteInfo + "star failed." + response);
                    }
                },
                error: function (msg) {
                    console.log(noteInfo + "star failed." + msg);
                }
            });
        }


        event.stopPropagation();
    });


    //定义星标区笔记取消星标事件
    $("#star_list").on("click", ".note_tool_shortcut", function (event) {

        let  noteInfoDiv = $(this).parent().parent();
        let noteInfo = $(this).parent().parent().data("noteinfo");
        let starDiv = $(this);

        if ($(starDiv).hasClass("is_star")) {
            $.get({
                url: "../server/note_star_unstar.php?noteid=" + noteInfo["noteid"] + "&operation=0",
                success: function (responsedata) {
                    let response = JSON.parse(responsedata);
                    if (response["code"] == 0) {
                        console.log(noteInfo + "unstared");
                        $(starDiv).removeClass("is_star");
                        $(noteInfoDiv).fadeOut(function () {
                           $(this).remove();
                        });
                        // sendSuccessNotification( (noteInfo["title"] == "" ? "无标题" : noteInfo["title"].substr(0,10))
                        //     + (noteInfo["title"].length>10?"...":"") + "  快捷方式删除成功");
                    }
                    else {
                        console.log(noteInfo + "unstar failed." + response);
                    }

                },
                error: function (msg) {
                    console.log(noteInfo + "unstar failed." + msg);
                }
            });
        }
        event.stopPropagation();
    });

    //点击侧边栏星标按钮事件
    $(".left_navigation_star").click(function () {
        fillStarList(noteOrderMethod["u_d"].order, noteOrderMethod["u_d"].direction);
    });

    //点击废纸篓入口事件
    $(".trash_entry_div").click(function () {
        if($('#trash_container').css('left') == '-450px')
        {
            $("#trash_container").show();
            $("#trash_container").css('left', '0px');
        }

        $('#slide3').removeClass("slide_out");
        $("#slide3").animate({left:-450},"slow", function () {
        });
        $("#note_area_shadow").fadeOut();
        fillTrashList(noteOrderMethod["u_d"].order, noteOrderMethod["u_d"].direction, function () {
            if ($("#trash_list .note_info_container").length > 0) {
                $("#trash_list .note_info_container:first").click();
                console.log("------------------------------------------");
            }
            else {
                clearAndHideNoteArea();
            }
        });
    });

    //点击笔记菜单入口事件
    $(".left_navigation_note").click(function () {
        fillNoteList(noteOrderMethod["u_d"].order, noteOrderMethod["u_d"].direction, function () {
            if ($("#note_list .note_info_container").length > 0) {
                $("#no_note_tip + .note_info_container").click();
            }
            else {
                clearAndHideNoteArea();
            }
        });
    });


    //定义笔记还原事件
    $("#trash_list").on("click", ".note_tool_restore", function (event) {

        let noteInfoDiv = $(this).parent().parent();
        let noteInfo = $(this).parent().parent().data("noteinfo");
        let theNoteInfoDiv = $(this).parent().parent();

        $.get({
            url: "../server/note_trash_restore.php?noteid=" + noteInfo["noteid"] + "&operation=0",
            success: function (responsedata) {
                let response = JSON.parse(responsedata);
                if (response["code"] == 0) {
                    console.log(noteInfo + "restored");
                    $(theNoteInfoDiv).fadeOut(function () {
                       $(this).remove();
                    });
                    if ($("#note_area").data("noteid") == noteInfo["noteid"] && $("#note_list .note_info_container").length > 0) {
                        $("#no_note_tip + .note_info_container").click();
                    }
                    sendSuccessNotification( (noteInfo["title"] == "" ? "无标题" : noteInfo["title"].substr(0,10))
                        + (noteInfo["title"].length>10?"...":"") + "  还原成功");
                }
                else {
                    console.log(noteInfo + "restore failed." + response);
                }
            },
            error: function (msg) {
                console.log(noteInfo + "restore failed." + msg);
            }
        });

        event.stopPropagation();
    });


    //定义笔记彻底删除事件
    $("#trash_list").on("click", ".note_tool_really_delete", function (event) {

        let noteInfoDiv = $(this).parent().parent();
        let noteInfo = $(this).parent().parent().data("noteinfo");
        let theNoteInfoDiv = $(this).parent().parent();

        sendFullAlert("确定彻底删除" + (noteInfo["title"]==""?'无标题':noteInfo["title"]) + "?", function () {
            $.get({
                url: "../server/note_really_delete.php?noteid=" + noteInfo["noteid"],
                success: function (responsedata) {
                    let response = JSON.parse(responsedata);
                    if (response["code"] == 0) {
                        console.log(noteInfo + "really deleted");
                        $(theNoteInfoDiv).remove();
                        if ($("#note_area").data("noteid") == noteInfo["noteid"] && $("#note_list .note_info_container").length > 0) {
                            $("#no_note_tip + .note_info_container").click();
                        }
                        sendSuccessNotification( (noteInfo["title"] == "" ? "无标题" : noteInfo["title"].substr(0,10))
                            + (noteInfo["title"].length>10?"...":"") + "  删除成功");
                    }
                    else {
                        console.log(noteInfo + "really delete failed." + response);
                    }
                },
                error: function (msg) {
                    console.log(noteInfo + "really delete failed." + msg);
                }
            });
        });

        event.stopPropagation();
    });

    /*********************************************************************************************************/
    //清空回收站事件
    $(".clear_trash_div").click(function () {
        sendFullAlert("确定清空废纸篓?", function () {
            $.get({
                url: "../server/trash_clear.php",
                success: function (responsedata) {
                    let response = JSON.parse(responsedata);
                    if (response["code"] == 0) {
                        console.log("trash cleared");
                        sendSuccessNotification(response["data"]["deleted_rows"] + "条笔记删除成功");
                        $("#trash_list .note_info_container").remove();
                    }
                    else {
                        console.log("trash clear failed 1." + responsedata);
                        sendErrorNotification("删除失败");
                    }
                },
                error: function (msg) {
                    console.log("trash clear failed 2." + msg);
                    sendErrorNotification("删除失败");
                }
            });
        });
    });

    /*******************************************************************************************************/
    /***
     * 排序
     */
    fillNoteList(noteOrderMethod["u_d"].order, noteOrderMethod["u_d"].direction, function () {
        if ($("#note_list .note_info_container").length > 0) {
            $("#no_note_tip + .note_info_container").click();
        }
    });

    /************************************************************/
    /*****
     * 点击其他地方隐藏排序面板
     */

    $(document).on("click", function (e) {
        $("#list1").hide();
    })

    $("#list, #photo3").click(function (e) {
        e.stopPropagation();
    });


});

