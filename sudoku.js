import Stack from "./stack.js";
class Sudoku extends Stack {
    constructor(sudoku, level) {
        super();
        if (sudoku) this.sudoku = [...sudoku];
        else this.generate(level);
    }

    generate(level) {
        this.sudoku = new Array(81).fill(0);
        for (let i = 0; i < 81; i++) {
            const possibilities = this.getPossibilities(this.sudoku, i);
            if (possibilities.length === 0) {
                i = -1;
                this.sudoku = new Array(81).fill(0);
                continue;
            }
            let num = Math.floor(Math.random() * possibilities.length);
            this.sudoku[i] = possibilities[num];
        }
        this.makeQuestion(level);
    }

    makeQuestion(level) {
        let min;
        let max;
        switch (level) {
            case "easy":
                min = 10;
                max = 15;
                break;
            case "medium":
                min = 15;
                max = 25;
                break;
            case "hard":
                min = 25;
                max = 30;
                break;
            default:
                min = 30;
                max = 50;
        }

        let emptySlots = Math.floor(Math.random() * (max - min)) + min;
        while (emptySlots > 0) {
            let slot = Math.floor(Math.random() * 81);
            if (this.sudoku[slot] !== 0) {
                emptySlots--;
                this.sudoku[slot] = 0;
            }
        }
    }

    rowValid(sudoku, row, num) {
        let rowStartInd = row * 9;
        let rowEndInd = rowStartInd + 9;
        for (rowStartInd; rowStartInd < rowEndInd; rowStartInd++) {
            if (sudoku[rowStartInd] === num) {
                return false;
            }
        }
        return true;
    }

    colValid(sudoku, col, num) {
        let colStartInd = col;
        let colEndInd = col + 73;
        for (colStartInd; colStartInd < colEndInd; colStartInd += 9) {
            if (sudoku[colStartInd] === num) {
                return false;
            }
        }
        return true;
    }

    boxValid(sudoku, row, col, num) {
        let boxi = Math.floor(row / 3) * 3;
        let boxj = Math.floor(col / 3) * 3;
        for (let x = boxi; x < boxi + 3; x++) {
            for (let y = boxj; y < boxj + 3; y++) {
                if (sudoku[x * 9 + y] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    isValid(sudoku, i, num) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        return (
            this.rowValid(sudoku, row, num) &&
            this.colValid(sudoku, col, num) &&
            this.boxValid(sudoku, row, col, num)
        );
    }

    getPossibilities(sudoku, i) {
        const possibilities = [];
        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((num) => {
            if (this.isValid(sudoku, i, num)) {
                possibilities.push(num);
            }
        });
        return possibilities;
    }

    solve() {
        let copy = [...this.sudoku];
        let index = 0;

        while (index < 81) {
            if (!copy[index]) {
                const possibilities = this.getPossibilities(copy, index);
                if (possibilities.length === 1) copy[index] = possibilities[0];
                else if (possibilities.length === 0) {
                    this.update();
                    const top = this.peak();
                    copy = [
                        ...copy.slice(0, top.index),
                        top.possibilities[top.current],
                        ...this.sudoku.slice(top.index + 1),
                    ];
                    index = top.index + 1;
                    continue;
                } else {
                    this.push({ index, possibilities, current: 0 });
                    copy[index] = possibilities[0];
                }
            }
            index++;
        }
        this.answer = [...copy];
        this.stack = [];
    }

    print(sudoku) {
        let str = "";
        sudoku.forEach((a, i) => {
            if (i % 9 === 0) str = str + "\n\n";
            str = str + a + "\t";
        });
        console.log(str);
    }
}

const sudoku = [
    0, 0, 0, 0, 5, 6, 0, 9, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 0, 6, 0, 3, 8, 0, 0, 4, 5, 0, 0,
    6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 0, 0, 0, 1, 0, 8, 0, 0, 0, 0, 0, 0,
    4, 0, 7, 0, 8, 8, 0, 0, 7, 0, 3, 2, 6, 0, 0, 0, 7, 8, 0, 5, 0, 0, 4,
];

const su = new Sudoku(sudoku, "easy");

// su.solve();
// su.print();
// console.log(su);

su.print(su.sudoku);
su.solve();
su.print(su.answer);

//hello world
