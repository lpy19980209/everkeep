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

        $.ajax({
            url: "../server/signup.php",
            type: 'post',
            data: form,
            processData: false,
            contentType: false,
            success: function (response_data) {
                console.log(response_data);
                let response = JSON.parse(response_data);
                if (response['code'] == 0) {

                    console.log("注册成功");
                    sendSuccessNotification("注册成功，请登录！", 1000 , function () {
                        window.location.href="../page/signin.html";
                    });
                }
                else if (response['code'] == 71) {
                    console.error("注册失败: " + response_data);
                    // sendErrorNotification("注册失败");
                    sendEmailTip("用户已存在，请选择忘记密码或使用其它电子邮箱地址。");
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
                    sendEmailTip("未知错误");
                }

            },
            error: function (e) {
                console.error("注册失败： " + e);
                sendErrorNotification("注册失败，请检查网络状态！");
            },
        });
    });
});

function sendEmailTip(msg) {
    $(".email_tip").text(msg).slideDown();
}

function sendPasswordTip(msg) {
    $(".password_tip").text(msg).slideDown();
}

function closeTip() {
    $(".password_tip, .email_tip").hide();
}

function closeEmailTip() {
    $(".email_tip").hide();
}

function closePasswordTip() {
    $(".password_tip").hide();
}