<?php

require_once __DIR__ . "/MailSender.php";

function generateConfirmCodeAndSendMail($userid, $to)
{

    $code = mt_rand(100000,999999);

    $servername = "localhost";
    $username = "everkeep";
    $password = "everkeep_team10";
    $dbname = "everkeep";
    $tablename = "confirm";

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
delete from $tablename where userid = $userid and  `usage` = 1
EOF;

    if ($conn->query($sql) !== TRUE) {

        $msg = json_encode([
            "code" => DB_DELETE_ERROR,
            "msg" => "confirm 删除失败",
        ]);
        die($msg);
    }

    $sql = <<<EOF
insert into $tablename(userid, `usage`, confirmCode)
 values($userid, 1, $code)
EOF;

    if ($conn->query($sql) === TRUE) {
        if(sendConfirmMail($userid, $to, $code)) {
            $msg = json_encode([
                "code" => SUCCESS,
                "msg" => "成功",
            ]);
            die($msg);
        }
        else {
            $msg = json_encode([
                "code" => EMAIL_SEND_ERROR,
                "msg" => "邮件发送失败",
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

    $conn->close();
}

function generateResetCodeAndSendMail($userid, $to)
{

    $code = mt_rand(100000,999999);

    $servername = "localhost";
    $username = "everkeep";
    $password = "everkeep_team10";
    $dbname = "everkeep";
    $tablename = "confirm";

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
delete from $tablename where userid = $userid and  `usage` = 2
EOF;

    if ($conn->query($sql) !== TRUE) {

        $msg = json_encode([
            "code" => DB_DELETE_ERROR,
            "msg" => "confirm 删除失败",
        ]);
        die($msg);
    }

    $sql = <<<EOF
insert into $tablename(userid, `usage`, confirmCode)
 values($userid, 2, $code)
EOF;

    if ($conn->query($sql) === TRUE) {
        if(sendResetMail($userid, $to, $code)) {
            $msg = json_encode([
                "code" => SUCCESS,
                "msg" => "成功",
            ]);
            die($msg);
        }
        else {
            $msg = json_encode([
                "code" => EMAIL_SEND_ERROR,
                "msg" => "邮件发送失败",
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

    $conn->close();
}