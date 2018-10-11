
tinymce.init({
    selector: '#mytextarea',
    theme: 'modern',
    // inline: true,
    menubar: false,
    language: 'zh_CN',
    plugins: 'fileupload, link, preview, table, hr, textcolor, lists, autolink',
    toolbar: 'fontselect | fontsizeselect | forecolor textcolor bold italic underline strikethrough | ' +
        'bullist numlist | blockquote link fileupload | table hr | align indent outdent | ' +
        'subscript superscript removeformat ',
});
