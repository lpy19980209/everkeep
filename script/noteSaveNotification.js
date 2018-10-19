
//保存成功通知

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

/************************************************************************************/
function floatSaveSuccessSign() {
    $("#note_save_success_div").fadeIn(2000);

    window.setTimeout(function () {
            $("#note_save_success_div").fadeOut(1000, function () {
                $("#note_save_success_div").stop(true, true);
            });
        },
        2000);

}