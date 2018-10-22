<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/21
 * Time: 12:17
 */

session_start();

require_once __DIR__ . "/response_code.php";

//验证数据完整性
if(!isset($_GET['userid']) || !isset($_GET['code']))
{
    $msg = json_encode([
        "code" => GET_PARM_ERROR,
        "msg" => "GET数据不完整",
    ]);
    die($msg);
}

grantSessionForPasswordReset($_GET['userid'], $_GET['code']);

function grantSessionForPasswordReset($userid, $code)
{
    $servername = "localhost";
    $username = "everkeep";
    $password = "everkeep_team10";
    $dbname = "everkeep";

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
select * from confirm where userid = '$userid' and confirmCode = '$code' and `usage` = 2 and current_timestamp()-applyTime<00000000003000
EOF;

    $result = $conn->query($sql);
    if($result->num_rows > 0) {
        $_SESSION['uid_for_psd_reset'] = $_GET['userid'];
        header("Location: ../page/password_reset.php");
    }

    else {
        $sql = <<<EOF
select userid from `user` where userid = '$userid'
EOF;

        $result = $conn->query($sql);
        if($result->num_rows > 0) {
//            $msg = json_encode([
//                "code" => CONFIRM_CODE_EXPIRE,
//                "msg" => "信息已过期",
//            ]);
//            die($msg);
            $response = <<<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>小小笔记</title>
    <meta http-equiv="refresh" content="2;url=../page/signin.html"> 
</head>
<body>
    密码重置链接已过期,请在登录界面重新获取,2秒后进入...
</body>
</html>
EOF;
            echo $response;
            exit;
        }
        else {
            $msg = json_encode([
                "code" => USER_NOT_EXIST,
                "msg" => "用户不存在",
            ]);
            die($msg);
        }
    }
    $conn->close();
}
