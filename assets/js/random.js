$(function() {
    var winners;
    if (localStorage.getItem('winners')) {
        winners = JSON.parse(localStorage.getItem('winners'));
    } else {
        winners = [];
    }
    if (winners.length > 0) {
        for (let i = 0;i<winners.length;i++) {
            $("#prize-list").append("<p>").append(i+1 + ". " + winners[i]).append("</p>");
        }
        $("#prize-text").addClass("show");
        $("#start").val("继续抽奖");

    }
    var run = 0,
        who, heading = $("h1"),
        timer,
        position = winners.length,
        getDataText = function() {
            return $("#list").val().replace(/ +/g, " ").replace(/^ | $/g, "");
        },
        showAddDataMsg = function() {
            mdui.snackbar({
                message: '😽 请添加抽奖数据！',
                position: 'left-bottom'
            });
        },
        showWinner = function() {
            if (list.length > 0) {
                ++position;
            }
            $.each(list, function(index, item) {
                if (item == who) {
                    list.splice(index, 1);
                    localStorage.setItem('namelist',JSON.stringify(list));
                }
            });
            if (typeof(who) != 'undefined') {
                if (!$("#prize-text").is(":visible")) {
                    $("#prize-text").addClass("show");
                }
                $("#prize-list").append("<p>").append(position + ". " + who).append("</p>");
                winners.push(who);
                localStorage.setItem('winners',JSON.stringify(winners));
            }

            heading.html(heading.html().replace("抽谁？", "就是他！"));
            $("#start").val("继续抽奖");
            clearInterval(timer);
            run = 0;
        };

    var list = getDataText().length > 0 ? getDataText().split(" ") : [];
    if (list.length === 0) {
        if (localStorage.getItem('namelist')) {
            list = JSON.parse(localStorage.getItem('namelist'));
        }
    }
    $("#start").click(function() {
        if (list.length == 0) {
            showAddDataMsg();
            $("#start").val("开始");
            $("#what").val("");
            return;
        }
        if (!run) {
            heading.html(heading.html().replace("就是他！", "抽谁呢？"));
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
            showWinner();
        };
    });

    $("#add_action").click(function() {
        var names = getDataText().split(" ");
        if (names.length > 0) {
            list = list.concat(names);
            localStorage.setItem('namelist',JSON.stringify(list));
            mdui.snackbar({
                message: '🐱 添加成功！',
                position: 'left-bottom'
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
            winners = [];
            localStorage.clear();
            message = '👻 抽奖数据已清空';
        } else {
            message = '😨 正在抽奖不能清空！';
        }
        mdui.snackbar({
            message: message,
            position: 'left-bottom'
        });
    });
    document.onkeydown = function enter(e) {
        if (e.keyCode == 13 || e.keyCode == 32 && !$("#add-dialog").is(":visible")) {
            if (!run) {
                $("#start").trigger("click");
            } else {
                showWinner();
            }
        }
    };
});
