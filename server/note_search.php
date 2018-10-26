<?php

session_start();

//包含权限检测模块 和 回应码 定义文件， 并检测用户是否登录
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


//检查参数是否正确，若错误则返回 一个错误提示
if(!isset($_GET["orderby"])
    || !isset($_GET["direction"])
    || !in_array($_GET["orderby"], ['updateTime', 'createTime', 'remindTime', 'title'])
    || !in_array($_GET["direction"], ['asc', 'desc'])
    || !isset($_GET["keyword"]))
{
    $msg = json_encode([
        "code" => NOTELIST_RETRIVE_PARMS_ERROR,
        "msg" => "参数有误",
    ]);

    die($msg);
}


//查询条件和登录状态无误，开始查询
readNoteListFromDB($GLOBALS['userid'], $_GET["orderby"], $_GET["direction"]);




/**
 * 从数据库中读取 NOTE_LIST
 *
 * @param $userid 用户id
 * @param $orderby 排序字段，为 updateTime, createTime, remindTime, title
 * @param $direction 排序方法，asc, desc
 *
 */
function readNoteListFromDB($userid, $orderby, $direction)
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
select noteid, title, content, unix_timestamp(createTime) as createTime, unix_timestamp(updateTime) as updateTime, 
unix_timestamp(remindTime) as remindTime, 
markid, notebookid, isStar, isShare from $tablename 
where userid = $userid and isDelete = 0
order by $orderby $direction;
EOF;

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        $data = [];

        while($row = $result->fetch_assoc()) {

            $filter = Array("&nbsp;", " ", "\r", "\n");
            $content = strip_tags($row["content"]);
            foreach($filter as $m)
                $content = mbereg_replace( $m, "" , $content);

            if(substr_count($content, $_GET["keyword"]) > 0 || substr_count($row["title"], $_GET["keyword"]) > 0)
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
                "snippet" => mb_substr($content, 0, 48),
            ];

        }

        $msg = json_encode([
            "code" => SUCCESS,
            "msg" => "成功" . sizeof($data),
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
