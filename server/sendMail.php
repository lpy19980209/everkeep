<?php
/**
 * Created by PhpStorm.
 * User: Liupy
 * Date: 2018/10/20
 * Time: 13:37
 */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../lib/php/PHPMailer/Exception.php';
require '../lib/php/PHPMailer/PHPMailer.php';
require '../lib/php/PHPMailer/SMTP.php';


function sendAccountConfirm($userid, $to, $code) {
    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->SMTPDebug = 0;                                 // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.zoho.com.cn';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'everkeep@zoho.com.cn';                 // SMTP username
        $mail->Password = 'everkeep_team10';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;                                    // TCP port to connect to

        //Recipients
        $mail->setFrom('everkeep@zoho.com.cn', 'EverKeep');
        $mail->addAddress($to, 'User');     // Add a recipient
        $mail->addReplyTo('everkeep@zoho.com.cn', 'EverKeep');
        $mail->addBCC('1315649917@qq.com');

        //Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'EverKeep';
        $mail->Body    = "点击以下链接确认注册<br> <a href='http://localhost/team10/server/account_confirm.php?userid={$userid}&code={$code}'>EverKeep</a>";
        $mail->AltBody = "在浏览器打开以下链接确认注册\n http://localhost/team10/server/account_confirm.php?userid={$userid}&code={$code}";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}