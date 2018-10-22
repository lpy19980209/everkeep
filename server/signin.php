<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/20
 * Time: 1:02
 */
session_start();

require_once __DIR__ . "/response_code.php";
//验证数据完整性
if(!isset($_POST['email']) || !isset($_POST['password']))
{
    $msg = json_encode([
        "code" => NOTE_SUBMIT_DATA_NOT_COMPLETE,
        "msg" => "POST数据不完整",
    ]);
    die($msg);
}

$emailPattern = "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/";
$passwordPattern = "/^[a-zA-Z0-9]{40}$/";

//验证邮箱格式
if(!preg_match($emailPattern, $_POST['email'])) {
    $msg = json_encode([
        "code" => EMAIL_FORMAT_ERROR,
        "msg" => "邮箱格式错误",
    ]);
    die($msg);
}

//验证密码格式
if(!preg_match($passwordPattern, $_POST['password'])) {
    $msg = json_encode([
        "code" => PASSWORD_FORMAT_ERROR,
        "msg" => "密码格式错误",
    ]);
    die($msg);
}

confirmUser($_POST['email'], $_POST['password']);

function confirmUser($email, $user_password_sha1)
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
select userid, username, password, email, isConfirm, createTime from $tablename where email = '$email'
EOF;

    $result = $conn->query($sql);
    if($result->num_rows < 1) {
        $msg = json_encode([
            "code" => USER_NOT_EXIST,
            "msg" => "用户不存在",
        ]);
        die($msg);
    }

    else {
        $row = $result->fetch_assoc();
        if($row["password"] !== $user_password_sha1) {
            $msg = json_encode([
                "code" => PASSWORD_ERROR,
                "msg" => "密码错误",
            ]);
            die($msg);
        }

        if($row["isConfirm"] != 1) {
            $msg = json_encode([
                "code" => EMAIL_EXIST_BUT_NOT_CONFIRM,
                "msg" => "用户存在但未激活",
            ]);
            die($msg);
        }

        $_SESSION["uid"] = $row['userid'];

        $msg = json_encode([
            "code" => SUCCESS,
            "msg" => "成功",
        ]);
        die($msg);

    }

    $conn->close();
}