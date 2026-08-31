/**
 * Generic Queue implementation (FIFO - First In, First Out)
 */
export class Queue<T> {
  private items: T[] = [];

  /**
   * Add an element to the end of the queue
   * @param item - The item to add to the queue
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Remove and return the element from the front of the queue
   * @returns The item at the front of the queue or null if empty
   */
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift() ?? null;
  }

  /**
   * Return the element at the front of the queue without removing it
   * @returns The item at the front of the queue or null if empty
   */
  peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0] ?? null;
  }

  /**
   * Check if the queue is empty
   * @returns true if the queue is empty, false otherwise
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Get the number of elements in the queue
   * @returns The number of elements in the queue
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Clear all elements from the queue
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Get a copy of the queue elements as an array
   * @returns Array copy of the queue elements
   */
  toArray(): T[] {
    return [...this.items];
  }
}
