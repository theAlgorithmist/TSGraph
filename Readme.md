# Typescript Math Toolkit Graph

This is the alpha release of the Typescript Math Toolkit Graph library, a lightweight collection of classes for creating and managing graphs.  The current class library is oriented towards node/arc definition and management; organized graph traversals will be added in a subsequent release.

This library is roughly inspired by (and might even be considered a lightweight rendition of) the Polygonal DS Graph classes.  I heavily modified Actionscript versions of those classes for multiple uses 'back in the day', and the templated Typescript versions in this release bear a close resemblance to that porting effort.  So, I want to throw some props to Michael Baczynski.

The purpose of this release is to make an early version of the source code available to Typescript developers for testing and feedback on the current API.

NOTE:  This data structure [has been updated and is now part of the AMYR library](https://github.com/theAlgorithmist/AMYR).

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.3.2

Version: 2.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.


### TSMT$GraphNode<T>

The _TSMT$GraphNode<T>_ class represents a single graph node.  Nodes have _id_ and _value_ properties, and a default node has an id of zero and null value.  Node id is typically assigned post-construction and is expected to be zero or greater.  Nodes are part of a doubly-linked list and expose both _previous_ and _next_ pointers.  This node may be the head of a doubly-linked list of graph arcs, which is available through a class accessor.

The list of public methods for the _TSMT$GraphNode<T>_ class is as follows:

```
clear(): void
get id(): number
set id(value: number)
get marked(): boolean
set marked(value: boolean)
get value(): T
set value(v: T)
get previous(): TSMT$GraphNode<T>
set previous(node: TSMT$GraphNode<T>)
get next(): TSMT$GraphNode<T>
set next(node: TSMT$GraphNode<T>)
get parent(): TSMT$GraphNode<T>
set parent(node: TSMT$GraphNode<T>)
get depth(): number
set depth(value: number)
get arcList(): TSMT$GraphArc<T>
set arcList(value: TSMT$GraphArc<T>)
get arcCount(): number
connected(target: TSMT$GraphNode<T>): boolean
mutuallyConnected(target: TSMT$GraphNode<T>): boolean
public getArc(target: TSMT$GraphNode<T>): TSMT$GraphArc<T>
addArc(target: TSMT$GraphNode<T>, cost: number=1.0): void
removeArc(target: TSMT$GraphNode<T>): boolean
removeOutgoingArcs(): void
removeAllArcs(): void

```

### TSMT$GraphArc<T>

_TSMT$GraphArc<T>_ is largely a convenience class for both _TSMT$GraphNode<T>_ and _TSMT$Graph<T>_ .

The list of public methods for the _TSMT$GraphArc<T>_ class is as follows:

```
clear(): void
get nodeValue(): T
get cost(): number
set cost(value: number)
get previous(): TSMT$GraphArc<T>
set previous(arc: TSMT$GraphArc<T>)
get next(): TSMT$GraphArc<T>
set next(arc: TSMT$GraphArc<T>)
get node(): TSMT$GraphNode<T>
set node(value: TSMT$GraphNode<T>)

```


### TSMT$Graph<T>

_TSMT$Graph<T>_ is the graph, composed of nodes (_TSMT$GraphNode<T>_) and directed arcs (_TSMT$GraphArc<T>_) with specified cost.

The list of public methods for the _TSMT$Graph<T>_ class is as follows:

```
clear(): void
get size(): number
get isEmpty(): boolean
get nodeList(): TSMT$GraphNode<T>
findNode(value: T): TSMT$GraphNode<T>
addNode(node: TSMT$GraphNode<T>): void
removeNode(node: TSMT$GraphNode<T>): void
addSingleArc(source: TSMT$GraphNode<T>, target: TSMT$GraphNode<T>, cost: number = 1.0): void
addMutualArc(source: TSMT$GraphNode<T>, target: TSMT$GraphNode<T>, cost: number = 1.0): void
clearMarks(): void
clearParent(): void
contains(x: T): boolean
remove(x: T): boolean
toArray(): Array<TSMT$GraphNode<T>>
BFS(): Array<TSMT$GraphNode<T>>
DFS(): Array<TSMT$GraphNode<T>>

```

### Usage

Typical usage is to create nodes, add them to the graph, then specify connectivity.  Arcs may be accessed, but are not created external to the graph.


```
  const graph: TSMT$Graph<number> = new TSMT$Graph<number>();

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

  graph.addSingleArc(node1, node4, 1.0);   // 1-4
  graph.addSingleArc(node1, node5, 0.75);  // 1-5
  graph.addSingleArc(node1, node6, 1.2);   // 1-6
  graph.addSingleArc(node2, node5, 0.5);   // 2-5
  graph.addSingleArc(node2, node6, 1.0);   // 2-6
  graph.addSingleArc(node3, node6, 1.8);   // 3-6
  graph.addSingleArc(node4, node1, 1.4);   // 4-1
  graph.addSingleArc(node5, node1, 0.9);   // 5-1
  graph.addSingleArc(node5, node2, 1.2);   // 5-2
  graph.addSingleArc(node6, node1, 1.6);   // 6-1
  graph.addSingleArc(node6, node2, 1.2);   // 6-2
  graph.addSingleArc(node6, node3, 1.0);   // 6-3

  let found: TSMT$GraphNode<number> = graph.findNode(6);

  if (node6.connected(node3))
  {
    .
    .
    .
  }
```


Refer to the specs in the test folder for more usage examples.

For performance reasons, direct references are used inside all classes.  Nodes are not cloned when added to a graph, so if an outside reference is maintained to input nodes, take care not to improperly mutate the nodes.

Depth- and breadth-first searches were added in V2.0.  See the specs for sample usage.

DFS was implemented recursively as the recursive implementation is intuitive and simple to write (as recursions go).  A non-recursive version is based on using a stack as an interim structure and this would be a useful modification for a very large number of nodes and edges.

BFS was implemented using the classic approach in which a queue (implemented with an Array) is used as an intermim data structure.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <https://www.linkedin.com/in/jimarmstrong>

