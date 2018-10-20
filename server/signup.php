<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/20
 * Time: 0:26
 */

require_once __DIR__ . "/response_code.php";
require_once __DIR__ . "/generateConfirmCodeAndSendMail.php";

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

addUser($_POST["email"], $_POST["password"]);

function addUser($email, $user_password_sha1)
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
select userid, username, password, email, createTime, isConfirm from $tablename where email = '$email'
EOF;

    $result = $conn->query($sql);
    if($result->num_rows > 0) {

        if(($result->fetch_assoc())["isConfirm"] == 1)
        {
            $msg = json_encode([
                "code" => EMAIL_EXIST,
                "msg" => "用户已存在",
            ]);
            die($msg);
        }
        else {
            $msg = json_encode([
                "code" => EMAIL_EXIST_BUT_NOT_CONFIRM,
                "msg" => "用户已存在但未确认注册",
            ]);
            die($msg);
        }

    }

    else {

        $sql = <<<EOF
INSERT INTO $tablename (email, username, password)
VALUES ( '$email', null ,'$user_password_sha1')
EOF;
        if ($conn->query($sql) === TRUE) {

            $innerSql = <<<EOF
select userid from $tablename where email = '$email'
EOF;
            $innerResult = $conn->query($innerSql);
            if($innerResult->num_rows > 0) {
                $innerRow = $innerResult->fetch_assoc();
                generateConfirmCodeAndSendMail($innerRow["userid"], $email);
            }
            else {
                $msg = json_encode([
                    "code" => QUERY_NO_DATA,
                    "msg" => "未知错误",
                ]);
                die($msg);
            }
        } else {
            $msg = json_encode([
                "code" => DB_INSERTION_ERROR,
                "msg" => "数据插入失败: " . $conn->error,
            ]);
            die($msg);
        }
    }

    $conn->close();
}