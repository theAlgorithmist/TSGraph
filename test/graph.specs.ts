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

// Specs for various alpha release of TSMT Graph
import { TSMT$GraphNode } from '../src/GraphNode';
import { TSMT$GraphArc  } from '../src/GraphArc';
import { TSMT$Graph     } from '../src/Graph';

import { graphFromList } from "../src/graph-from-list";

// test graphs
import { graph1 } from "../src/graphs/tests";
import { graph2 } from "../src/graphs/tests";
import { graph3 } from "../src/graphs/tests";
import { graph4 } from "../src/graphs/tests";
import { graph5 } from "../src/graphs/tests";

import * as Chai from 'chai';

const expect = Chai.expect;

// Test Suites
describe('TSMT Graph Node', () => {

  it('newly constructed Node has and id of zero', function() {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.id).to.equal(0);
  });

  it('Node with empty constructor has null data', function() {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.value).to.be.null;
  });

  it('Node accepts optional data on construction', function() {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1.0);

    expect(<number> node.value).to.equal(1.0);
  });

  it('Node can only be marked with a boolean', function() {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1.0);

    let value: any = 'true';
    node.marked    = value;

    expect(node.marked).to.be.false;

    node.marked = true;
    expect(node.marked).to.be.true;
  });

  it('Node can accept a value post-construction', function() {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.value).to.be.null;

    node.value = -2.0;

    expect( <number> node.value).to.equal(-2);
  });

  it('Node properly accepts and returns an id', function() {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.id).to.equal(0);

    node.id = -1;
    expect(node.id).to.equal(0);

    node.id = 1;
    expect(node.id).to.equal(1)
  });

  it('Node propertly accepts and sets previous/next references', function() {
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>();
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.previous).to.be.null;
    expect(node.next).to.be.null;

    let junk: any = null;
    node.previous = node1;
    node.next     = node2;

    node.previous = junk;
    node.next     = junk;

    expect(node.previous === node1).to.be.true;
    expect(node.next == node2     ).to.be.true;
  });

  it('Newly constructed node has zero arc count', function() {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.arcCount).to.equal(0);
  });

  it('Newly constructed node is not connected to any other node', function() {
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>();
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.connected(node1)).to.be.false;
    expect(node.mutuallyConnected(node1)).to.be.false;
  });
});

describe('TSMT Graph Arc', () =>
{
  it('newly constructed edge has default zero cost', () =>
  {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    let arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    expect(arc.cost).to.equal(0);
  });

  it('node accessor returns proper reference', () =>
  {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    let arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    expect(arc.node === node).to.be.true;
  });

  it('previous and next references are null by default', () =>
  {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    let arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    expect(arc.previous).to.be.null;
    expect(arc.next    ).to.be.null;
  });

  it('arc accepts proper cost pre- and post-construction', () =>
  {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    let arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    arc.cost = -1;

    expect(arc.cost).to.equal(0);

    arc.cost = 10.0
    expect(arc.cost).to.equal(10);

    let arc1: TSMT$GraphArc<number> = new TSMT$GraphArc<number>(node, 2.0);
    expect(arc1.cost).to.equal(2);
  });

  it('arc accepts proper previous and next arc references', () =>
  {
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    let arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    let node0: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(0);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);

    let arc0: TSMT$GraphArc<number> = new TSMT$GraphArc<number>(node0, 1.0);
    let arc2: TSMT$GraphArc<number> = new TSMT$GraphArc<number>(node2, 2.0);

    arc.previous = arc0;
    arc.next     = arc2;

    arc.previous = null;
    arc.next     = null;

    expect(arc.previous === arc0).to.be.true;
    expect(arc.next === arc2).to.be.true;
  });
});

