class MyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MyError";
        alert(message);
    }
}

// 格子
class Cell {
    x: number;
    y: number;
    width: number;
    height: number;
    isActive: boolean = false;
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

// 板子
class Board {
    rows: number;
    cols: number;
    offsetY: number;
    cells: Cell[][];
    constructor(
        rows: number = 13,
        cols: number = 9,
        offsetY: number = 0,
        width: number = 30,
        height: number = 30,
    ) {
        this.rows = rows;
        this.cols = cols;
        this.offsetY = offsetY;
        this.cells = Array.from({ length: rows }, (_, row) => {
            return Array.from({ length: cols }, (_, col) => {
                const cellWidth = width / cols;
                const cellHeight = (height - offsetY) / rows;
                return new Cell(
                    col * cellWidth,
                    (row * cellHeight) + offsetY,
                    cellWidth,
                    cellHeight,
                );
            });
        });
        console.log(this.cells);
    }
    drawCells(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.lineWidth = 1;
        this.cells.forEach((row) => {
            row.forEach((cell) => {
                ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
            });
        });
    }
}

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
        this.initKeyboard();
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
        this.board = new Board(13, 9, offsetY, this.width, this.height);
        this.board.drawCells(this.ctx);
    }
    initKeyboard(){
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "w":
                    this.wPress();
                    break;
                case "a":
                    this.aPress();
                    break;
                case "s":
                    this.sPress();
                    break;
                case "d":
                    this.dPress();
                    break;
                case " ":
                    this.SpacePress();
                    break;
            }
        });
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
        }, 1000);
    }
    wPress() {
        console.log("wPress");
        
    }
    aPress() { }
    sPress() { }
    dPress() { }
    SpacePress() {
        console.log("SpacePress");
        
    }
}

const tetris = new Tetris();
tetris.start();
