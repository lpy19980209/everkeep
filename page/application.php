<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/11
 * Time: 23:49
 */

session_start();

function identity_check()
{
    if(isset($_SESSION["uid"]))
    {
        return true;
    }
    else
    {
        return false;
    }
}

if(!identity_check())
{
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

header('content-type:text/html;charset=uft-8');
header('location:./everkeep.html');