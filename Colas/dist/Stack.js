"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
/**
 * Generic Stack implementation (LIFO - Last In, First Out)
 */
class Stack {
    constructor() {
        this.items = [];
    }
    /**
     * Add an element to the top of the stack
     * @param item - The item to add to the stack
     */
    push(item) {
        this.items.push(item);
    }
    /**
     * Remove and return the element from the top of the stack
     * @returns The item at the top of the stack or null if empty
     */
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop() ?? null;
    }
    /**
     * Return the element at the top of the stack without removing it
     * @returns The item at the top of the stack or null if empty
     */
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1] ?? null;
    }
    /**
     * Check if the stack is empty
     * @returns true if the stack is empty, false otherwise
     */
    isEmpty() {
        return this.items.length === 0;
    }
    /**
     * Get the number of elements in the stack
     * @returns The number of elements in the stack
     */
    size() {
        return this.items.length;
    }
    /**
     * Clear all elements from the stack
     */
    clear() {
        this.items = [];
    }
    /**
     * Get a copy of the stack elements as an array (top to bottom)
     * @returns Array copy of the stack elements
     */
    toArray() {
        return [...this.items];
    }
}
exports.Stack = Stack;
