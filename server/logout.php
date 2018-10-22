<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/20
 * Time: 2:44
 */

session_start();
session_destroy();

require_once __DIR__ . "/response_code.php";

$msg = json_encode([
    "code" => SUCCESS,
    "msg" => "success",
    "data" => $data
]);
die($msg);