describe('Node and Arc Tests', () =>
{
  it('correctly adds a singleton arc', () =>
  {
    let root: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    let node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);

    root.addArc(node, 2.0);

    expect(root.arcCount).to.equal(1);

    let list: TSMT$GraphArc<number> = root.arcList;
    expect( <number> list.node.value).to.equal(2);
  });

  it('correctly adds and removes multiple arcs', () =>
  {
    let root: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(2);
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);

    root.addArc(node , 2.0);
    root.addArc(node1, 3.0);
    root.addArc(node2, 4.0);

    expect(root.arcCount).to.equal(3);

    let arc: TSMT$GraphArc<number> = root.arcList;
    expect( <number> arc.node.value).to.equal(2);

    arc = arc.next;
    expect( <number> arc.node.value).to.equal(3);

    arc = arc.next;
    expect( <number> arc.node.value).to.equal(4);

    root.removeAllArcs();
    expect(root.arcCount).to.equal(0);
    expect(root.arcList).to.be.null;
  });

  it('correctly removes a single arcs', () =>
  {
    let root: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(2);
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(5);

    root.addArc(node , 2.0);
    root.addArc(node1, 3.0);
    root.addArc(node2, 4.0);

    let result: boolean = root.removeArc(node3);
    expect(result).to.be.false;
    expect(root.arcCount).to.equal(3);

    result = root.removeArc(node1);
    expect(result).to.be.true;
    expect(root.arcCount).to.equal(2);

    let arc: TSMT$GraphArc<number> = root.arcList;
    expect( <number> arc.node.value).to.equal(2);

    arc = arc.next;
    expect( <number> arc.node.value).to.equal(4);
  });


  it('correctly identifies connectivity', () =>
  {
    let root: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(2);
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(5);

    root.addArc(node , 2.0);

    node1.addArc(node2, 3.0);
    node1.addArc(node3, 1.0);

    node3.addArc(node1, 1.0)

    let result: boolean = root.connected(node);
    expect(result).to.be.true;

    result = root.connected(node3);
    expect(result).to.be.false;

    result = node1.mutuallyConnected(node3);
    expect(result).to.be.true;
  });
});

describe('Graph Tests', () =>
{
  it('Newly constructed graph has zero size and is empty', () =>
  {
    let graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    expect(graph.size).to.equal(0);
    expect(graph.isEmpty).to.be.true;
  });

  it('Graph correctly adds nodes', () =>
  {
    let graph: TSMT$Graph<number>     = new TSMT$Graph<number>();
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node);
    graph.addNode(node1);
    graph.addNode(node2);

    expect(graph.size).to.equal(3);
    expect(graph.isEmpty).to.be.false;

    let root: TSMT$GraphNode<number> = graph.nodeList;
    expect(<number> root.value).to.equal(1);

    node = root.next;
    expect(<number> node.value).to.equal(2);

    node = node.next;
    expect(<number> node.value).to.equal(3);

    node = node.previous;
    expect(<number> node.value).to.equal(2);

    node = node.previous;
    expect(<number> node.value).to.equal(1);

    node = node.previous;
    expect(node).to.be.null;
  });

  it('Graph correctly removes a node', () =>
  {
    let graph: TSMT$Graph<number>     = new TSMT$Graph<number>();
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);

    graph.addNode(node);
    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3)

    expect(graph.size).to.equal(4);

    graph.removeNode(node2);

    let root: TSMT$GraphNode<number> = graph.nodeList;
    expect(<number> root.value).to.equal(1);

    node = root.next;
    expect(<number> node.value).to.equal(2);

    node = node.next;
    expect(<number> node.value).to.equal(4);

    node = node.previous;
    expect(<number> node.value).to.equal(2);

    node = node.previous;
    expect(<number> node.value).to.equal(1);

    node = node.previous;
    expect(node).to.be.null;
  });

  it('Graph correctly finds a node', () =>
  {
    let graph: TSMT$Graph<number>     = new TSMT$Graph<number>();
    let node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);

    graph.addNode(node);
    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3)

    expect(graph.size).to.equal(4);

    let found: TSMT$GraphNode<number> = graph.findNode(2);
    expect(found === node1).to.be.true;

    found = graph.findNode(5);
    expect(found).to.be.null;
  });

  it('Graph correctly builds graph from single arcs', () =>
  {
    let graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    // build the following graph
    // {1, 4}, {1, 5}, {1, 6}, {2, 5}, {2, 6}, {3, 6}, {4, 1}, {5, 1}, {5, 2}, {6, 1}, {6, 2}, {6, 3}

    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    let node4: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);
    let node5: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(5);
    let node6: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(6);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);
    graph.addNode(node4);
    graph.addNode(node5);
    graph.addNode(node6);

    expect(graph.size).to.equal(6);

    graph.addEdge(node1, node4, 1.0);   // 1-4
    graph.addEdge(node1, node5, 0.75);  // 1-5
    graph.addEdge(node1, node6, 1.2);   // 1-6
    graph.addEdge(node2, node5, 0.5);   // 2-5
    graph.addEdge(node2, node6, 1.0);   // 2-6
    graph.addEdge(node3, node6, 1.8);   // 3-6
    graph.addEdge(node4, node1, 1.4);   // 4-1
    graph.addEdge(node5, node1, 0.9);   // 5-1
    graph.addEdge(node5, node2, 1.2);   // 5-2
    graph.addEdge(node6, node1, 1.6);   // 6-1
    graph.addEdge(node6, node2, 1.2);   // 6-2
    graph.addEdge(node6, node3, 1.0);   // 6-3

    let found: TSMT$GraphNode<number> = graph.findNode(6);
    expect(found === node6).to.be.true;

    expect(node6.connected(node3)).to.be.true;
  });

  it('Graph properly clears and accepts new data', () =>
  {
    let graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);

    graph.clear();

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3)

    expect(graph.size).to.equal(3);
  });

  it('Graph properly identifies presence of a specified value', () =>
  {
    let graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);

    expect(graph.contains(3)).to.be.true;
    expect(graph.contains(0)).to.be.false;
  });

  it('Graph properly exports nodes as an array', () =>
  {
    let graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    let node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    let node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    let node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);

    let nodes: Array<TSMT$GraphNode<number>> = graph.toArray();

    expect(nodes.length).to.equal(3);
    expect(nodes[0] === node1).to.be.true;
  });
});

