<?php

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

readNoteListFromDB($GLOBALS['userid']);


function readNoteListFromDB($userid)
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
select noteid, title, createTime, updateTime, remindTime, markid, notebookid, isStar, isShare from $tablename where userid = $userid and isDelete = 0;
EOF;

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        $data = [];

        while($row = $result->fetch_assoc()) {

            $data[] = [
                "noteid" => $row['noteid'],
                "title" => $row["title"],
                "createTime" => $row["createTime"],
                "updateTime" => $row["updateTime"],
                "remindTime" => $row["remindTime"],
                "markid" => $row["markid"],
                "notebookid" => $row["notebookid"],
                "isStar" => $row["isStar"],
                "isShare" => $row["isShare"],
            ];
        }

        $msg = json_encode([
            "code" => SUCCESS,
            "msg" => "成功",
            "data" => $data
        ]);

        die($msg);
    } else {
        $msg = json_encode([
            "code" => QUERY_NO_DATA,
            "msg" => "未找到数据",
        ]);
        die($msg);
    }

    $conn->close();
}
