class Node {
    constructor(key, val, prev = null, next = null) {
        this.key = key;
        this.val = val;
        this.prev = prev;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = new Node(-1, -1);
        this.tail = new Node(-2, -2);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.length = 0;
    }
    validate(node) {
        if (node == undefined || !(node instanceof Node)) throw new Error('error');
    }
    addToHead(key, val) {
        let newNode = new Node(key, val, this.head, this.head.next);
        this.head.next.prev = newNode;
        this.head.next = newNode;
        this.length++;
        return newNode;
    }
    addNodeToHead(node) {
        this.validate(node);
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
        this.length++;
    }
    removeNode(node) {
        this.validate(node);
        const prev = node.prev, next = node.next;
        prev.next = next;
        next.prev = prev;
        this.length--;
    }
    /**
     * Remove a key from the linked list. 
     * This function has no effect if the key does not exist in the linked lsit.
     * @param {*} key 
     */
    removeKey(key) {
        p = this.head;
        while (p != null) {
            if (p.key = key) {
                this.removeNode(key);
            }
            p = p.next;
        }
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = {};
        this.list = new LinkedList();
    }
    get(key) {
        if (key in this.map) {
            const node = this.map[key];
            this.list.removeNode(node);
            this.list.addNodeToHead(node);
            return this.map[key].val;
        } else {
            return null;
        }
    }
    put(key, val) {
        if (key in this.map) {
            const node = this.map[key];
            this.list.removeNode(node);
            node.val = val;
            this.list.addNodeToHead(node);
        } else {
            if (this.list.length == this.capacity) {
                delete this.map[this.list.tail.prev.key];
                this.list.removeNode(this.list.tail.prev);
            }
            this.map[key] = this.list.addToHead(key, val);
        }
    }
    delete(key) {
        delete this.map[key];
        this.list.removeKey(key);
    }
}

module.exports = LRUCache;