<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 0:14
 */


function identity_check()
{
    if(isset($_SESSION["uid"]))
    {
        return true;
    }
    else
    {
        return true;
    }
}

if(!identity_check())
{
    $check_fail_msg = <<<EOF
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>小小笔记</title>
		<link rel="shortcut icon" href=" /favicon.ico" /> 
	</head>
	<body>
	    <p>您无权访问此页面！</p>
	</body>
</html>
EOF;
    die($check_fail_msg);
}


if(!isset($_FILES["myfile"]))
{
    $msg = json_encode([
        "code" => 8,
        "msg" => "未找到文件",
    ]);

    die($msg);
}

if($_FILES["myfile"]["error"] > 0)
{
    $msg = json_encode([
        "code" => 1,
        "msg" => "文件出错" . $_FILES["myfile"]["error"],
    ]);

    die($msg);
}
else
{
    $fname = $_FILES["myfile"]["name"];
    $tmpfname = $_FILES["myfile"]["tmp_name"];
    $filesize = filesize($tmpfname);
    $mimetype = $_FILES["myfile"]["type"];
    $filedata = addslashes(fread(fopen($tmpfname, "rb"), $filesize));
    $fmd5 = md5($fname . $filedata);

    insertfiletodb($fmd5, $fname, $filesize, $filedata, $filemimetype);
}


function insertfiletodb($filemd5, $filename, $filesize, $filedata, $filemimetype)
{
    $userid = $_SESSION["uid"];
    $servername = "localhost";
    $username = "filedbtest";
    $password = "filedbtest";
    $dbname = "filedbtest";

// 创建连接
    $conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
    if ($conn->connect_error) {
        $msg = json_encode([
           "code" => 2,
           "msg" => "数据库连接失败",
        ]);
        die($msg);
    }

    $sql = <<<EOF
INSERT INTO files (filemd5, userid, filename, filesize, filedata, filemimetype)
VALUES ('$filemd5', '$userid' ,'$filename', '$filesize', '$filedata', '$filemimetype')
EOF;
    if ($conn->query($sql) === TRUE) {
        $msg = json_encode([
            "code" => 0,
            "msg" => "success",
            "data" => [
                "fmd5" => $filemd5,
                "fname" => $filename,
                "fsize" => $filesize/1024 . " kb",
            ],
        ]);
        die($msg);
    } else {
        $msg = json_encode([
            "code" => 3,
            "msg" => "数据插入失败: " . $conn->error,
            "data" => [
                "fmd5" => $filemd5,
                "fname" => htmlspecialchars($filename),
                "fsize" => $filesize/1024 . " kb",
            ],
        ]);
        die($msg);
    }

    $conn->close();
}

