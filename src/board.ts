import { getBinaryBit, random } from "./utils";

// 形状
const SHAPES = {
    O: [
        0b11,
        0b11,
    ],
    I: [
        0b1,
        0b1,
        0b1,
        0b1,
    ],
    S: [
        0b011,
        0b110,
    ],
    Z: [
        0b110,
        0b011,
    ],
    L: [
        0b10,
        0b10,
        0b11,
    ],
    J: [
        0b01,
        0b01,
        0b11,
    ],
    T: [
        0b111,
        0b010,
    ],
};

export class Board {
    rows: number;
    cols: number;
    offsetY: number;
    cellWidth: number;
    cellHeight: number;
    boardWidth: number;
    boardHeight: number;
    cellsActive: {
        x: number;
        y: number;
        data: typeof SHAPES[keyof typeof SHAPES];
    };
    cellsStatic: number[];
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
        this.boardWidth = width;
        this.boardHeight = height;
        this.offsetY = offsetY;
        this.cellWidth = width / cols;
        this.cellHeight = (height - offsetY) / rows;
        this.cellsStatic = Array.from({ length: rows }, () => 0);
        this.ctx = ctx;
        this.initKeyboard();
    }
    drawCells(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.fillStyle = "rgba(100, 0, 0, 0.5)";
        ctx.lineWidth = 1;
        for (let y = 0; y < this.rows; y++) {
            const rowStatic = this.cellsStatic[y];
            for (let x = 0; x < this.cols; x++) {
                const cellStatic = getBinaryBit(rowStatic, x);
                ctx.strokeRect(
                    x * this.cellWidth,
                    y * this.cellHeight + this.offsetY,
                    this.cellWidth,
                    this.cellHeight,
                );
                if (cellStatic) {
                    ctx.fillRect(
                        x * this.cellWidth,
                        y * this.cellHeight + this.offsetY,
                        this.cellWidth,
                        this.cellHeight,
                    );
                }
            }
        }
        if (!this.cellsActive) {
            return;
        }
        const { data } = this.cellsActive;
        for (let y = 0; y < data.length; y++) {
            const row = data[y];
            for (let x = 0; x < this.cols; x++) {
                const cell = getBinaryBit(row, x);
                if (cell) {
                    ctx.fillRect(
                        (x + this.cellsActive.x) * this.cellWidth,
                        (y + this.cellsActive.y) * this.cellHeight +
                            this.offsetY,
                        this.cellWidth,
                        this.cellHeight,
                    );
                }
            }
        }
    }
    addShape(shape: number[]) {
        let shapeWidth = 0;
        for (let y = 0; y < shape.length; y++) {
            const row = shape[y];
            shapeWidth = Math.max(shapeWidth, row.toString(2).length);
        }
        this.cellsActive = {
            x: Math.floor((this.cols - shapeWidth) / 2),
            y: 0,
            data: shape,
        };
    }
    loop() {
        this.draw();
        this.fall();
    }
    fall() {
        if (!this.cellsActive) {
            return;
        }
        this.cellsActive.y++;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
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
            this.draw();
        });
    }
    wPress() {
        const kinds = Object.keys(SHAPES);
        const randomKind = kinds[random(0, kinds.length - 1)];
        this.addShape(SHAPES[randomKind]);
    }
    aPress() {
        if (!this.cellsActive) return;
        if (this.cellsActive.x === 0) {
            return;
        }
        this.cellsActive.x--;
    }
    sPress() {
        this.fall();
    }
    dPress() {
        if (!this.cellsActive) return;
        let maxWidth = 0;
        for (let y = 0; y < this.cellsActive.data.length; y++) {
            const row = this.cellsActive.data[y];
            maxWidth = Math.max(maxWidth, row.toString(2).length);
        }
        if (this.cellsActive.x + maxWidth === this.cols) {
            return;
        }
        this.cellsActive.x++;
    }
    SpacePress() {
        if (!this.cellsActive) return;
        const data = this.cellsActive.data;
        const rows = data.length;
        let cols = 0;
        for (let y = 0; y < rows; y++) {
            cols = Math.max(cols, data[y].toString(2).length);
        }

        const matrix: number[][] = [];
        for (let y = 0; y < rows; y++) {
            const row: number[] = [];
            for (let x = 0; x < cols; x++) {
                row.push(getBinaryBit(data[y], x));
            }
            matrix.push(row);
        }

        const rotatedMatrix: number[][] = [];
        for (let x = 0; x < cols; x++) {
            const newRow: number[] = [];
            for (let y = rows - 1; y >= 0; y--) {
                newRow.push(matrix[y][x]);
            }
            rotatedMatrix.push(newRow);
        }
        const rotatedData: number[] = [];
        for (let y = 0; y < rotatedMatrix.length; y++) {
            const row = rotatedMatrix[y];
            let num = 0;
            for (let x = 0; x < row.length; x++) {
                num = num | (row[x] << x);
            }
            rotatedData.push(num);
        }
        this.cellsActive.data = rotatedData;

        let maxWidth = 0;
        for (let y = 0; y < this.cellsActive.data.length; y++) {
            const row = this.cellsActive.data[y];
            maxWidth = Math.max(maxWidth, row.toString(2).length);
        }
        while (this.cellsActive.x + maxWidth > this.cols) {
            this.cellsActive.x--;
        }
    }
}
