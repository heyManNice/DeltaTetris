import { getBinaryBit } from "./utils";


export class Board {
    rows: number;
    cols: number;
    offsetY: number;
    cellWidth: number;
    cellHeight: number;
    cells: number[];
    ctx: CanvasRenderingContext2D;
    constructor(
        rows: number = 13,
        cols: number = 9,
        offsetY: number = 0,
        width: number = 30,
        height: number = 30,
        ctx: CanvasRenderingContext2D,
    ) {
        this.rows = rows;
        this.cols = cols;
        this.offsetY = offsetY;
        this.cellWidth = width / cols;
        this.cellHeight = (height - offsetY) / rows;
        this.cells = Array.from({ length: rows }, () => 0b11100);
        this.ctx = ctx;
        this.initKeyboard();
    }
    drawCells(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.fillStyle = "rgba(100, 0, 0, 0.5)";
        ctx.lineWidth = 1;
        for (let y = 0; y < this.rows; y++) {
            const row = this.cells[y];
            for (let x = 0; x < this.cols; x++) {
                const cell = getBinaryBit(row, x);
                ctx.strokeRect(
                    x * this.cellWidth,
                    y * this.cellHeight + this.offsetY,
                    this.cellWidth,
                    this.cellHeight,
                );
                if (cell) {
                    ctx.fillRect(
                        x * this.cellWidth,
                        y * this.cellHeight + this.offsetY,
                        this.cellWidth,
                        this.cellHeight,
                    );
                }
            }
        }
    }
    loop() {
        this.drawCells(this.ctx);
    }
    initKeyboard() {
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
    wPress() {
        console.log("wPress");
    }
    aPress() {}
    sPress() {}
    dPress() {}
    SpacePress() {
        console.log("SpacePress");
    }
}
