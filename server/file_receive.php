<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 0:14
 */

session_start();

require_once './permission_manager.php';
require_once  './response_code.php';

if(isLogin())
{
    $GLOBALS['userid'] = $_SESSION['uid'];
}
else
{
    die_for_no_login();
}

if(!identity_check())
{
    die_for_no_permission();
}


if(!isset($_FILES["myfile"]))
{
    $msg = json_encode([
        "code" => POST_NO_FILE,
        "msg" => "未找到文件(应该是文件太大了)",
    ]);

    die($msg);
}

if($_FILES["myfile"]["error"] > 0)
{
    $msg = json_encode([
        "code" => FILE_POSTED_ERROR,
        "msg" => "文件出错,错误码为 " . $_FILES["myfile"]["error"],
    ]);

    die($msg);
}
else
{
    $fname = $_FILES["myfile"]["name"];
    $tmpfname = $_FILES["myfile"]["tmp_name"];
    $filesize = filesize($tmpfname);
    $filedata = addslashes(fread(fopen($tmpfname, "rb"), $filesize));
    $fmd5 = md5($fname . $filedata);

    insertfiletodb($fmd5, $fname, $filesize, $filedata);
}


function insertfiletodb($fileid, $filename, $filesize, $filedata)
{
    $userid = $_SESSION["uid"];
    $servername = "localhost";
    $username = "everkeep";
    $password = "everkeep_team10";
    $dbname = "everkeep";
    $tablename = "file";

// 创建连接
    $conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
    if ($conn->connect_error) {
        $msg = json_encode([
           "code" => DB_CONNECTION_ERROR,
           "msg" => "数据库连接失败",
        ]);
        die($msg);
    }

    $sql = <<<EOF
INSERT INTO $tablename (fileid, userid, filename, filesize, filedata)
VALUES ('$fileid', '$userid' ,'$filename', '$filesize', '$filedata')
EOF;
    if ($conn->query($sql) === TRUE) {
        $msg = json_encode([
            "code" => SUCCESS,
            "msg" => "success",
            "data" => [
                "fmd5" => $fileid,
                "fname" => $filename,
                "fsize" => $filesize/1024 . " kb",
            ],
        ]);
        die($msg);
    } else {
        $msg = json_encode([
            "code" => DB_INSERTION_ERROR,
            "msg" => "数据插入失败: " . $conn->error,
            "data" => [
                "fmd5" => $fileid,
                "fname" => htmlspecialchars($filename),
                "fsize" => $filesize/1024 . " kb",
            ],
        ]);
        die($msg);
    }

    $conn->close();
}

