$(document).ready(function () {
    $(".left_menu_me").click(function () {
        sendFullAlert(
            "是否退出当前用户？",
            function () {
                $.get({
                    url: "../server/logout.php",
                    success: function (responsedata) {
                        let response = JSON.parse(responsedata);
                        if (response["code"] == 0) {
                            sendSuccessNotification("已退出登录！", 1, function () {
                                window.location.href = "../page/signin.html";
                            });
                        }
                    },
                    error: function (e) {
                        console.error("登出失败 " + e);
                        sendErrorNotification("退出失败，请检查网络！");
                    }
                });
            }),
            function () {

            }

    });
});