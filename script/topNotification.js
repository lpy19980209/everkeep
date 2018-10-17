/*****************************************************************************/
//顶部通知
$(document).ready(function () {
    let notificationDiv = $("<div></div>");
    $(notificationDiv).css({
        'position' : 'fixed',
        'width' : '36%',
        'height' : "50px",
        'top' : "0px",
        'left' : '32%',
        'right' : '32%',
        "z-index" : "4",
        'background-color' : 'red',
        'border-radius' : '5px',
        'color' : 'white',
        'text-align' : 'center',
        'line-height' : '50px',
        'font-size' : '20px',
    });
    $("body").append(notificationDiv);
    $(notificationDiv).hide();
    $(notificationDiv).attr("id", "top_notification_div")


});


function sendSuccessNotification(msg)
{

    $("#top_notification_div").stop(false,false);
    $("#top_notification_div").css({
        'background-color' : '#2DBE60',
        'color' : 'white',
    });

    $("#top_notification_div").text(msg);

    $("#top_notification_div").fadeIn("slow");
    window.setTimeout(function () {
            $("#top_notification_div").fadeOut("slow", function () {
                $("#top_notification_div").stop(true, true);
            });
        },
        2000);
}

function sendErrorNotification(msg)
{
    $("#top_notification_div").stop(false,false);
    $("#top_notification_div").css({
        'background-color' : 'red',
        'color' : 'white',
    });

    $("#top_notification_div").text(msg);

    $("#top_notification_div").fadeIn("slow");
    window.setTimeout(function () {
            $("#top_notification_div").fadeOut("slow", function () {
            });
        },
        2000);
}

/*************************************************************************************/
//保存成功标志

$(document).ready(function () {
    let saveSuccessDiv = $("<div></div>");
    $(saveSuccessDiv).css({
        'position' : 'absolute',
        'width' : '24px',
        'height' : "24px",
        'top' : "48px",
        'right' : '0px',
        "z-index" : "4",
        'background-image' : 'url(../image/note_style/save_success.png)',
    });
    $(saveSuccessDiv).attr("id", "note_save_success_div")

    $("#note_edit_title").after(saveSuccessDiv);
    $(saveSuccessDiv).hide();
});

function floatSaveSuccessSign() {
    $("#note_save_success_div").fadeIn(2000);

    window.setTimeout(function () {
            $("#note_save_success_div").fadeOut(1000, function () {
                $("#note_save_success_div").stop(true, true);
            });
        },
        2000);
}