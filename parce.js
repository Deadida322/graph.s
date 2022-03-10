const testCases = [
    "x ^2"
]

const PRIORITY = {
    // "(": 4,
    // ")": 4,
    "^": 3,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1
}

function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}

Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

Queue.prototype.dequeue = function() {
    let oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;

        return deletedData;
    }
};

function Node(data) {
    this.text = data;
    this.parent = null;
    this.children = [];
}

function Tree(data) {
    let node = new Node(data);
    console.log(node)
    this._root = node;
}

Tree.prototype.bfs = function(callback) {
    let queue = new Queue();

    queue.enqueue(this._root);

    let currentTree = queue.dequeue();

    while (currentTree) {
        for (let i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }

        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};

Tree.prototype.add = function(data, toData, traversal) {
    let child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };

    this.contains(callback, traversal);

    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

function rpn(elements) {
    let stack = [];
    let outString = "";
    for (let i in elements) {
        let candidate = elements[i];
        if (!isNaN(candidate) || candidate.match(/[a-zA-Z0-9]+/g)) {
            // stack.push(candidate);
            outString = outString + " " + candidate;
        } else if (candidate === "(") {
            stack.push(candidate)
        } else if (candidate === ")") {
            let j = stack.length - 1;
            while (true) {
                let item = stack.pop();
                if (item === "(") {
                    break;
                } else {
                    outString = outString + " " + item;
                }
            }
        } else if (candidate in PRIORITY) {
            while (true) {
                if (PRIORITY[candidate] <= PRIORITY[stack[stack.length - 1]]) {
                    let item = stack.pop();
                    outString = outString + " " + item;
                } else {
                    break;
                }
            }
            stack.push(candidate);
        }
    }
    // console.log(stack, outString)
    for (let i = 0; i < stack.length; i++) {
        outString = outString + " " + stack.pop();
    }
    if (stack.length === 1) {
        outString = outString + " " + stack[0];
    }
    return outString.split(" ");
}

function calculateRPN(arr) {
    let stackSteps = [];
    let commands = [];
    let i = 0;
    let j = 0;
    while (i < arr.length) {
        if (arr[i] in PRIORITY) {
            let operands = arr.slice(i - 2, i + 1);
            stackSteps.push(operands);
            commands.push({ id: `id${j}`, operands })
            arr.splice(i - 2, 3, commands[commands.length - 1].id);
            i = 0;
            j++;
        } else {
            i++;
        }
    }
    let tree = new Tree(`${commands[commands.length-1]?.operands[2]} ${commands[commands.length-1]?.id}`);
    for (let idx = commands.length - 1; idx > 0; idx--) {
        let item = commands[idx];
        for (let op = 0; op < item.operands.length - 1; op++) {
            if (item.operands[op].match(/id[0-9]+/g)) {
                let nextCommands = pickItemById(commands, item.operands[op]);
                tree.add(`${nextCommands.operands[2]} ${nextCommands.id}`, `${item.operands[2]} ${item.id}`, tree.bfs)
            } else {
                tree.add(`${item.operands[op]} ${item.id}`, `${item.operands[2]} ${item.id}`, tree.bfs);
            }
        }
    }
    return tree
}

function pickItemById(arr, id) {
    for (let item of arr) {
        if (item.id === id)
            return item;
    }
    return 0;
}

function toArrayElements(str) {
    str = str.replaceAll(/[ ]+/g, "");
    str = str.replaceAll(/([a-zA-Z0-9_]+)([\+\*\/\^\-\(\)])/g, " $1 $2 ");
    str = str.replaceAll(/([\+\*\/\^\-\(\)])([a-zA-Z0-9_]+)/g, " $1 $2 ");
    str = str.replaceAll(/([\+\*\/\^\-\(\)])([\+\*\/\^\-\(\)])/g, " $1 $2 ");
    str = str.replaceAll(/[ ]+/g, " ");
    str = str.trim();
    let arr = str.split(" ");
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim();
    }
    return arr;
}
export function makeTree(str = "x+ 4 * 2 / (1 - 5)^2") {
    // let arrRPN = rpn(toArrayElements(str));
    // return calculateRPN(arrRPN);
}

// let arrRPN = rpn(toArrayElements("x+ 4 * 2 / (1 - 5)^2"));
// console.log(arrRPN)
// let res = calculateRPN(arrRPN);
// console.log(res)