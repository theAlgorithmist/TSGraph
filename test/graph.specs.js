"use strict";
/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
// Specs for various alpha release of TSMT Graph
var GraphNode_1 = require("../src/GraphNode");
var GraphArc_1 = require("../src/GraphArc");
var Graph_1 = require("../src/Graph");
var Chai = require("chai");
var expect = Chai.expect;
// Test Suites
describe('TSMT Graph Node', function () {
    it('newly constructed Node has and id of zero', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        expect(node.id).to.equal(0);
    });
    it('Node with empty constructor has null data', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        expect(node.value).to.be.null;
    });
    it('Node accepts optional data on construction', function () {
        var node = new GraphNode_1.TSMT$GraphNode(1.0);
        expect(node.value).to.equal(1.0);
    });
    it('Node can only be marked with a boolean', function () {
        var node = new GraphNode_1.TSMT$GraphNode(1.0);
        var value = 'true';
        node.marked = value;
        expect(node.marked).to.be.false;
        node.marked = true;
        expect(node.marked).to.be.true;
    });
    it('Node can accept a value post-construction', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        expect(node.value).to.be.null;
        node.value = -2.0;
        expect(node.value).to.equal(-2);
    });
    it('Node properly accepts and returns an id', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        expect(node.id).to.equal(0);
        node.id = -1;
        expect(node.id).to.equal(0);
        node.id = 1;
        expect(node.id).to.equal(1);
    });
    it('Node propertly accepts and sets previous/next references', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        var node1 = new GraphNode_1.TSMT$GraphNode();
        var node2 = new GraphNode_1.TSMT$GraphNode();
        expect(node.previous).to.be.null;
        expect(node.next).to.be.null;
        var junk = null;
        node.previous = node1;
        node.next = node2;
        node.previous = junk;
        node.next = junk;
        expect(node.previous === node1).to.be.true;
        expect(node.next == node2).to.be.true;
    });
    it('Newly constructed node has zero arc count', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        expect(node.arcCount).to.equal(0);
    });
    it('Newly constructed node is not connected to any other node', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        var node1 = new GraphNode_1.TSMT$GraphNode();
        expect(node.connected(node1)).to.be.false;
        expect(node.mutuallyConnected(node1)).to.be.false;
    });
});
describe('TSMT Graph Arc', function () {
    it('newly constructed Arc has default zero cost', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        var arc = new GraphArc_1.TSMT$GraphArc(node);
        expect(arc.cost).to.equal(0);
    });
    it('node accessor returns proper reference', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        var arc = new GraphArc_1.TSMT$GraphArc(node);
        expect(arc.node === node).to.be.true;
    });
    it('previous and next references are null by default', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        var arc = new GraphArc_1.TSMT$GraphArc(node);
        expect(arc.previous).to.be.null;
        expect(arc.next).to.be.null;
    });
    it('arc accepts proper cost pre- and post-construction', function () {
        var node = new GraphNode_1.TSMT$GraphNode();
        var arc = new GraphArc_1.TSMT$GraphArc(node);
        arc.cost = -1;
        expect(arc.cost).to.equal(0);
        arc.cost = 10.0;
        expect(arc.cost).to.equal(10);
        var arc1 = new GraphArc_1.TSMT$GraphArc(node, 2.0);
        expect(arc1.cost).to.equal(2);
    });
    it('arc accepts proper previous and next arc references', function () {
        var node = new GraphNode_1.TSMT$GraphNode(1);
        var arc = new GraphArc_1.TSMT$GraphArc(node);
        var node0 = new GraphNode_1.TSMT$GraphNode(0);
        var node2 = new GraphNode_1.TSMT$GraphNode(2);
        var arc0 = new GraphArc_1.TSMT$GraphArc(node0, 1.0);
        var arc2 = new GraphArc_1.TSMT$GraphArc(node2, 2.0);
        arc.previous = arc0;
        arc.next = arc2;
        arc.previous = null;
        arc.next = null;
        expect(arc.previous === arc0).to.be.true;
        expect(arc.next === arc2).to.be.true;
    });
});
describe('Node and Arc Tests', function () {
    it('correctly adds a singleton arc', function () {
        var root = new GraphNode_1.TSMT$GraphNode(1);
        var node = new GraphNode_1.TSMT$GraphNode(2);
        root.addArc(node, 2.0);
        expect(root.arcCount).to.equal(1);
        var list = root.arcList;
        expect(list.node.value).to.equal(2);
    });
    it('correctly adds and removes multiple arcs', function () {
        var root = new GraphNode_1.TSMT$GraphNode(1);
        var node = new GraphNode_1.TSMT$GraphNode(2);
        var node1 = new GraphNode_1.TSMT$GraphNode(3);
        var node2 = new GraphNode_1.TSMT$GraphNode(4);
        root.addArc(node, 2.0);
        root.addArc(node1, 3.0);
        root.addArc(node2, 4.0);
        expect(root.arcCount).to.equal(3);
        var arc = root.arcList;
        expect(arc.node.value).to.equal(2);
        arc = arc.next;
        expect(arc.node.value).to.equal(3);
        arc = arc.next;
        expect(arc.node.value).to.equal(4);
        root.removeAllArcs();
        expect(root.arcCount).to.equal(0);
        expect(root.arcList).to.be.null;
    });
    it('correctly removes a single arcs', function () {
        var root = new GraphNode_1.TSMT$GraphNode(1);
        var node = new GraphNode_1.TSMT$GraphNode(2);
        var node1 = new GraphNode_1.TSMT$GraphNode(3);
        var node2 = new GraphNode_1.TSMT$GraphNode(4);
        var node3 = new GraphNode_1.TSMT$GraphNode(5);
        root.addArc(node, 2.0);
        root.addArc(node1, 3.0);
        root.addArc(node2, 4.0);
        var result = root.removeArc(node3);
        expect(result).to.be.false;
        expect(root.arcCount).to.equal(3);
        result = root.removeArc(node1);
        expect(result).to.be.true;
        expect(root.arcCount).to.equal(2);
        var arc = root.arcList;
        expect(arc.node.value).to.equal(2);
        arc = arc.next;
        expect(arc.node.value).to.equal(4);
    });
    it('correctly identifies connectivity', function () {
        var root = new GraphNode_1.TSMT$GraphNode(1);
        var node = new GraphNode_1.TSMT$GraphNode(2);
        var node1 = new GraphNode_1.TSMT$GraphNode(3);
        var node2 = new GraphNode_1.TSMT$GraphNode(4);
        var node3 = new GraphNode_1.TSMT$GraphNode(5);
        root.addArc(node, 2.0);
        node1.addArc(node2, 3.0);
        node1.addArc(node3, 1.0);
        node3.addArc(node1, 1.0);
        var result = root.connected(node);
        expect(result).to.be.true;
        result = root.connected(node3);
        expect(result).to.be.false;
        result = node1.mutuallyConnected(node3);
        expect(result).to.be.true;
    });
});
describe('Graph Tests', function () {
    it('Newly constructed graph has zero size and is empty', function () {
        var graph = new Graph_1.TSMT$Graph();
        expect(graph.size).to.equal(0);
        expect(graph.isEmpty).to.be.true;
    });
    it('Graph correctly adds nodes', function () {
        var graph = new Graph_1.TSMT$Graph();
        var node = new GraphNode_1.TSMT$GraphNode(1);
        var node1 = new GraphNode_1.TSMT$GraphNode(2);
        var node2 = new GraphNode_1.TSMT$GraphNode(3);
        graph.addNode(node);
        graph.addNode(node1);
        graph.addNode(node2);
        expect(graph.size).to.equal(3);
        expect(graph.isEmpty).to.be.false;
        var root = graph.nodeList;
        expect(root.value).to.equal(1);
        node = root.next;
        expect(node.value).to.equal(2);
        node = node.next;
        expect(node.value).to.equal(3);
        node = node.previous;
        expect(node.value).to.equal(2);
        node = node.previous;
        expect(node.value).to.equal(1);
        node = node.previous;
        expect(node).to.be.null;
    });
    it('Graph correctly removes a node', function () {
        var graph = new Graph_1.TSMT$Graph();
        var node = new GraphNode_1.TSMT$GraphNode(1);
        var node1 = new GraphNode_1.TSMT$GraphNode(2);
        var node2 = new GraphNode_1.TSMT$GraphNode(3);
        var node3 = new GraphNode_1.TSMT$GraphNode(4);
        graph.addNode(node);
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        expect(graph.size).to.equal(4);
        graph.removeNode(node2);
        var root = graph.nodeList;
        expect(root.value).to.equal(1);
        node = root.next;
        expect(node.value).to.equal(2);
        node = node.next;
        expect(node.value).to.equal(4);
        node = node.previous;
        expect(node.value).to.equal(2);
        node = node.previous;
        expect(node.value).to.equal(1);
        node = node.previous;
        expect(node).to.be.null;
    });
    it('Graph correctly finds a node', function () {
        var graph = new Graph_1.TSMT$Graph();
        var node = new GraphNode_1.TSMT$GraphNode(1);
        var node1 = new GraphNode_1.TSMT$GraphNode(2);
        var node2 = new GraphNode_1.TSMT$GraphNode(3);
        var node3 = new GraphNode_1.TSMT$GraphNode(4);
        graph.addNode(node);
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        expect(graph.size).to.equal(4);
        var found = graph.findNode(2);
        expect(found === node1).to.be.true;
        found = graph.findNode(5);
        expect(found).to.be.null;
    });
    it('Graph correctly builds graph from single arcs', function () {
        var graph = new Graph_1.TSMT$Graph();
        // build the following graph
        // {1, 4}, {1, 5}, {1, 6}, {2, 5}, {2, 6}, {3, 6}, {4, 1}, {5, 1}, {5, 2}, {6, 1}, {6, 2}, {6, 3}
        var node1 = new GraphNode_1.TSMT$GraphNode(1);
        var node2 = new GraphNode_1.TSMT$GraphNode(2);
        var node3 = new GraphNode_1.TSMT$GraphNode(3);
        var node4 = new GraphNode_1.TSMT$GraphNode(4);
        var node5 = new GraphNode_1.TSMT$GraphNode(5);
        var node6 = new GraphNode_1.TSMT$GraphNode(6);
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        graph.addNode(node4);
        graph.addNode(node5);
        graph.addNode(node6);
        expect(graph.size).to.equal(6);
        graph.addSingleArc(node1, node4, 1.0); // 1-4
        graph.addSingleArc(node1, node5, 0.75); // 1-5
        graph.addSingleArc(node1, node6, 1.2); // 1-6
        graph.addSingleArc(node2, node5, 0.5); // 2-5
        graph.addSingleArc(node2, node6, 1.0); // 2-6
        graph.addSingleArc(node3, node6, 1.8); // 3-6
        graph.addSingleArc(node4, node1, 1.4); // 4-1
        graph.addSingleArc(node5, node1, 0.9); // 5-1
        graph.addSingleArc(node5, node2, 1.2); // 5-2
        graph.addSingleArc(node6, node1, 1.6); // 6-1
        graph.addSingleArc(node6, node2, 1.2); // 6-2
        graph.addSingleArc(node6, node3, 1.0); // 6-3
        var found = graph.findNode(6);
        expect(found === node6).to.be.true;
        expect(node6.connected(node3)).to.be.true;
    });
    it('Graph properly clears and accepts new data', function () {
        var graph = new Graph_1.TSMT$Graph();
        var node1 = new GraphNode_1.TSMT$GraphNode(1);
        var node2 = new GraphNode_1.TSMT$GraphNode(2);
        var node3 = new GraphNode_1.TSMT$GraphNode(3);
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        graph.clear();
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        expect(graph.size).to.equal(3);
    });
    it('Graph properly identifies presence of a specified value', function () {
        var graph = new Graph_1.TSMT$Graph();
        var node1 = new GraphNode_1.TSMT$GraphNode(1);
        var node2 = new GraphNode_1.TSMT$GraphNode(2);
        var node3 = new GraphNode_1.TSMT$GraphNode(3);
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        expect(graph.contains(3)).to.be.true;
        expect(graph.contains(0)).to.be.false;
    });
    it('Graph properly exports nodes as an array', function () {
        var graph = new Graph_1.TSMT$Graph();
        var node1 = new GraphNode_1.TSMT$GraphNode(1);
        var node2 = new GraphNode_1.TSMT$GraphNode(2);
        var node3 = new GraphNode_1.TSMT$GraphNode(3);
        graph.addNode(node1);
        graph.addNode(node2);
        graph.addNode(node3);
        var nodes = graph.toArray();
        expect(nodes.length).to.equal(3);
        expect(nodes[0] === node1).to.be.true;
    });
});
