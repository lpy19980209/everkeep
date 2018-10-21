$(document).ready(function () {
    $("#signup_submit").click(function () {

        closeTip();

        let emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
        let passwordPattern = /^[a-zA-Z0-9_]{8,20}$/;

        let form = new FormData();
        let email = $("#email").val();
        let password = $("#password").val();
        let password_sha1 = SHA1(password);

        if(!email.match(emailPattern) || !password.match(passwordPattern)) {
            if(!email.match(emailPattern)) {
                sendEmailTip("邮箱格式错误");
            }
            if(!password.match(passwordPattern)) {
                sendPasswordTip("密码应为8-20位的字母、数字、下划线");
            }
            return;
        }


        form.append("email", email);
        form.append("password", password_sha1);

        sendSuccessNotification("连接服务器中......", 3000 , function () {
        });

        $.ajax({
            url: "../server/signup.php",
            type: 'post',
            data: form,
            processData: false,
            contentType: false,
            success: function (response_data) {

                clearSuccessNotification();

                console.log(response_data);
                let response = JSON.parse(response_data);
                if (response['code'] == 0) {

                    console.log("注册成功");
                    sendSuccessNotification("注册成功，验证邮件已发送到邮箱，请先确认再登录！", 3000 , function () {
                        window.location.href="../page/signin.html";
                    });
                }
                else if (response['code'] == 71) {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("用户已存在，请直接登录或使用其它电子邮箱地址。");
                }
                else if (response['code'] == 93) {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("用户已注册但未激活，请检查邮箱以激活或者使用其他邮箱地址," +
                        "如未收到邮件请点击<a style='cursor: pointer;color: #2d8ac7' onclick='sendConfirmMail()'>重新发送</a>");
                }
                else if (response['code'] == 70) {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("邮箱格式错误");
                }
                else if (response['code'] == 75) {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendPasswordTip("密码格式错误");
                }
                else {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("验证邮件发送失败，请确认邮箱地址是否真实有效！");
                }

            },
            error: function (e) {

                $("#top_notification_div").stop(false,false);

                console.error("注册失败： " + e);
                sendErrorNotification("注册失败，请检查网络状态！");
            },
        });
    });
});