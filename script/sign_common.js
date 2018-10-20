function sendEmailTip(msg) {
    $(".email_tip").html(msg).slideDown();
}

function sendPasswordTip(msg) {
    $(".password_tip").html(msg).slideDown();
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

function sendConfirmMail() {
    let form = new FormData();

    let emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
    let email = $("#email").val();

    if(!email.match(emailPattern)) {
        if(!email.match(emailPattern)) {
            sendEmailTip("邮箱格式错误");
        }
        return;
    }

    form.append("email", email);

    $.ajax({
        url: "../server/resendConfirmMail.php",
        type: 'post',
        data: form,
        processData: false,
        contentType: false,
        success: function (response_data) {
            console.log(response_data);
            let response = JSON.parse(response_data);
            if (response['code'] == 0) {

                console.log("验证邮件发送成功");
                sendSuccessNotification("验证邮件已发送，请检查收件箱进行激活", 3000 , function () {
                });
            }
            else if (response['code'] == 94) {
                console.error("验证邮件发送失败: " + response_data);
                // sendErrorNotification("注册失败");
                sendSuccessNotification("您的账号已激活！", 3000 , function () {
                });
            }
            else if (response['code'] == 76) {
                console.error("验证邮件发送失败: " + response_data);
                // sendErrorNotification("注册失败");
                sendSuccessNotification("用户不存在！", 3000 , function () {
                });
            }
        },
        error: function (e) {
            console.error("验证邮件发送失败： " + e);
            sendErrorNotification("验证邮件发送失败，请检查网络状态！");
        },
    });
}