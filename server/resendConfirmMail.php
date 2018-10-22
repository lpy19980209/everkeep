<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/21
 * Time: 1:29
 */

require_once __DIR__ . "/response_code.php";
require_once __DIR__ . "/generateAndSend.php";

//验证数据完整性
if(!isset($_POST['email']))
{
    $msg = json_encode([
        "code" => NOTE_SUBMIT_DATA_NOT_COMPLETE,
        "msg" => "POST数据不完整",
    ]);
    die($msg);
}

$emailPattern = "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/";

//验证邮箱格式
if(!preg_match($emailPattern, $_POST['email'])) {
    $msg = json_encode([
        "code" => EMAIL_FORMAT_ERROR,
        "msg" => "邮箱格式错误",
    ]);
    die($msg);
}

resendConfirmMail($_POST['email']);

function resendConfirmMail($email)
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
select userid, isConfirm from $tablename where email = '$email'
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

        if($row["isConfirm"] == 1) {
            $msg = json_encode([
                "code" => EMAIL_CONFIRM,
                "msg" => "您的账号已激活！",
            ]);
            die($msg);
        }
        generateConfirmCodeAndSendMail($row["userid"], $email);

    }

    $conn->close();
}
