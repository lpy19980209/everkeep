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
$notetitle = $_POST['title'];
$notecontent = $_POST['content'];

savenotetodb($noteid, $_GLOBALS["userid"], $notetitle, $notecontent);



/**
 * 将笔记保存到数据库
 * @param $noteid
 * @param $userid
 * @param $notetitle
 * @param $notecontent
 */
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

        $rand_noteid = mt_rand(1000000, 9999999);

        $notetitle_slashed = addslashes($notetitle);
        $notecontent_slashed = addslashes($notecontent);

        $sql = <<<EOF
INSERT INTO $tablename (noteid, userid, title, content)
VALUES ( '$rand_noteid', '$userid' ,'$notetitle_slashed', '$notecontent_slashed')
EOF;
        if ($conn->query($sql) === TRUE) {

            $data = [
                "noteid" => $rand_noteid,
            ];

            $msg = json_encode([
                "code" => SUCCESS,
                "msg" => "success",
                "data" => $data
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
        $notetitle_slashed = addslashes($notetitle);
        $notecontent_slashed = addslashes($notecontent);

        $sql = <<<EOF
update $tablename set title = '$notetitle_slashed', content = '$notecontent_slashed' 
 where noteid = '$noteid' and userid = '$userid'
EOF;
        if ($conn->query($sql) === TRUE) {

            $data = [
                "noteid" => $noteid,
            ];

            $msg = json_encode([
                "code" => SUCCESS,
                "msg" => "success",
                "data" => $data
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