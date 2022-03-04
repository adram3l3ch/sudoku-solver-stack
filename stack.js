export default class Stack {
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
