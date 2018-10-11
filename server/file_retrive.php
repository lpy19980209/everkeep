<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 1:16
 */

session_start();

function identity_check()
{
    if(isset($_SESSION["uid"]))
    {
        $GLOBALS['userid'] = $_SESSION['uid'];
        return true;
    }
    else
    {
        return false;
    }
}

function die_for_no_permission() {
    $check_fail_msg = <<<EOF
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>小小笔记</title>
		<link rel="shortcut icon" href=" /favicon.ico" />
	</head>
	<body>
	    <p>您无权访问此页面！</p>
	</body>
</html>
EOF;
    die($check_fail_msg);
}

if(!identity_check())
{
    die_for_no_permission();
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
            "code" => 2,
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
           "code" => 5,
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