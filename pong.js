(function() {
    "use strict";

    var FRAME_RATE = 60;

    var BALL_SIZE = 25;
    var PADDLE_WIDTH = 20;
    var PADDLE_HEIGHT = 100;

    var boardHeight;
    var boardWidth;

    function update(scene) {
        for (var i = 0; i < scene.length; i++) {
            scene[i].update();
        }
    };

    function draw(ctx, scene) {
        ctx.clearRect(0, 0, boardWidth, boardHeight);

        for (var i = 0; i < scene.length; i++) {
            scene[i].draw(ctx);
        }
    };

    function Ball(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    };

    Ball.prototype.draw = function(ctx) {
        ctx.fillRect(this.x, this.y, BALL_SIZE, BALL_SIZE);
    };

    Ball.prototype.update = function() {
        if (this.x <= 0 || this.x + BALL_SIZE >= boardWidth) {
            this.vx *= -1;
        }
        if (this.y <= 0 || this.y + BALL_SIZE >= boardHeight) {
            this.vy *= -1;
        }
        this.x += this.vx;
        this.y += this.vy;
    }

    function Paddle(side) {
        if (side === "left") {
            this.x = PADDLE_WIDTH;
        } else {
            this.x = boardWidth - 2 * PADDLE_WIDTH;
        }

        this.y = (boardHeight - PADDLE_HEIGHT) / 2;
    };

    Paddle.prototype.draw = function(ctx) {
        ctx.fillRect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    };

    Paddle.prototype.update = function() {};

    window.addEventListener("load", function() {
        var canvas = document.getElementById("c");
        var ctx = canvas.getContext("2d");

        boardHeight = canvas.height;
        boardWidth = canvas.width;

        var ball = new Ball(50, 70, 2, 2);
        var leftPaddle = new Paddle("left");
        var rightPaddle = new Paddle("right");
        var scene = [ball, leftPaddle, rightPaddle];

        setInterval(function() {
            update(scene);
            draw(ctx, scene);
        }, 1000 / FRAME_RATE);
    });
}());
