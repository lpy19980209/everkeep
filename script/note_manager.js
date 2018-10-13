
let note_upload_url = "../server/note_receive.php";

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
               note_save_success();
           }
           else
           {
               note_save_error();
           }
       },
       error: function (e) {
           note_save_error();
       },
    });

    return false;
}

function note_save_success()
{
    console.log("保存成功");
}

function note_save_error()
{
    console.error("保存失败");
}

$(document).ready(function () {
    $("#note_edit_title").change(function () {
        note_submit();
    });

    window.onunload = function () {
        note_submit();
    };

    // $(".note_info_container").click(function (e) {
    //     var noteInfo = $(this).data('noteinfo');
    //
    //     $.get({
    //        url : "../server/note_retrive.php?" + noteInfo['noteid'],
    //        success : function (responsedata) {
    //            let response = JSON.parse(responsedata);
    //            if(response['code'] == 0)
    //            {
    //                 alert(response["data"]);
    //            }
    //            else
    //            {
    //                alert("NOTE获取失败");
    //            }
    //        },
    //         error : function () {
    //             alert("NOTE获取失败");
    //         }
    //     });
    // });

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

    getNoteList();
});

function getNoteList()
{
    $.get({
        url : "../server/notelist_retrive.php",
        success : function (responsedata) {

            let response = JSON.parse(responsedata);

            if(response['code'] == 0)
            {
                var noteInfoList = response["data"];

                if(noteInfoList.length > 0)
                {
                    $("#no_note_tip").hide();
                }

                for(var i in noteInfoList)
                {

                    var noteInfo = noteInfoList[i];

                    var noteInfoContainer = $("<div></div>");
                    var noteTitle = $("<span></span>");
                    var noteTime = $("<p></p>")

                    console.log(noteInfo);

                    $(noteTitle).text(noteInfo["title"]==""?"无标题":noteInfo["title"]);
                    $(noteTitle).addClass("note_info_title");

                    $(noteTime).text(noteInfo["updateTime"]);
                    $(noteTime).addClass("note_info_time");

                    $(noteInfoContainer).append(noteTitle);
                    $(noteInfoContainer).append(noteTime);

                    $(noteInfoContainer).data('noteinfo', noteInfo);
                    $(noteInfoContainer).addClass("note_info_container");


                    $("#note_list").append(noteInfoContainer);
                }
            }

            else
            {
                console.error("NOTE列表获取失败");
            }
        },
        error : function () {
            console.error("NOTE列表获取失败");
        }
    });
}

function setEditArea(data) {
    console.log('settextarea' + data['noteid'] + data['title'] + data['content']);
    $("#note_area").data('noteid', data['noteid']);
    $("#note_edit_title").val(data['title']);
    $("#my_text_area").html(data['content']);

}