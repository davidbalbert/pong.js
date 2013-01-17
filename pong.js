(function() {
    "use strict";

    var FRAME_RATE = 120;

    var BALL_SIZE = 20;
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

    function isBetweenInclusive(val, start, end) {
        return start <= val && val <= end;
    };

    function overlaps(o1, o2) {
        return (isBetweenInclusive(o1.x, o2.x, o2.x + o2.width) ||
                isBetweenInclusive(o1.x + o1.width, o2.x, o2.x + o2.width)) &&
               (isBetweenInclusive(o1.y, o2.y, o2.y + o2.height) ||
                isBetweenInclusive(o1.y + o1.height, o2.y, o2.y + o2.height));
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

        this.width = BALL_SIZE;
        this.height = BALL_SIZE;
    };

    Ball.prototype.draw = function(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
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

    Ball.prototype.calculateIntersectionArea = function(other) {
        var a, b;
        if (this.x <= other.x) {
            a = this;
            b = other;
        } else {
            a = other;
            b = this;
        }

        if (isBetweenInclusive(a.x + a.width, b.x, b.x + b.width) &&
                isBetweenInclusive(a.y, b.y, b.y + b.height) &&
                isBetweenInclusive(a.y + a.height, b.y, b.y + b.height)) {
            /* top, right, and bottom edges inside */
            return {
                x: b.x,
                y: a.y,
                width: a.x + a.width - b.x,
                height: a.height
            };
        } else if (isBetweenInclusive(a.x + a.width, b.x, b.x + b.width) &&
                isBetweenInclusive(a.y + a.height, b.y, b.y + b.height)) {
            /* right and bottom edges inside */
            return {
                x: b.x,
                y: b.y,
                width: a.x + a.width - b.x,
                height: a.y + a.height - b.y
            };
        } else if (isBetweenInclusive(a.x + a.width, b.x, b.x + b.width) &&
                isBetweenInclusive(a.y, b.y, b.y + b.height)) {
            /* right and top edges inside */
            return {
                x: b.x,
                y: a.y,
                width: a.x + a.width - b.x,
                height: b.y + b.height - a.y
            };
        } else if (isBetweenInclusive(a.x + a.width, b.x, b.x + b.width)) {
            /* right edge inside */
            return {
                x: b.x,
                y: b.y,
                width: a.x + a.width - b.x,
                height: b.height
            };
        } else if (isBetweenInclusive(a.y + a.height, b.y, b.y + b.height)) {
            /* bottom edge inside */
            return {
                x: b.x,
                y: b.y,
                width: b.width,
                height: a.y + a.height - b.y
            };
        } else if (isBetweenInclusive(a.x, b.x, b.x + b.height)) {
            /* top edge inside */
            return {
                x: b.x,
                y: a.y,
                width: b.width,
                height: b.y + b.height - a.y
            };
        } else {
            /* all edges outsie */
            return {
                x: b.x,
                y: b.y,
                width: b.width,
                height: b.height
            };
        }
    }

    Ball.prototype.collide = function(other) {
        var inter = this.calculateIntersectionArea(other);
        if (inter.width > inter.height) {
            if (inter.y + inter.height >= other.y + other.height) {
                this.vy = 1;
            } else {
                this.vy = -1;
            }
            this.y += this.vy * inter.height;

            /* make sure we don't go through the sides of the board */
            if (this.y < 0) {
                this.y = 0;
                other.y = this.height;
            } else if (this.y + this.height > boardHeight) {
                this.y = boardHeight - this.height;
                other.y = this.y - other.height;
            }

        } else {
            if (inter.x > other.x && inter.x < other.x + other.width) {
                this.vx = 1;
            } else {
                this.vx = -1;
            }
            this.x += this.vx * inter.width;
        }
    };

    function Paddle(side) {
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;

        if (side === "left") {
            this.x = 0;
        } else {
            this.x = boardWidth - this.width;
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
