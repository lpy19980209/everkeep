<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 1:16
 */

session_start();
require_once dirname(__FILE__) . "/permission_manager.php";
require_once dirname(__FILE__) . "/response_code.php";


if(isLogin())
{
    $_GLOBALS['userid'] = $_SESSION['uid'];
}
else
{
    die_for_no_login();
}

if(!isset($_POST['noteid']) || !isset($_POST['notetitle']) || !isset($_POST['notecontent']))
{
    $msg = json_encode([
       "code" => NOTE_SUBMIT_DATA_NOT_COMPLETE,
        "msg" => "POST数据不完整",
    ]);
}


$noteid = $_POST['noteid'];
$notetitle = $_POST['notetitle'];
$notecontent = $_POST['notecontent'];

savenotetodb($noteid, $_GLOBALS["userid"], $notetitle, $notecontent);


//echo $noteid . "\n" . $notetitle . "\n" . $notecontent;

function savenotetodb($noteid, $userid, $notetitle, $notecontent)
{
    $servername = "localhost";
    $username = "everkeep";
    $password = "everkeep_team10";
    $dbname = "everkeep";
    $tablename = "note";

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
select noteid from $tablename where noteid = '$noteid'
EOF;

    $result = $conn->query($sql);
    if($result->num_rows == 0) {
        $sql = <<<EOF
INSERT INTO $tablename (noteid, userid, title, content)
VALUES ('$noteid', '$userid' ,'$notetitle', '$notecontent')
EOF;
        if ($conn->query($sql) === TRUE) {
            $msg = json_encode([
                "code" => SUCCESS,
                "msg" => "success",
            ]);
            die($msg);
        } else {
            $msg = json_encode([
                "code" => DB_INSERTION_ERROR,
                "msg" => "数据插入失败: " . $conn->error,
            ]);
            die($msg);
        }
    }

    else
    {
        $sql = <<<EOF
update $tablename set title = '$notetitle', content = '$notecontent' 
 where noteid = '$noteid' and userid = '$userid'
EOF;
        if ($conn->query($sql) === TRUE) {
            $msg = json_encode([
                "code" => SUCCESS,
                "msg" => "success",
            ]);
            die($msg);
        } else {
            $msg = json_encode([
                "code" => DB_UPDATE_ERROR,
                "msg" => "数据修改失败: " . $conn->error,
            ]);
            die($msg);
        }
    }

    $conn->close();
}