describe('Graph from list', () => {

  it('Returns empty Graph from invalid input', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(null);

    expect(graph.size).to.equal(0);
  });

  it('Correctly creates a graph from basic data', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph1);

    expect(graph.size).to.equal(8);
  });
});

describe('DFS', () => {

  it('Returns empty list from invalid input', () =>
  {
    const graph: TSMT$Graph<string> = new TSMT$Graph<string>();

    expect(graph.size).to.equal(0);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();
    expect(list.length).to.equal(0);
  });

  it('Correctly traverses a graph from the root node #1', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph1);

    expect(graph.size).to.equal(8);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();
    expect(list.length).to.equal(8);

    expect(list[0].id).to.equal('R');
    expect(list[1].id).to.equal('A');
    expect(list[2].id).to.equal('D');
    expect(list[3].id).to.equal('G');
    expect(list[4].id).to.equal('B');
    expect(list[5].id).to.equal('E');
    expect(list[6].id).to.equal('C');
    expect(list[7].id).to.equal('F');
  });

  it('Correctly traverses a graph from the root node #2', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph2);

    expect(graph.size).to.equal(5);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();

    expect(list[0].id).to.equal('0');
    expect(list[1].id).to.equal('1');
    expect(list[2].id).to.equal('2');
    expect(list[3].id).to.equal('4');
    expect(list[4].id).to.equal('3');
  });

  it('Correctly traverses a graph from the root node #3', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph3);

    expect(graph.size).to.equal(9);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();

    expect(list[0].id).to.equal('A');
    expect(list[1].id).to.equal('B');
    expect(list[2].id).to.equal('S');
    expect(list[3].id).to.equal('C');
    expect(list[4].id).to.equal('D');
    expect(list[5].id).to.equal('E');
    expect(list[6].id).to.equal('H');
    expect(list[7].id).to.equal('F');
    expect(list[8].id).to.equal('G');
  });

  it('Correctly traverses a graph from a node with specified value', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph1);

    expect(graph.size).to.equal(8);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS('A');

    expect(list.length).to.equal(3);

    expect(list[0].id).to.equal('A');
    expect(list[1].id).to.equal('D');
    expect(list[2].id).to.equal('G');
  });
});

describe('BFS', () => {

  it('Returns empty list from invalid input', () => {
    const graph: TSMT$Graph<string> = new TSMT$Graph<string>();

    expect(graph.size).to.equal(0);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();
    expect(list.length).to.equal(0);
  });

  it('Correctly traverses a graph from the root node #1', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph4);

    expect(graph.size).to.equal(8);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();

    expect(list.length).to.equal(8);

    expect(list[0].id).to.equal('0');
    expect(list[1].id).to.equal('1');
    expect(list[2].id).to.equal('2');
    expect(list[3].id).to.equal('3');
    expect(list[4].id).to.equal('4');
    expect(list[5].id).to.equal('5');
    expect(list[6].id).to.equal('6');
    expect(list[7].id).to.equal('7');
  });

  it('Correctly traverses a graph from the root node #2', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph5);

    expect(graph.size).to.equal(6);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();

    expect(list.length).to.equal(6);

    expect(list[0].id).to.equal('R');
    expect(list[1].id).to.equal('1');
    expect(list[2].id).to.equal('2');
    expect(list[3].id).to.equal('3');
    expect(list[4].id).to.equal('4');
    expect(list[5].id).to.equal('5');
  });

  it('Correctly traverses a graph from the root node #3', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(graph1);

    expect(graph.size).to.equal(8);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();

    expect(list.length).to.equal(8);

    expect(list[0].id).to.equal('R');
    expect(list[1].id).to.equal('A');
    expect(list[2].id).to.equal('B');
    expect(list[3].id).to.equal('C');
    expect(list[4].id).to.equal('D');
    expect(list[5].id).to.equal('E');
    expect(list[6].id).to.equal('F');
    expect(list[7].id).to.equal('G');
  });
});
