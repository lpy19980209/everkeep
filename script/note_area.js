
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
    let noteid = null;
    let notetitle = $("#note_edit_title").val();
    let notecontent = tinyMCE.activeEditor.getContent();
    // console.log("local: " + noteid + notetitle + notecontent);

    $.ajax({
       url: note_upload_url,
       type: 'post',
       data: {noteid: noteid, notetitle: notetitle, notecontent: notecontent},
       success: function (response_data) {
           alert("保存成功");
           console.log(response_data);
       },
       error: function (e) {
           alert("无法保存");
       },
    });

    return false;
}