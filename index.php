<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/11
 * Time: 23:49
 */

session_start();
require_once './server/permission_manager.php';
require_once './server/response_code.php';

if(!isLogin())
    header("Location: ./page/signup.html" );

else
    header("Location: ./page/everkeep.php");