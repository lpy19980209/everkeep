
let note_upload_url = "/webeditor_for_everkeep/view/tinymcehandle.php";

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
    let note_title = $("#note_edit_title").text();
    let note_content = tinyMCE.activeEditor.getContent();
    console.log(note_content);

    $.ajax({
       url: note_upload_url,
       type: 'post',
       data: {note_title: note_title, note_content: note_content},
       success: function (response_data) {
           alert("保存成功");
       },
       error: function (e) {
           alert("无法保存");
       },
    });

    return false;
}