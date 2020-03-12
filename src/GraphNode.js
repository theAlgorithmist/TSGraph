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
 * Typescript Math Toolkit: Graph Node.  A default node has an id of zero and null value.  ID is typically assigned
 * post-construction and is expected to be zero or greater.  Nodes are part of a doubly-linked list and expose 'previous'
 * and 'next' pointers.  This node may be the head of a doubly-linked list of graph arcs, which is accessible through
 * a class accessor.  TSMT Graph Nodes and Arcs are constituents of a general graph.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var GraphArc_1 = require("./GraphArc");
var TSMT$GraphNode = /** @class */ (function () {
    /**
     * Construct a new GraphNode
     *
     * @param data: T Optional data associated with this node
     *
     * @returns nothing Constructs a new TSMT$GraphNode<T> instance
     */
    function TSMT$GraphNode(data) {
        this.clear();
        this._val = data !== undefined ? data : null;
    }
    /**
     * Clear this graph node and prepare for new data
     *
     * @returns nothing The node is completely clear
     */
    TSMT$GraphNode.prototype.clear = function () {
        this._id = 0;
        this._val = null;
        this._prev = null;
        this._next = null;
        this._marked = false;
        this._parent = null;
        this._depth = 0;
        this._curArc = null;
        this._arcList = null;
    };
    Object.defineProperty(TSMT$GraphNode.prototype, "id", {
        /**
         * Access the id of this graph node
         *
         * @returns {string | number} Node ID
         */
        get: function () {
            return this._id;
        },
        /**
         * Assign an ID to this graph node
         *
         * @param value Node ID (zero or greater)
         *
         * @returns nothing The new node id is assigned as long as it is a valid input
         */
        set: function (value) {
            if (typeof value === 'string') {
                this._id = value;
            }
            else {
                var nodeID = +value;
                this._id = !isNaN(nodeID) && isFinite(nodeID) && value >= 0 ? value : this._id;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "marked", {
        /**
         * Has this node been marked in a graph traversal?
         *
         * @returns {boolean} True if this node has been marked as traversed
         */
        get: function () {
            return this._marked;
        },
        /**
         * Assign that this node was marked during traversal
         *
         * @param value True if this node is marked as traversed
         */
        set: function (value) {
            this._marked = value === true ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "value", {
        /**
         * Access this node's value
         *
         * @returns {T} Node value
         */
        get: function () {
            return this._val;
        },
        /**
         * Assign this graph node's value
         *
         * @param v: T New node value
         *
         * @returns nothing New node value is assigned provided it is non-null
         */
        set: function (v) {
            this._val = v !== undefined && v != null ? v : this._val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "previous", {
        /**
         * Access previous node in list
         *
         * @returns {TSMT$GraphNode<T>} Reference to previous TSMT$GraphNode<T> in doubly-linked node list
         */
        get: function () {
            return this._prev;
        },
        /**
         * Assign previous node in list
         *
         * @param node: TSMT$GraphNode<T> Reference to previous node in doubly-linked node list
         */
        set: function (node) {
            this._prev = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._prev;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "next", {
        /**
         * Access the next node in list
         *
         * @returns {TSMT$GraphNode<T>} Reference to next TSMT$GraphNode<T> in doubly-linked node list
         */
        get: function () {
            return this._next;
        },
        /**
         * Assign next node in list
         *
         * @param node: TMST$GraphNode<T> Reference to next node in doubly-linked node list
         *
         * @returns nothing
         */
        set: function (node) {
            this._next = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "parent", {
        /**
         * Access this node's parent
         *
         * @returns {TSMT$GraphNode<T>} Reference to this node's parent
         */
        get: function () {
            return this._parent;
        },
        /**
         * Assign a parent reference
         *
         * @param node: TSMT$GraphNode<T> Node assigned as a parent node during an organized graph traversal
         */
        set: function (node) {
            this._parent = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "depth", {
        /**
         * Access current traversal depth
         *
         * @returns {number} Traversal depth or distance from first-traversed node
         */
        get: function () {
            return this._depth;
        },
        /**
         * Assign traversal depth
         *
         * @param value: number Traversal depth (zero or greater)
         *
         * @returns nothing
         */
        set: function (value) {
            this._depth = !isNaN(value) && isFinite(value) && value >= 0 ? value : this._depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "arcList", {
        /**
         * Access the arc list for this node
         *
         * @returns {TSMT$GraphArc<T>} Head of doubly-linked list of arcs for which this node is a head
         */
        get: function () {
            return this._arcList;
        },
        /**
         * Assign a new head pointer for the arc list from this node
         *
         * @param value: TSMT$GraphArc<T> New head arc in doubly-linked arc list
         *
         * @returns nothing
         */
        set: function (value) {
            this._arcList = value !== undefined && value != null && value instanceof GraphArc_1.TSMT$GraphArc ? value : this._arcList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphNode.prototype, "arcCount", {
        /**
         * Access the number of arcs emanating from this node
         *
         * @returns {number} Arc count or number of arcs emanating from this node
         */
        get: function () {
            var count = 0;
            var arc = this._arcList;
            while (arc != null) {
                count++;
                arc = arc.next;
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Access if this node is connected to a specified node
     *
     * @param target: TSMT$GraphNode<T> Target node to check one-way connectivity
     *
     * @returns {boolean} True if there is a defined arc from this node to the specified target node
     */
    TSMT$GraphNode.prototype.connected = function (target) {
        return target !== undefined && target != null && target instanceof TSMT$GraphNode ? this.getArc(target) != null : false;
    };
    /**
     * Is there a mutual connection from this node to and from the specified node?
     *
     * @param target: TSMT$GraphNode<T> Target node to check mututal connectivity
     *
     * @returns {boolean} True if there is an arc from this node to the target node AND from the target node to this node
     */
    TSMT$GraphNode.prototype.mutuallyConnected = function (target) {
        if (target !== undefined && target != null && target instanceof TSMT$GraphNode) {
            // check mutual connection
            return this.getArc(target) != null && target.getArc(this) != null;
        }
        else {
            return false;
        }
    };
    /**
     * Access the arc from this node to the specified target
     *
     * @param target: TSMT$GraphNode<T> Target node to check for one-way connectivity
     *
     * @returns {TSMT$GraphArc<T>} Direct reference to the graph arc from this node to the specified target node
     */
    TSMT$GraphNode.prototype.getArc = function (target) {
        if (target === undefined || target == null) {
            // game over
            return null;
        }
        var found = false;
        var a = this._arcList;
        while (a != null) {
            if (a.node == target) {
                found = true;
                break;
            }
            a = a.next;
        }
        return found ? a : null;
    };
    /**
     * Add a graph arc from this node to the specified node
     *
     * @param target: TSMT$GraphNode<T> Terminal node of arc
     *
     * @param cost: number Numerical cost associated with this arc (negative values are not currently allowed)
     */
    TSMT$GraphNode.prototype.addArc = function (target, cost) {
        if (cost === void 0) { cost = 1.0; }
        if (target !== undefined && target != null) {
            // clip for now
            cost = Math.max(0.0, cost);
            var arc = new GraphArc_1.TSMT$GraphArc(target, cost);
            if (this._arcList == null) {
                // begin new list
                this._arcList = arc;
                this._curArc = arc;
            }
            else {
                arc.previous = this._curArc;
                this._curArc.next = arc;
                this._curArc = arc;
            }
        }
    };
    /**
     * Remove an arc from the set of arcs emanating from this node
     *
     * @param target: TSMT$GraphNode<T> Terminal node of the arc to remove
     *
     * @returns {boolean} True if the arc was found and removed
     */
    TSMT$GraphNode.prototype.removeArc = function (target) {
        if (target !== undefined && target != null) {
            var arc = this.getArc(target);
            if (arc != null) {
                if (arc.previous != null) {
                    // update prev.next after removal
                    arc.previous.next = arc.next;
                }
                if (arc.next != null) {
                    // update next.prev after removal
                    arc.next.previous = arc.previous;
                }
                if (this._arcList == arc) {
                    // update arcList ref after removal
                    this._arcList = arc.next;
                }
                return true;
            }
            return false;
        }
        else {
            // nothing to remove
            return false;
        }
    };
    /**
     * Remove all outgoing arcs from this node
     *
     * @returns nothing
     */
    TSMT$GraphNode.prototype.removeOutgoingArcs = function () {
        var arc = this._arcList;
        while (arc != null) {
            this.removeArc(arc.node);
            arc = arc.next;
        }
    };
    /**
     * Remove all outgoing and incoming arcs from this node
     *
     * @return nothing
     */
    TSMT$GraphNode.prototype.removeAllArcs = function () {
        var arc = this._arcList;
        while (arc != null) {
            arc.node.removeArc(this);
            this.removeArc(arc.node);
            arc = arc.next;
        }
        this._arcList = null;
    };
    return TSMT$GraphNode;
}());
exports.TSMT$GraphNode = TSMT$GraphNode;
