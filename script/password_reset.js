$(document).ready(function () {
    $("#modify_password").click(function () {

        closeTip();
        let passwordPattern = /^[a-zA-Z0-9_]{8,20}$/;

        let form = new FormData();
        let password = $("#password").val();
        let password_sha1 = SHA1(password);


        if(!password.match(passwordPattern)) {
            sendPasswordTip("密码应为8-20位的字母、数字、下划线");
            return;
        }

        form.append("password", password_sha1);

        $.ajax({
            url: "../server/password_update.php",
            type: 'post',
            data: form,
            processData: false,
            contentType: false,
            success: function (response_data) {
                console.log(response_data);
                let response = JSON.parse(response_data);
                if (response['code'] == 0) {

                    console.log("修改成功");
                    sendSuccessNotification("修改成功！", 1000 , function () {
                        window.location.href="../page/signin.html";
                    });
                }
                else if (response['code'] == 76) {
                    console.error("修改失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("用户不存在！");
                }
                else if (response['code'] == 93) {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("用户已注册但未激活，请检查邮箱以激活后再登录。如未收到邮件请点击<a style='cursor: pointer;color: #2d8ac7' onclick='sendConfirmMail()'>重新发送</a>");
                }
                else if (response['code'] == 70) {
                    console.error("登录失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("邮箱格式错误");
                }
                else if (response['code'] == 75) {
                    console.error("登录失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendPasswordTip("密码格式错误");
                }
                else if (response['code'] == 73) {
                    console.error("登录失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendPasswordTip("密码错误");
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