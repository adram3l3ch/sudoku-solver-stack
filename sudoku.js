class Stack {
    constructor() {
        this.stack = [];
    }

    push(item) {
        this.stack.push(item);
    }
    popItem() {
        this.stack.pop();
    }
    peak() {
        return this.stack.at(-1);
    }
    update() {
        this.stack.at(-1).current++;
        if (this.stack.at(-1).current >= this.stack.at(-1).possibilities.length) {
            this.popItem();
            this.update();
        }
    }
}

class Sudoku extends Stack {
    constructor(sudoku) {
        super();
        this.sudoku = sudoku;
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

    print() {
        let str = "";
        this.answer.forEach((a, i) => {
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

const su = new Sudoku(sudoku);

su.solve();
su.print();
console.log(su);
