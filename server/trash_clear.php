<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/14
 * Time: 1:35
 */

session_start();

require_once './permission_manager.php';
require_once './response_code.php';

if(isLogin())
{
    $GLOBALS['userid'] = $_SESSION['uid'];
}
else
{
    die_for_no_login();
}


deleteIsdeletedNote($GLOBALS['userid']);



function deleteIsdeletedNote($userid)
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
delete from $tablename
 where isDelete=1 and userid = '$userid'
EOF;

    if ($conn->query($sql) === TRUE) {

        $msg = json_encode([
            "code" => SUCCESS,
            "msg" => "success",
            "data" => ["deleted_rows" => $conn->affected_rows],
        ]);
        die($msg);
    } else {
        $msg = json_encode([
            "code" => DB_DELETE_ERROR,
            "msg" => "数据删除失败: " . $conn->error,
        ]);
        die($msg);
    }

    $conn->close();
}