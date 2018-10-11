$(document).ready(function(){

    let file_upload_url = "../server/file_receive.php";

    let file_download_url = "";
    //未使用，目前实际使用 insertt(resid) 中的 link

    $("#fsubmitbtn").click(function(){
        let formdata = new FormData();
        var mfile = document.getElementById("fileipt").files[0];

        if(mfile == null)
        {
            alert("请选择文件");
            return;
        }

        if(document.getElementById("fileipt").files[0].size > 20971520)
        {
            alert("单个文件不能大于20MB");
            return;
        }

        formdata.append("myfile", document.getElementById("fileipt").files[0]);
        $.ajax({
            url : file_upload_url,
            type: "POST",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: function (result) {
                console.log(result);
                var response = JSON.parse(result);
                if (response["code"] == 0 || response["code"] == 3)
                {
                    let resid = response["data"]["fmd5"];
                    insertt(resid);
                    parent.window.tinyMCE.activeEditor.windowManager.close();
                }
                else
                {
                    alert("上传失败：" + response["msg"]);
                }
            },
            error: function () {
                alert("连接失败，请稍后再试！");
            }
        });
    });

    $('#cancelbtn').click(function () {
        parent.window.tinyMCE.activeEditor.windowManager.close();
    })

    $("#fileipt").change(function () {
        $("#filenamespan").text($("#fileipt").val());
    });
});

function insertt(resid) {
    var f = document.getElementById("fileipt").files[0];
    var link = "/webeditor_for_everkeep/server/file_retrive.php?resid=" + resid;

    let innerr;
    if(f.type.match(/image/i))
    {
        innerr = "<img width=\"100%\" src ='" + link + "' >";
    }
    else
    {
        innerr = '<a contentEditable="false" href="' + link + '"style="color:#005c78;background-color:#ecf0f3;height: 50; border: #000000;display: inline-block; padding-right: 30px; width: auto">'
            + '<img  src="../image/fileupload_plugin/attach_icon.png" style="display: inline-block;" >'
            + '<span style="display: inline-block">' + f.name + '<br><span>' + (f.size/1024).toFixed(2) + "kb" + '</span></span></a>';
    }

    parent.window.tinyMCE.execCommand("mceInsertContent", false, innerr);
}