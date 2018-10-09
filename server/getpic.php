<?php
$num = $_GET["resid"];
$url = "../pic/$num.png";

function returnimage($url)
{
    $img = file_get_contents($url, true);
    header("Content-Type:image/jpeg;text/html;charset=utf-8");
    echo $img;
    exit;
}

function returnfiledownload($url) {
    header("Content-Type: application/octet-stream");

    $fname = basename($url);
    header("Content-Disposition: attachment; filename='$fname'");

    $fsize = filesize($url);
    header("Content-Length: $fsize");

    readfile($url);
    exit;
}

returnfiledownload($url);
?>