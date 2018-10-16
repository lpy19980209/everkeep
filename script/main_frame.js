$(document).ready(function () {
    $("#img1").mouseover(function () {
        $("#img1").attr("src","../image/main_frame/index11.png");
    })
    $("#img2").mouseover(function () {
        $("#img2").attr("src","../image/main_frame/index22.png")
    })
    $("#img3").mouseover(function () {
        $("#img3").attr("src","../image/main_frame/index33.png")
    })
    $("#img4").mouseover(function () {
        $("#img4").attr("src","../image/main_frame/index44.png")
    })
    $("#img5").mouseover(function () {
        $("#img5").attr("src","../image/main_frame/index55.png")
    })
    $("#img8").mouseover(function () {
        $("#img8").attr("src","../image/main_frame/index88.png")
    })
})

$(document).ready(function () {
    $("#img1").mouseout(function () {
        $("#img1").attr("src","../image/main_frame/index1.png");
    })
    $("#img2").mouseout(function () {
        $("#img2").attr("src","../image/main_frame/index2.png")
    })
    $("#img3").mouseout(function () {
        $("#img3").attr("src","../image/main_frame/index3.png")
    })
    $("#img4").mouseout(function () {
        $("#img4").attr("src","../image/main_frame/index4.png")
    })
    $("#img5").mouseout(function () {
        $("#img5").attr("src","../image/main_frame/index5.png")
    })
   $("#img8").mouseout(function () {
        $("#img8").attr("src","../image/main_frame/index8.png")
    })
})


$(document).ready(function(){
    $("#img8").click(function () {


        if(!$('#slide1').hasClass("slide_out"))
        {
            $(".slide_out").animate({left:-450},"normal").removeClass('slide_out');
            $("#slide1").animate({left:0},"slow", function () {
                $('#slide1').addClass("slide_out");

                $(".checked_left_menu").removeClass("checked_left_menu");
                $("#img8").addClass("checked_left_menu");
            });
        }
        else
        {
            $("#slide1").animate({left:-450},"slow", function () {
                $('#slide1').removeClass("slide_out");
                $(".checked_left_menu").removeClass("checked_left_menu");
                $("#img2").addClass("checked_left_menu");
            });
        }
    });
});
$(document).ready(function () {
    $("#img2").click(function () {

        $(".slide_out").animate({left:-450},"normal").removeClass('slide_out');
        $(".checked_left_menu").removeClass("checked_left_menu");
        $("#img2").addClass("checked_left_menu");

        if($('#trash_container').css('left') == '0px')
        {
            $("#trash_container").css('left', '-450px');
        }
    })
});
$(document).ready(function () {
    $("#img3").click(function () {
        if(!$('#slide3').hasClass("slide_out"))
        {
            $(".slide_out").animate({left:-450},"normal").removeClass('slide_out');
            $("#slide3").animate({left:0},"slow", function () {
                $('#slide3').addClass("slide_out");

                $(".checked_left_menu").removeClass("checked_left_menu");
                $("#img3").addClass("checked_left_menu");
            });
        }
        else
        {
            $("#slide3").animate({left:-450},"slow", function () {
                $('#slide3').removeClass("slide_out");
                $(".checked_left_menu").removeClass("checked_left_menu");
                $("#img2").addClass("checked_left_menu");
            });
        }
    });
});
$(document).ready(function () {
    $("#img5").click(function () {
        if(!$('#slide4').hasClass("slide_out"))
        {
            $(".slide_out").animate({left:-450},"normal").removeClass('slide_out');
            $("#slide4").animate({left:0},"slow", function () {
                $('#slide4').addClass("slide_out");

                $(".checked_left_menu").removeClass("checked_left_menu");
                $("#img5").addClass("checked_left_menu");
            });
        }
        else
        {
            $("#slide4").animate({left:-450},"slow", function () {
                $('#slide4').removeClass("slide_out");
                $(".checked_left_menu").removeClass("checked_left_menu");
                $("#img2").addClass("checked_left_menu");
            });
        }
    });
});
$(document).ready(function () {
    $("#photo3").click(function () {
        $("#list1").toggle()
    })
})
$(document).ready(function () {
    $("#ul1 li").click(function () {
        $(this).append('<img src="../image/main_frame/duihao.png"> ').siblings().children("img").remove();
        $("#list1").hide();
    })
})

$(document).ready(function () {
    if($('#slide2').css('left') == '-450px')
    {
        $("#slide2").show();
        $("#slide2").css('left', '0px');
    }
});