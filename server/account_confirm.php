<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/20
 * Time: 22:16
 */

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

accountConfirm($_GET['userid'], $_GET['code']);

function accountConfirm($userid, $code)
{
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
select * from $tablename where userid = '$userid' and confirmCode = '$code'
EOF;

    $result = $conn->query($sql);
    if($result->num_rows > 0) {
        alterIsConfirm($userid);
    }

    else {
        $sql = <<<EOF
select userid from $tablename where userid = '$userid'
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
    激活链接已过期,请在登录界面重新获取,2秒后进入...
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

function alterIsConfirm($userid)
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
update $tablename set isConfirm = 1
 where userid = '$userid'
EOF;

    if ($conn->query($sql) === TRUE) {

//        $msg = json_encode([
//            "code" => SUCCESS,
//            "msg" => "success",
//        ]);
//        die($msg);
        $response = <<<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>小小笔记</title>
    <meta http-equiv="refresh" content="2;url=../page/signin.html"> 
</head>
<body>
    激活成功，2秒后登录...
</body>
</html>
EOF;
        echo $response;
        exit;

    } else {
        $msg = json_encode([
            "code" => ACCOUNT_CONFIRM_ERROR,
            "msg" => "数据更新失败,用户确认失败: " . $conn->error,
        ]);
        die($msg);
    }

    $conn->close();
}
