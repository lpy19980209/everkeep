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
        'font-size' : '16px',
    });
    $("body").append(notificationDiv);
    $(notificationDiv).hide();
    $(notificationDiv).attr("id", "top_notification_div")


});


function sendSuccessNotification(msg)
{
    let callBack = null;
    let interval = 2;
    if(arguments.length == 2)
        callBack = arguments[1];
    if(arguments.length == 3)
    {
        interval = arguments[1]
        callBack = arguments[2];
    }

    $("#top_notification_div").stop(false,false);
    $("#top_notification_div").css({
        'background-color' : '#2DBE60',
        'color' : 'white',
    });

    $("#top_notification_div").text(msg);

    $("#top_notification_div").fadeIn("slow");
    window.setTimeout(function () {

            if(callBack != null)
                callBack();

            $("#top_notification_div").fadeOut("slow", function () {
                $("#top_notification_div").stop(true, true);
            });
        },
        interval);
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