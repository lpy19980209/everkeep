$(document).ready(function () {
    $("#reset_request_button").click(function () {

        closeTip();

        let emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;

        let form = new FormData();
        let email = $("#email").val();

        if(!email.match(emailPattern)) {
            sendEmailTip("邮箱格式错误");
            return;
        }

        form.append("email", email);

        $.ajax({
            url: "../server/sendPasswordResetMail.php",
            type: 'post',
            data: form,
            processData: false,
            contentType: false,
            success: function (response_data) {
                console.log(response_data);
                let response = JSON.parse(response_data);
                if (response['code'] == 0) {

                    console.log("发送成功");
                    sendSuccessNotification("重置链接发送成功，请检查收件箱！", 3000 , function () {
                        // window.location.href="../index.php";
                    });
                }
                else if (response['code'] == 76) {
                    console.error("发送失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("用户不存在!");
                }
                else if (response['code'] == 70) {
                    console.error("发送失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("邮箱格式错误");
                }
                else if (response['code'] == 93) {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("用户已注册但未激活，请检查邮箱以激活后再登录。如未收到邮件请点击<a style='cursor: pointer;color: #2d8ac7' onclick='sendConfirmMail()'>重新发送</a>");
                }
                else {
                    console.error("登录失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("未知错误");
                }

            },
            error: function (e) {
                console.error("登录失败： " + e);
                sendErrorNotification("注册失败，请检查网络状态！");
            },
        });
    });
});