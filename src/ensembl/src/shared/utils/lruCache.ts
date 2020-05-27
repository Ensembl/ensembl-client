/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This is a cache implementing the Least Recently Used algorithm
 * for preventing it from growing indefinitely. It also can invalidate
 * individual items based on the max time during which an item is allowed
 * to be retrieved from the cache.
 *
 * The Least Recently Used algorithm requires coordinated use of a doubly linked list
 * for storing cached values, and a map for quick access to the nodes of the list
 */

interface LRUCacheInterface {
  get(key: string): any;
  set(key: string, value: any): void;
  reset(): void;
}

interface LinkedListNodeInterface {
  value: any;
  next: LinkedListNode | null;
  previous: LinkedListNode | null;
  timestamp: number;
}

type LRUCacheOptions = {
  size?: number; // max number of items that can be stored in cache; defaults to 1000
  maxAge?: number; // time period, in milliseconds, during which a cache item is retrievable
};

type LinkedListNodeOptions = {
  key: string;
  value: any;
  timestamp: number;
};

const DEFAULT_SIZE = 1000;

export default class LRUCache implements LRUCacheInterface {
  private size: number;
  private maxAge?: number;
  private currentSize = 0;
  private head: LinkedListNode | null;
  private tail: LinkedListNode | null;
  private listNodesMap: Map<string, LinkedListNode>;

  constructor(options: LRUCacheOptions = {}) {
    if (options.size && options.size <= 0) {
      throw new Error('Cache size must be a positive integer');
    }
    this.size = options.size || DEFAULT_SIZE;
    this.maxAge = options.maxAge;

    this.head = null;
    this.tail = null;
    this.listNodesMap = new Map();
  }

  public get(key: string) {
    const cachedNode = this.listNodesMap.get(key);
    if (cachedNode) {
      if (this.isExpiredNode(cachedNode)) {
        this.removeNode(cachedNode);
        return;
      }
      this.moveNodeToHead(cachedNode);
      cachedNode.timestamp = Date.now();
      return cachedNode.value;
    }
  }

  public set(key: string, value: any) {
    const savedNode = this.listNodesMap.get(key);
    if (savedNode) {
      this.moveNodeToHead(savedNode);
      savedNode.value = value;
    } else {
      this.addNode(key, value);
    }
  }

  public reset() {
    this.head = null;
    this.tail = null;
    this.currentSize = 0;
    this.listNodesMap.clear();
  }

  private isExpiredNode(node: LinkedListNode) {
    if (!this.maxAge) {
      return false;
    }
    return Date.now() - node.timestamp > this.maxAge;
  }

  private moveNodeToHead(node: LinkedListNode) {
    const previousNode = node.previous;
    const nextNode = node.next;
    if (previousNode) {
      previousNode.next = nextNode;
    }
    if (nextNode) {
      nextNode.previous = previousNode;
    }
    if (this.tail === node) {
      this.tail = previousNode;
    }
    const formerHeadNode = this.head as LinkedListNode;
    this.head = node;
    node.next = formerHeadNode;
    node.previous = null;
    formerHeadNode.previous = node;
    node.timestamp = Date.now(); // refresh timestamp
  }

  private addNode(key: string, value: any) {
    const newNode = new LinkedListNode({
      key,
      value,
      timestamp: Date.now()
    });
    if (this.currentSize === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.currentSize === this.size) {
      const newTail = (this.tail as LinkedListNode).previous as LinkedListNode;
      this.removeNode(this.tail as LinkedListNode);
      this.tail = newTail;

      this.moveNodeToHead(newNode);
    } else {
      this.moveNodeToHead(newNode);
    }
    this.listNodesMap.set(key, newNode);
    this.currentSize++;
  }

  private removeNode(node: LinkedListNode) {
    const { previous, next, key } = node;
    node.previous = null;
    node.next = null;
    node.value = null;
    previous && (previous.next = next);
    next && (next.previous = previous);
    this.listNodesMap.delete(key);

    this.currentSize--;
  }
}

class LinkedListNode implements LinkedListNodeInterface {
  public timestamp: number;
  public next: LinkedListNode | null = null;
  public previous: LinkedListNode | null = null;
  public key: string;
  public value: any;

  constructor(options: LinkedListNodeOptions) {
    this.key = options.key;
    this.value = options.value;
    this.timestamp = options.timestamp;
  }
}
