<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/21
 * Time: 13:43
 */

session_start();
require_once __DIR__ . "/response_code.php";

//验证数据完整性
if(!isset($_POST['password']))
{
    $msg = json_encode([
        "code" => NOTE_SUBMIT_DATA_NOT_COMPLETE,
        "msg" => "POST数据不完整",
    ]);
    die($msg);
}

$passwordPattern = "/^[a-zA-Z0-9]{40}$/";

//验证密码格式
if(!preg_match($passwordPattern, $_POST['password'])) {
    $msg = json_encode([
        "code" => PASSWORD_FORMAT_ERROR,
        "msg" => "密码格式错误",
    ]);
    die($msg);
}

if(!isset($_SESSION['uid_for_psd_reset'])) {
    $msg = json_encode([
        "code" => NO_PERMISSION,
        "msg" => "无权访问",
    ]);
    die($msg);
}

updatePassword($_SESSION['uid_for_psd_reset'], $_POST['password']);

function updatePassword($userid, $user_password_sha1)
{
    $servername = "localhost";
    $username = "everkeep";
    $password = "everkeep_team10";
    $dbname = "everkeep";
    $tablename = "user";

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
update $tablename set password = '$user_password_sha1'
 where userid = $userid
EOF;

    if ($conn->query($sql) === TRUE) {

        $msg = json_encode([
            "code" => SUCCESS,
            "msg" => "success",
        ]);

        unset($_SESSION['uid_for_psd_reset']);

        die($msg);

    } else {
        $msg = json_encode([
            "code" => PASSWORD_RESET_ERROR,
            "msg" => "密码修改失败： " . $conn->error,
        ]);
        die($msg);
    }

    $conn->close();
}
