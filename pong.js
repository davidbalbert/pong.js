(function() {
    "use strict";

    var FRAME_RATE = 60;

    var BALL_SIZE = 30;

    var boardHeight;
    var boardWidth;

    function update(ball) {
        if (ball.x == 0 || ball.x + BALL_SIZE == boardWidth) {
            ball.vx *= -1;
        }
        if (ball.y == 0 || ball.y + BALL_SIZE == boardHeight) {
            ball.vy *= -1;
        }
        ball.x += ball.vx;
        ball.y += ball.vy;
    }

    function draw(ctx, ball) {
        ctx.clearRect(0, 0, boardWidth, boardHeight);
        ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
    }

    window.addEventListener("load", function() {
        var canvas = document.getElementById("c");
        var ctx = canvas.getContext("2d");

        boardHeight = canvas.height;
        boardWidth = canvas.width;

        var ball = {x: 50, y: 70, vx: 2, vy: 2};

        setInterval(function() {
            update(ball);
            draw(ctx, ball);
        }, 1000 / FRAME_RATE);
    });
}());
