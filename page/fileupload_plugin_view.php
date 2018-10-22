<?php
session_start();
require_once '../server/permission_manager.php';
require_once '../server/response_code.php';

if(!isLogin())
{
    header("Location: ../page/signin.html" );
    die;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Submit File</title>
    <script src="../lib/js/jquery-3.3.1.min.js">
    </script>
    <script src="../script/fileupload_view.js"></script>
    <style>

        .container {
            margin-top: 100px;
        }

        #fileipt {
            display: block;
        }
        button {
            padding: 0px 20px;
            width: 100px;
            height: 30px;
            border-radius: 4px;
            border: 1px;
            font-size: 16px;
        }
        #fsubmitbtn{
            background: #32CD32;
            color: #e3f4e8;
        }
        #fsubmitbtn:hover {
            background: #28a955;
        }
        #cancelbtn {
            background: #ececec;
            color: #606060;
        }
        #cancelbtn:hover {
            background: #d9d9d9;
        }
        #filelabel {
            display: inline-block;
            padding: 0px 20px;
            width: 100px;
            height: 30px;
            border-radius: 4px;
            border: 1px;
            font-size: 16px;
            background: #ececec;
            color: #606060;
        }
        #filelabel:hover {
            background: #d9d9d9;
        }
        #filenamespan {
            text-align: center;
            display: inline-block;
            min-width: 300px;
            height: 30px;
            background-color: whitesmoke;
            border: 1px #8b8b8b;
            border-radius: 4px;
            font-size: 16px;
            color: gray;
        }
        .fileselectdiv {
            text-align: center;
            margin-bottom: 30px;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="container">
    <input id="fileipt" type="file" value="FILE" style="display: none" >
    <div class="fileselectdiv">
    <span id="filenamespan">&emsp;</span>
    <label id="filelabel" for="fileipt">选择文件</label>

    </div>
    <!--<br>-->

    <div class="fileselectdiv">
        <button id="cancelbtn">取消</button>
        <button id="fsubmitbtn">添加</button>
    </div>

    </div>

</body>
</html>