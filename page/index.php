<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/11
 * Time: 23:49
 */

session_start();
require_once  dirname(__FILE__) . '/../server/permission_manager.php';
require_once dirname(__FILE__) . '/../server/response_code.php';

if(!isLogin())
{
    $out = file_get_contents( dirname(__FILE__) . "/../page/indexpage.html" );
    echo $out;
}

else
{
    $out = file_get_contents( dirname(__FILE__) . "/../page/everkeep.html" );
    echo $out;
}