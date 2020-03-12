"use strict";
/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Typescript Math Toolkit: Graph consisting of interconnections between TSMT$GraphNode<T> instances.
 *
 * @author Jim Armstrong (www.algorithmist.net), inspired by polygonal ds library
 *
 * @version 1.1 (Added DFS/BFS)
 */
var GraphNode_1 = require("./GraphNode");
var TSMT$Graph = /** @class */ (function () {
    /**
     * Construct a new TSMT$Graph<T>
     *
     * @returns nothing
     */
    function TSMT$Graph() {
        this.clear();
    }
    /**
     * Clear a graph
     */
    TSMT$Graph.prototype.clear = function () {
        this._struct = this._struct === undefined ? [] : this._struct;
        this._struct.length = 0;
        this._traversal = this._traversal === undefined ? [] : this._traversal;
        this._traversal.length = 0;
        var node = this._nodeList;
        var next;
        var arc;
        var nextArc;
        while (node != null) {
            next = node.next;
            arc = node.arcList;
            while (arc != null) {
                nextArc = arc.next;
                arc.next = arc.previous = null;
                arc.node = null;
                arc = nextArc;
            }
            node.value = null;
            node.next = node.previous = null;
            node.arcList = null;
            node = next;
        }
        this._nodeList = null;
        this._curNode = null;
        this._size = 0;
    };
    Object.defineProperty(TSMT$Graph.prototype, "size", {
        /**
         * Access the size or number of nodes in this graph
         *
         * @returns {number} Number of nodes in the graph
         */
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Graph.prototype, "isEmpty", {
        /**
         * Is the graph empty?
         *
         * @returns {boolean} True if the graph is empty (size is zero)
         */
        get: function () {
            return this._size == 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Graph.prototype, "nodeList", {
        /**
         * Access the list of nodes in this graph
         *
         * @returns {TSMT$GraphNode<T>} Head of doubly-linked node list for this graph
         */
        get: function () {
            return this._nodeList;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Find a node in this Graph
     *
     * @param value: T
     *
     * @returns {TSMT$GraphNode<T>} Reference to graph node having the specified value of null if no such node exists
     * in the Graph
     */
    TSMT$Graph.prototype.findNode = function (value) {
        var found = false;
        var node = this._nodeList;
        while (node != null) {
            if (node.value == value) {
                found = true;
                break;
            }
            node = node.next;
        }
        return found ? node : null;
    };
    /**
     * Add a node to this Graph
     *
     * @param node: TSMT$GraphNode<T> Reference to graph node to be added
     *
     * @returns nothing
     */
    TSMT$Graph.prototype.addNode = function (node) {
        if (node === undefined && node == null) {
            // nothing to do
            return;
        }
        this._size++;
        if (this._nodeList == null) {
            // begin new list
            this._nodeList = node;
            this._curNode = node;
        }
        else {
            node.previous = this._curNode;
            this._curNode.next = node;
            this._curNode = node;
        }
    };
    /**
     * Remove a node from this Graph
     *
     * @param node: TSMT$GraphNode<T> Direct reference of the node to be removed from the graph
     *
     * @returns nothing
     */
    TSMT$Graph.prototype.removeNode = function (node) {
        if (node === undefined || node == null) {
            // game over
            return;
        }
        this.__unlink(node);
        // update list after removal
        if (node.previous != null) {
            node.previous.next = node.next;
        }
        if (node.next != null) {
            node.next.previous = node.previous;
        }
        if (this._nodeList === node) {
            this._nodeList = node.next;
        }
        this._size--;
    };
    /**
     * Add a single edge (or arc) to this graph by specifying initial and terminal nodes
     *
     * @param source: TSMT$GraphNode<T> Source or initial node of the arc
     *
     * @param target: TSMT$GraphNode<T> Target or terminal node of the arc
     *
     * @param cost: number Numerical cost (zero or greater) associated with this arc
     *
     * @returns nothing The one-way arc is created and added to the graph
     */
    TSMT$Graph.prototype.addEdge = function (source, target, cost) {
        if (cost === void 0) { cost = 1.0; }
        var walk = this._nodeList;
        // clip for now
        cost = Math.max(0.0, cost);
        while (walk != null) {
            if (walk === source) {
                var sourceNode = walk;
                walk = this._nodeList;
                while (walk != null) {
                    if (walk === target) {
                        sourceNode.addArc(walk, cost);
                        break;
                    }
                    walk = walk.next;
                }
                break;
            }
            walk = walk.next;
        }
    };
    /**
     * Add a mutually connected edge (or arc) to this graph by specifying initial and terminal nodes
     *
     * @param source: TSMT$GraphNode<T> Source or initial node of the arc
     *
     * @param target: TSMT$GraphNode<T> Target or terminal node of the arc
     *
     * @param cost: number Numerical cost (zero or greater) associated with this arc
     *
     * @returns nothing The two-way arc is created and added to the graph
     */
    TSMT$Graph.prototype.addMutualEdge = function (source, target, cost) {
        if (cost === void 0) { cost = 1.0; }
        var walk = this._nodeList;
        while (walk != null) {
            if (walk === source) {
                var sourceNode = walk;
                walk = this._nodeList;
                while (walk != null) {
                    if (walk == target) {
                        sourceNode.addArc(walk, cost);
                        walk.addArc(sourceNode, cost);
                        break;
                    }
                    walk = walk.next;
                }
                break;
            }
            walk = walk.next;
        }
    };
    /**
     * Clear all marks associated with nodes in this graph
     *
     * @returns Nothing All nodes in the graph are marked as not having been traversed or visited
     */
    TSMT$Graph.prototype.clearMarks = function () {
        var node = this._nodeList;
        while (node != null) {
            node.marked = false;
            node = node.next;
        }
    };
    /**
     * Clear the parent reference of all nodes in this graph
     *
     * @returns Nothing All nodes in the graph have a null parent reference
     */
    TSMT$Graph.prototype.clearParent = function () {
        var node = this._nodeList;
        while (node != null) {
            node.parent = null;
            node = node.next;
        }
    };
    /**
     * Does this graph contain a node with the specified value?
     *
     * @param x: T Test value
     *
     * @returns {boolean} True if the graph contains a node with exactly the specified value
     */
    TSMT$Graph.prototype.contains = function (x) {
        var node = this._nodeList;
        while (node != null) {
            if (node.value === x) {
                // value found
                return true;
            }
            node = node.next;
        }
        return false;
    };
    /**
     * Remove the node from the graph with the specified value
     *
     * @param {T} x Node value
     *
     * @returns {boolean} True if a node with the specified value is found and removed from the graph
     */
    TSMT$Graph.prototype.remove = function (x) {
        var found = false;
        var node = this._nodeList;
        var next;
        while (node != null) {
            next = node.next;
            if (node.value == x) {
                this.__unlink(node);
                node.value = null;
                node.next = null;
                node.previous = null;
                node.arcList = null;
                found = true;
                this._size--;
            }
            node = next;
        }
        return found;
    };
    /**
     * Convert the node list to an Array
     */
    TSMT$Graph.prototype.toArray = function () {
        var a = new Array();
        var node = this._nodeList;
        while (node != null) {
            a.push(node);
            node = node.next;
        }
        return a;
    };
    TSMT$Graph.prototype.__unlink = function (node) {
        var arc0 = node.arcList;
        while (arc0 != null) {
            var node1 = arc0.node;
            var arc1 = node1.arcList;
            var hook = void 0;
            while (arc1 != null) {
                hook = arc1.next;
                if (arc1.node == node) {
                    if (arc1.previous != null) {
                        arc1.previous.next = hook;
                    }
                    if (hook != null) {
                        hook.previous = arc1.previous;
                    }
                    if (node1.arcList == arc1) {
                        node1.arcList = hook;
                    }
                }
                arc1 = hook;
            }
            hook = arc0.next;
            if (arc0.previous != null) {
                arc0.previous.next = hook;
            }
            if (hook != null) {
                hook.previous = arc0.previous;
            }
            if (node.arcList == arc0) {
                node.arcList = hook;
            }
            arc0 = hook;
        }
        node.arcList = null;
    };
    /**
     * Perform a depth-first search of an undirected graph, starting at the supplied node and only traversing nodes that
     * can be reached from that node.  Return the results in an Array of {TSMT$GraphNode<T>>} instances.  Edge costs are
     * not currently considered.
     *
     * @param startNode Can be a reference to a starting node or a node with the specified value (a search is performed
     * for the start node in the latter case)
     */
    TSMT$Graph.prototype.DFS = function (startNode) {
        if (startNode === void 0) { startNode = null; }
        // outliers
        if (this.size === 0) {
            return [];
        }
        if (this.size === 1) {
            return [this._nodeList];
        }
        this._struct.length = 0;
        this._traversal.length = 0;
        var node;
        var rootNode;
        if (startNode === undefined || startNode == null) {
            node = this._nodeList;
        }
        else if (startNode instanceof GraphNode_1.TSMT$GraphNode) {
            node = startNode;
        }
        else {
            node = this.findNode(startNode);
        }
        rootNode = node;
        if (rootNode == null) {
            return [];
        }
        while (node != null) {
            node.marked = false;
            node = node.next;
        }
        // can be done pretty easily recursively; non-recursive version uses a stack as a supporting data structure
        this.__DFSTraversal(rootNode);
        return this._traversal;
    };
    TSMT$Graph.prototype.__DFSTraversal = function (node) {
        node.marked = true;
        this._traversal.push(node);
        var arc = node.arcList;
        while (arc != null) {
            node = arc.node;
            if (!node.marked) {
                this.__DFSTraversal(node);
            }
            arc = arc.next;
        }
    };
    /**
     * Perform a breadth-first search of an undirected graph, starting at the supplied node and only traversing nodes that
     * can be reached from that node.  Return the results in an Array of {TSMT$GraphNode<T>>} instances.  Edge costs are
     * not currently considered.
     *
     * @param startNode Can be a reference to a starting node or a node with the specified value (a search is performed
     * for the start node in the latter case)
     */
    TSMT$Graph.prototype.BFS = function (startNode) {
        // TODO make this more DRY
        if (startNode === void 0) { startNode = null; }
        // outliers
        if (this.size === 0) {
            return [];
        }
        if (this.size === 1) {
            return [this._nodeList];
        }
        this._struct.length = 0;
        this._traversal.length = 0;
        var node;
        var rootNode;
        if (startNode === undefined || startNode == null) {
            node = this._nodeList;
        }
        else if (startNode instanceof GraphNode_1.TSMT$GraphNode) {
            node = startNode;
        }
        else {
            node = this.findNode(startNode);
        }
        rootNode = node;
        if (rootNode == null) {
            return [];
        }
        while (node != null) {
            node.marked = false;
            node = node.next;
        }
        this.__BFSTraversal(rootNode);
        return this._traversal;
    };
    TSMT$Graph.prototype.__BFSTraversal = function (node) {
        // Traversal uses a queue (implemented as an Array).  Queue is FIFO, so enqueue is push, dequeue is shift.
        node.marked = true;
        this._struct.push(node);
        var arc;
        while (this._struct.length > 0) {
            node = this._struct.shift();
            this._traversal.push(node);
            arc = node.arcList;
            while (arc != null) {
                node = arc.node;
                if (!node.marked) {
                    node.marked = true;
                    this._struct.push(node);
                }
                arc = arc.next;
            }
        }
    };
    return TSMT$Graph;
}());
exports.TSMT$Graph = TSMT$Graph;
