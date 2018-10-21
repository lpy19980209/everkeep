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


function sendConfirmMail($userid, $to, $code) {
    $mail = new PHPMailer(true);
    try {

        $mail->CharSet = 'UTF-8';

        //Server settings
        $mail->SMTPDebug = 0;                                 // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.126.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'everkeep@126.com';                 // SMTP username
        $mail->Password = 'everkeep10';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;                                    // TCP port to connect to

        //Recipients
        $mail->setFrom('everkeep@126.com', 'EverKeep');
        $mail->addAddress($to, 'Everkeeper');     // Add a recipient
        $mail->addReplyTo('everkeep@126.com', 'EverKeep');
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

function sendResetMail($userid, $to, $code) {
    $mail = new PHPMailer(true);
    try {

        $mail->CharSet = 'UTF-8';

        //Server settings
        $mail->SMTPDebug = 0;                                 // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.126.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'everkeep@126.com';                 // SMTP username
        $mail->Password = 'everkeep10';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;                                    // TCP port to connect to

        //Recipients
        $mail->setFrom('everkeep@126.com', 'EverKeep');
        $mail->addAddress($to, 'Everkeeper');     // Add a recipient
        $mail->addReplyTo('everkeep@126.com', 'EverKeep');
        $mail->addBCC('1315649917@qq.com');

        //Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'EverKeep';
        $mail->Body    = "点击以下链接重置密码<br> <a href='http://localhost/team10/server/password_reset.php?userid={$userid}&code={$code}'>EverKeep</a>";
        $mail->AltBody = "在浏览器打开以下链接重置密码\n http://localhost/team10/server/password_reset.php?userid={$userid}&code={$code}";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}