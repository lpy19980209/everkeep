<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 1:16
 */

$resid = $_GET["resid"];
readfilefromdb($resid);

function readfilefromdb($resid)
{
    $servername = "localhost";
    $username = "filedbtest";
    $password = "filedbtest";
    $dbname = "filedbtest";

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
select filemd5, filename, filesize, filecontent from files where filemd5='$resid'
EOF;

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // 输出数据
        while($row = $result->fetch_assoc()) {
//            echo "fmd5: " . $row["filemd5"]. " - fname: " . $row["filename"]. " - fsize: " . $row["filesize"]. "<br>";
            if(preg_match("/png/i", $row["filename"]))
            {
                returnimage($row["filename"], $row["filesize"], $row["filecontent"]);
            }
            else
            {
                returnfiledownload($row["filename"], $row["filesize"], $row["filecontent"]);
            }
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

function returnfiledownload($fname, $fsize, $fdata) {
    header("Content-Type: application/octet-stream");
    header("Content-Disposition: attachment; filename='$fname'");
    header("Content-Length: $fsize");

    echo $fdata;
    exit;
}

function returnimage($fname, $fsize, $fdata)
{
    header("Content-Type:image/jpeg;text/html;charset=utf-8");
    echo $fdata;
    exit;
}