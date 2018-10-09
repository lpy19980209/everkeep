tinymce.PluginManager.add('fileupload', function(editor, url) {
    // Add a button that opens a window
    editor.addButton('fileupload', {
        text: '上传附件',
        icon: false,
        onclick: function() {
            // Open window
            editor.windowManager.open({
                title: 'File Upload',
                url: '/webeditor/view/fileupload_plugin_view.html',
                width:  window.outerWidth/2,
                height: window.outerHeight/2,
            });
        }
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('fileupload', {
        text: 'File Upload',
        context: 'tools',
        onclick: function() {
            // Open window with a specific url
            editor.windowManager.open({
                title: 'File Upload',
                url: '/webeditor/view/fileupload_plugin_view.html',
                width:  window.outerWidth/2,
                height: window.outerHeight/2,
            });
        }
    });

    return {
        getMetadata: function () {
            return  {
                name: "Example plugin",
                url: "http://exampleplugindocsurl.com"
            };
        }
    };
});
