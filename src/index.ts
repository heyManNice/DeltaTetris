import { MyError } from "./error";
import { Board } from "./board";

class Tetris {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    board: Board;

    timer: number | null = null;
    score: number = 0;
    constructor() {
        this.initCanvas();
        this.initBoard();
    }

    initCanvas() {
        const canvas = document.getElementById("tetris") as HTMLCanvasElement;
        if (!canvas) {
            throw new MyError("Canvas not found");
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new MyError("Canvas context not found");
        }
        // css宽高
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        // 浏览器缩放因子
        const dpr = window.devicePixelRatio;
        // 真实宽高
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    initBoard() {
        const offsetY = -0.4 * this.width / 9;
        this.board = new Board(
            13,
            9,
            offsetY,
            this.width,
            this.height,
            this.ctx,
        );
    }

    setScore(value: number) {
        const score = document.querySelector("score");
        if (!score) {
            throw new MyError("Score not found");
        }
        if (value > 10_000_000) {
            score.textContent = Math.floor(value / 1000_000).toLocaleString() +
                "M";
        } else if (value > 114514) {
            score.textContent = Math.floor(value / 1000).toLocaleString() + "K";
        } else {
            score.textContent = value.toLocaleString();
        }
    }
    start() {
        this.timer = setInterval(() => {
            this.setScore(this.score++);
            this.loop();
        }, 1000);
    }
    loop() {
        this.board.loop();
    }
}

const tetris = new Tetris();
tetris.start();
console.log(tetris);
