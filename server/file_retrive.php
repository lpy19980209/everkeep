<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 1:16
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

if(!isset($_GET["resid"]))
{
    $msg = json_encode([
        "code" => NO_RESID,
        "msg" => "资源ID无效",
    ]);
    die($msg);
}

$resid = $_GET["resid"];
readfilefromdb($resid);

function readfilefromdb($resid)
{
    $servername = "localhost";
    $username = "everkeep";
    $password = "everkeep_team10";
    $dbname = "everkeep";
    $tname = 'file';

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
select userid, filename, filesize, filedata from $tname where fileid='$resid'
EOF;

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        // 输出数据
        while($row = $result->fetch_assoc()) {
//            echo "fmd5: " . $row["fileid"]. " - fname: " . $row["filename"]. " - fsize: " . $row["filesize"]. "<br>";

            if($row["userid"] != $GLOBALS['userid'])
            {
                die_for_no_permission();
            }

            returnfile($row["filename"], $row["filesize"], $row["filedata"]);
        }
    } else {
        $msg = json_encode([
           "code" => QUERY_NO_DATA,
           "msg" => "未找到数据",
        ]);
        die($msg);
    }

    $conn->close();
}

//function returnfiledownload($fname, $fsize, $fdata) {
//    header("Content-Type: application/octet-stream");
//    header("Content-Disposition: attachment; filename='$fname'");
//    header("Content-Length: $fsize");
//
//    echo $fdata;
//    exit;
//}
//
//function returnimage($fname, $fsize, $fdata)
//{
//    header("Content-Type:image/jpeg;text/html;charset=utf-8");
//    echo $fdata;
//    exit;
//}

function returnfile($fname, $fsize, $fdata) {
    $ftype = mime_content_type($fname);
//    header("Content-Type: $ftype");
//
//    if(preg_match("\image\i", $ftype) ||
//        preg_match("\audio\i", $ftype) ||
//        preg_match("\\video\i", $ftype) ||
//        preg_match("\xml\i", $ftype) ||
//        preg_match("\xhtml\i", $ftype) ||
//        preg_match("\\rtf\i", $ftype) ||
//        preg_match("\pdf\i", $ftype) ||
//        preg_match("\\text\i", $ftype))
//    {
//        header("Content-Type:$ftype;text/html;charset:utf-8;");
//    }
//    else {
        header("Content-Type: $ftype");
//        header("Content-Disposition: attachment; filename='$fname'");
        header("Content-Length: $fsize");
//    }
    echo $fdata;
    exit;
}