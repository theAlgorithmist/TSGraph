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
var GraphNode_1 = require("./GraphNode");
/**
 * Typescript Math Toolkit: Graph Arc.  An arc or edge is defined by a terminating node and a numerical cost,
 * which is zero by default.  This is largely a convenience class for TSMT$Graph<T>.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var TSMT$GraphArc = /** @class */ (function () {
    /**
     *
     * Construct a graph arc
     *
     * @param node : GraphNode - Reference to Graph Node that is the terminator for this arc
     *
     * @param cost : Number - Numerical cost of this arc
     * @default 0
     *
     * @return Nothing
     *
     */
    function TSMT$GraphArc(node, cost) {
        if (cost === void 0) { cost = 0.0; }
        this._node = node !== undefined ? node : null;
        this._cost = cost;
        this._next = null;
        this._prev = null;
    }
    /**
     * Clear the current node and prepare for new data
     *
     * @return Nothing
     */
    TSMT$GraphArc.prototype.clear = function () {
        this._node = null;
        this._next = null;
        this._prev = null;
        this._cost = 0.0;
    };
    Object.defineProperty(TSMT$GraphArc.prototype, "nodeValue", {
        /**
         * Access internal node's value
         *
         * @return number : Node value
         */
        get: function () {
            return this._node ? this._node.value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphArc.prototype, "cost", {
        /**
         * Access this arc's cost
         *
         * @returns {number} Arc cost
         */
        get: function () {
            return this._cost;
        },
        /**
         * Assign a new cost to this arc
         *
         * @param value: number Graph cost (zero or greater)
         *
         * @returns nothing
         */
        set: function (value) {
            this._cost = !isNaN(value) && isFinite(value) && value >= 0 ? value : this._cost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphArc.prototype, "previous", {
        /**
         * Access the previous arc in a doubly-linked list of arcs
         *
         * @returns {TSMT$GraphArc<T>} Direct reference to previous arc
         */
        get: function () {
            return this._prev;
        },
        /**
         * Assign the previous arc reference
         *
         * @param arc: TSMT$GraphArc<T> Reference to previous arc in doubly-linked arc list
         *
         * @returns nothing
         */
        set: function (arc) {
            this._prev = arc !== undefined && arc != null ? arc : this._prev;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphArc.prototype, "next", {
        /**
         * Access the next arc in a doubly-linked list of arcs
         *
         * @returns {TSMT$GraphArc<T>} Direct reference to next arc in doubly-linked arc list
         */
        get: function () {
            return this._next;
        },
        /**
         * Assign the next arc reference
         *
         * @param arc: TSMT$GraphArc<T> Reference to next arc in doubly-linked arc list
         */
        set: function (arc) {
            this._next = arc !== undefined && arc != null ? arc : this._next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$GraphArc.prototype, "node", {
        /**
         * Access the terminal node associated with this arc
         *
         * @returns TSMT$GraphNode<T> Direct reference to terminal node
         */
        get: function () {
            return this._node;
        },
        /**
         * Assign a new terminal node
         *
         * @param value: TSMT$GraphNode<T> New terminating node for this arc
         */
        set: function (value) {
            this._node = value !== undefined && value != null && value instanceof GraphNode_1.TSMT$GraphNode ? value : this._node;
        },
        enumerable: true,
        configurable: true
    });
    return TSMT$GraphArc;
}());
exports.TSMT$GraphArc = TSMT$GraphArc;
