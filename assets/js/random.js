$(function() {
    var run = 0,
        who, heading = $("h1"),
        timer,
        position = 0,
        getDataText = function() {
            return $("#list").val().replace(/ +/g, " ").replace(/^ | $/g, "");
        },
        showAddDataMsg = function() {
            mdui.snackbar({
              message: '😽 请添加抽奖数据！'
            });
        };

    var list = getDataText().length > 0 ? getDataText().split(" ") : [];
    $("#start").click(function() {
        if (list.length == 0) {
            showAddDataMsg();
            return;
        }
        if (!run) {
            heading.html(heading.html().replace("就是他！", "抽谁？"));
            $(this).val("停止");
            timer = setInterval(function() {
                    var r = Math.ceil(Math.random() * list.length);
                    who = list[r - 1];
                    $("#what").html(who);
                    var rTop = Math.ceil(Math.random() * $(document).height()),
                        rLeft = Math.ceil(Math.random() * ($(document).width() - 50)),
                        rSize = Math.ceil(Math.random() * (37 - 14) + 14);
                    $("<span class='temp'></span>").html(who).hide().css({
                        "top": rTop,
                        "left": rLeft,
                        "color": "rgba(0,0,0,." + Math.random() + ")",
                        "fontSize": rSize + "px"
                    }).appendTo("body").fadeIn("slow",
                        function() {
                            $(this).fadeOut("slow",
                                function() {
                                    $(this).remove();
                                });
                        });
                },
                50);
            run = 1;
        } else {
            if (list.length > 0) {
                ++position;
            }
            $.each(list, function(index, item) {
                    if (item == who) {
                        list.splice(index, 1);
                    }
            });
            if (typeof(who) != 'undefined') {
                $("#prize").append("<p>").append(position + ":" + who).append("</p>");
            }

            heading.html(heading.html().replace("抽谁？", "就是他！"));
            $(this).val("不行，换一个");
            clearInterval(timer);
            run = 0;
        };
    });

    $("#add_action").click(function(){
        var names = getDataText().split(" ");
        if (names.length > 0) {
            list = list.concat(names);
            mdui.snackbar({
                message: '🐱 添加成功！'
            });
        } else {
            showAddDataMsg();
        }
    });

    $('#btn-clear-all').click(function() {
        let message;
        if (!run) {
            $("#list").text("");
            $("#what").text("");
            $("#start").val("开始");
            list = [];
            message = '👻 抽奖数据已清空';
        } else {
            message = '😨 正在抽奖不能清空！';
        }
        mdui.snackbar({
              message: message
        });
    });
    document.onkeydown = function enter(e) {
        var e = e || event;
        if (e.keyCode == 13 || e.keyCode == 32 && !$("#addDialog").is(":visible")) $("#start").trigger("click");
    };
});
