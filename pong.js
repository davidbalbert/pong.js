(function() {
    "use strict";

    var FRAME_RATE = 120;

    var BALL_SIZE = 25;
    var PADDLE_WIDTH = 20;
    var PADDLE_HEIGHT = 100;

    var boardHeight;
    var boardWidth;

    function combinations(nums) {
        var combos = [];
        for (var i = 0; i < nums.length - 1; i++) {
            for (var j = i + 1; j < nums.length; j++) {
                combos.push([nums[i], nums[j]]);
            }
        }

        return combos;
    };

    function isBetween(val, start, end) {
        return start < val && val < end;
    };

    function overlaps(o1, o2) {
        return (isBetween(o1.x, o2.x, o2.x + o2.width) ||
                isBetween(o1.x + o1.width, o2.x, o2.x + o2.width)) &&
               (isBetween(o1.y, o2.y, o2.y + o2.height) ||
                isBetween(o1.y + o1.height, o2.y, o2.y + o2.height));
    }

    function collide(scene) {
        var indexes = [];
        for (var i = 0; i < scene.length; i++) {
            indexes.push(i);
        }

        var combos = combinations(indexes);

        for (i = 0; i < combos.length; i++) {
            var o1 = scene[combos[i][0]];
            var o2 = scene[combos[i][1]];

            if (overlaps(o1, o2)) {
                o1.collide(o2);
                o2.collide(o1);
            }
        }
    };

    function update(scene) {
        collide(scene);

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
    };

    Ball.prototype.collide = function(other) {
      if (isBetween(this.x, other.x, other.x + other.width) ||
          isBetween(this.x + this.width, other.x, other.x + other.width)) {
        this.vy *= -1;
      } else {
        this.vx *= -1;
      }
    };

    function Paddle(side) {
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;

        if (side === "left") {
            this.x = this.width;
        } else {
            this.x = boardWidth - 2 * this.width;
        }

        this.y = (boardHeight - this.height) / 2;
    };

    Paddle.prototype.draw = function(ctx) {
        ctx.fillRect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    };

    Paddle.prototype.update = function() {};
    Paddle.prototype.collide = function(other) {};

    Paddle.prototype.moveUp = function() { this.y -= 10; };
    Paddle.prototype.moveDown = function() { this.y += 10; };

    window.addEventListener("load", function() {
        var canvas = document.getElementById("c");
        var ctx = canvas.getContext("2d");

        boardHeight = canvas.height;
        boardWidth = canvas.width;

        var ball = new Ball(50, 70, 1, 1);
        var leftPaddle = new Paddle("left");
        var rightPaddle = new Paddle("right");
        var scene = [ball, leftPaddle, rightPaddle];

        setInterval(function() {
            update(scene);
            draw(ctx, scene);
        }, 1000 / FRAME_RATE);

        window.addEventListener("keydown", function(e) {
            switch(e.keyCode) {
            case 38:
                rightPaddle.moveUp();
                break;
            case 40:
                rightPaddle.moveDown();
                break;
            case 65:
                leftPaddle.moveUp();
                break;
            case 90:
                leftPaddle.moveDown();
                break;
            }
        });
    });
}());
