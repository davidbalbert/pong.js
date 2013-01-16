(function() {
    "use strict";

    var FRAME_RATE = 120;

    var BALL_SIZE = 25;
    var PADDLE_WIDTH = 20;
    var PADDLE_HEIGHT = 100;
    var PADDLE_FREQUENCY = 4;

    var boardHeight;
    var boardWidth;

    function reduce(acc, arr, f) {
        for (var i = 0; i < arr.length; i++) {
            acc = f(acc, arr[i]);
        }
        return acc;
    };

    function map(arr, f) {
        return reduce([], arr, function(acc, e) {
            acc.push(f(e));
            return acc;
        });
    };


    function range(start, end) {
        var range = []
        for (var i = start; i < end; i++) {
            range.push(i);
        }
        return range;
    }

    function combinations(nums, order) {
        if (order == 0) {
            return [[]];
        } else if (order > nums.length) {
            return [];
        } else {
            var withFirst = map(combinations(nums.slice(1), order - 1), function(combo) {
                return [nums[0]].concat(combo);
            });
            var withoutFirst = combinations(nums.slice(1), order);
            return withFirst.concat(withoutFirst);
        }
    }

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
        var indexes = range(0, scene.length);

        var combos = combinations(indexes, 2);

        for (var i = 0; i < combos.length; i++) {
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

    Paddle.prototype.moveUp = function() {
        if (this.y > 0) {
            this.y -= 1;
        }
    };
    Paddle.prototype.moveDown = function() {
        if (this.y + this.height < boardHeight) {
            this.y += 1;
        }
    };

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

        leftPaddle.keyboardTimer = null;
        rightPaddle.keyboardTimer = null;

        window.addEventListener("keydown", function(e) {
            switch(e.keyCode) {
            case 38:
                if (rightPaddle.keyboardTimer) {
                    clearInterval(rightPaddle.keyboardTimer);
                }

                rightPaddle.keyboardTimer = setInterval(function() {
                    rightPaddle.moveUp();
                }, PADDLE_FREQUENCY);
                break;
            case 40:
                if (rightPaddle.keyboardTimer) {
                    clearInterval(rightPaddle.keyboardTimer);
                }

                rightPaddle.keyboardTimer = setInterval(function() {
                    rightPaddle.moveDown();
                }, PADDLE_FREQUENCY);
                break;
            case 65:
                if (leftPaddle.keyboardTimer) {
                    clearInterval(leftPaddle.keyboardTimer);
                }

                leftPaddle.keyboardTimer = setInterval(function() {
                    leftPaddle.moveUp();
                }, PADDLE_FREQUENCY);
                break;
            case 90:
                if (leftPaddle.keyboardTimer) {
                    clearInterval(leftPaddle.keyboardTimer);
                }

                leftPaddle.keyboardTimer = setInterval(function() {
                    leftPaddle.moveDown();
                }, PADDLE_FREQUENCY);
                break;
            }
        });

        window.addEventListener("keyup", function(e) {
            switch (e.keyCode) {
            case 38:
            case 40:
                if (rightPaddle.keyboardTimer) {
                    clearInterval(rightPaddle.keyboardTimer);
                }
                break;
            case 65:
            case 90:
                if (leftPaddle.keyboardTimer) {
                    clearInterval(leftPaddle.keyboardTimer);
                }
                break;
            }
        });
    });
}());
