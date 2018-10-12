<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/11
 * Time: 23:49
 */

session_start();
require_once '../server/permission_manager.php';
require_once '../server/response_code.php';

if(!isLogin())
{
    die_for_no_login();
}

header('content-type:text/html;charset=uft-8');
header('location:./everkeep.html');