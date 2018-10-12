<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/12
 * Time: 10:11
 */
require_once( dirname(__FILE__) . "/response_code.php");

function login($uid)
{
    $_SESSION["uid"] = $uid;
}

function isLogin()
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

function die_for_no_login() {
    $msg = json_encode([
        "code" => NO_LOGIN,
        "msg" => "用户未登录",
    ]);
    die($msg);
}

function die_for_no_permission() {
    $msg = json_encode([
        "code" => NO_PERMISSION,
        "msg" => "无权访问",
    ]);
    die($msg);
}