<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/8
 * Time: 1:16
 */

session_start();
require_once dirname(__FILE__) . "/permission_manager.php";
require_once dirname(__FILE__) . "/response_code.php";

if(!isLogin())
{
    die_for_no_login();
}

$GLOBALS['userid'] = $_SESSION['uid'];

$noteid = $_POST['noteid'];
$notetitle = $_POST['notetitle'];
$notecontent = $_POST['notecontent'];

echo $noteid . "\n" . $notetitle . "\n" . $notecontent;