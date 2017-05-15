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
var TSMT$Graph = (function () {
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
     * Add a single arc to this graph by specifying initial and terminal nodes
     *
     * @param source: TSMT$GraphNode<T> Source or initial node of the arc
     *
     * @param target: TSMT$GraphNode<T> Target or terminal node of the arc
     *
     * @param cost: number Numerical cost (zero or greater) associated with this arc
     *
     * @returns nothing The one-way arc is created and added to the graph
     */
    TSMT$Graph.prototype.addSingleArc = function (source, target, cost) {
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
     * Add a mutually connected arc to this graph by specifying initial and terminal nodes
     *
     * @param source: TSMT$GraphNode<T> Source or initial node of the arc
     *
     * @param target: TSMT$GraphNode<T> Target or terminal node of the arc
     *
     * @param cost: number Numerical cost (zero or greater) associated with this arc
     *
     * @returns nothing The two-way arc is created and added to the graph
     */
    TSMT$Graph.prototype.addMutualArc = function (source, target, cost) {
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
     * @returns Nothing All nodes in the graph are marked as not having been traversed
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
     * @returns {boolean} True if the graph contains a node with the specified value
     */
    TSMT$Graph.prototype.contains = function (x) {
        var node = this._nodeList;
        while (node != null) {
            if (node.value == x) {
                // value found
                return true;
            }
            node = node.next;
        }
        return false;
    };
    /**
     * Remove the node frmo the graph with the specified value
     *
     * @param x: T Node value
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
    return TSMT$Graph;
}());
exports.TSMT$Graph = TSMT$Graph;
