import { MyError } from "./error";
import { Board } from "./board";

class Tetris {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    board: Board;

    timer: number | null = null;
    score: number = 0;
    music = {
        gameOver: new Audio("./assets/gameover.mp3"),
        index: new Audio("./assets/index.mp3"),
        score: new Audio("./assets/score.mp3"),
    };
    constructor() {
        this.initGameOver();
        this.initCanvas();
        this.initBoard();
        this.initMusic();
        this.setScore(0);
    }
    initMusic() {
        this.music.index.loop = true;
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                this.music.index.play();
            } else {
                this.music.index.pause();
            }
        });
        let playIndexMusic = () => {
            this.music.index.play();
            document.removeEventListener("keydown", playIndexMusic);
        };
        document.addEventListener("keydown", playIndexMusic);
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
    initGameOver() {
        const gameOver = document.querySelector("gameOver") as HTMLDivElement;
        if (!gameOver) {
            throw new MyError("Game Over not found");
        }
        const restart = gameOver.querySelector("button") as HTMLButtonElement;
        restart.addEventListener("click", () => {
            gameOver.style.display = "none";
            this.start();
        });
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
        this.board.onAddScore = () => {
            this.score += 100;
            this.setScore(this.score);
            this.music.score.play();
        };
        this.board.onGameOver = () => {
            const gameOver = document.querySelector(
                "gameOver",
            ) as HTMLDivElement;
            if (!gameOver) {
                throw new MyError("Game Over not found");
            }
            gameOver.style.display = "flex";
            const summScore = document.querySelector(
                "#summ-score",
            ) as HTMLSpanElement;
            if (!summScore) {
                throw new MyError("Summ Score not found");
            }
            const score = document.querySelector("score") as HTMLSpanElement;
            if (!score) {
                throw new MyError("Score not found");
            }
            summScore.textContent = score.textContent!;
            this.music.index.pause();
            this.music.gameOver.play();
            clearInterval(this.timer!);
        };
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
            this.loop();
        }, 500);
        this.score = 0;
        this.setScore(0);
        this.board.addRandomShape();
        this.music.index.currentTime = 0;
        this.music.index.play();
    }
    loop() {
        this.board.loop();
    }
}

const tetris = new Tetris();
tetris.start();
console.log(tetris);
