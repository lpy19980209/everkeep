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

/*********************************************************************************/

function sendFullAlert(msg, yes, no) {
    let container = $('<div></div>');
    $(container).css({
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        backgroundColor: "white",
        zIndex: '10',
        opacity: "0.9"
    })
        .attr("id", "full_screen_alert");

    let tip = $('<div></div>');
    $(tip).css({
        position: 'absolute',
        width : "100%",
        fontSize: "33px",
        fontWeight: "light",
        fontFamily: "宋体",
        textAlign:"center",
        top: "40%",
        color: "#4a4a4a",
    });
    $(tip).text(msg);

    $(container).append(tip);

    let choiceContainer = $('<div></div>');
    $(choiceContainer).css({
        position: 'absolute',
        width : "100%",
        fontSize: "33px",
        fontWeight: "light",
        fontFamily: "宋体",
        textAlign:"center",
        top: "50%",
    });

    let Yes = $('<Button>确定</Button>');
    let No = $('<Button>取消</Button>');

    $(Yes).css({
        height: '30px',
        width: "178px",
        margin: "10px",
        backgroundColor: "#2dbe60",
        outline : "none",
        border: "none",
        color: "#fff",
        borderRadius : "3px",
        cursor: "pointer",
    })
        .click(function () {
            if(yes != null)
                yes();
            $("#full_screen_alert").remove();
        });

    $(No).css({
        height: '30px',
        width: "178px",
        margin: "10px",
        outline : "none",
        border: "none",
        color: "#4a4a4a",
        borderRadius : "3px",
        cursor: "pointer",

    })
        .click(function () {
            if(no != null)
                no();
            $("#full_screen_alert").remove();
        });

    $(choiceContainer).append(Yes).append(No);
    container.append(choiceContainer);

    $('body').append(container);
}
