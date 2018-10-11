<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 0:14
 */

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

//    echo "上传文件名: " . $fname . "<br>";
//    echo "文件类型: " . $mimetype . "<br>";
//    echo "文件大小: " . $filesize / 1024 . " kB<br>";
//    echo "文件临时存储的位置: " . $tmpfname;
//    echo "文件data: " . $filedata;

    insertfiletodb($fmd5, $fname, $filesize, $filedata);
}


function insertfiletodb($fmd5, $fname, $fsize, $fdata)
{
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
INSERT INTO files (filemd5, filename, filesize, filecontent)
VALUES ('$fmd5', '$fname', '$fsize', '$fdata')
EOF;
    if ($conn->query($sql) === TRUE) {
        $msg = json_encode([
            "code" => 0,
            "msg" => "success",
            "data" => [
                "fmd5" => $fmd5,
                "fname" => $fname,
                "fsize" => $fsize/1024 . " kb",
            ],
        ]);
        die($msg);
    } else {
        $msg = json_encode([
            "code" => 3,
            "msg" => "数据插入失败: " . $conn->error,
            "data" => [
                "fmd5" => $fmd5,
                "fname" => htmlspecialchars($fname),
                "fsize" => $fsize/1024 . " kb",
            ],
        ]);
        die($msg);
    }

    $conn->close();
}

