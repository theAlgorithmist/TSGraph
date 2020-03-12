/**
 * Simple utility to create a Graph from a data file with string node id and value
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import {
  GraphList,
  IGraphEdge,
  IGraphNode
} from "./GraphList";

import { TSMT$GraphNode } from "./GraphNode";
import { TSMT$Graph     } from "./Graph";

export const graphFromList = (data: GraphList<string>): TSMT$Graph<string>  =>
{
  const graph: TSMT$Graph<string> = new TSMT$Graph<string>();

  if (data === undefined || data == null) {
    return graph;
  }

  const nodes: Array<IGraphNode<string>> = data.nodes;

  // cache for fetching nodes to create arcs
  const nodeList: Record<string, TSMT$GraphNode<string>> = {};

  nodes.forEach( (nodeData: IGraphNode<string>): void => {
    const node: TSMT$GraphNode<string> = new TSMT$GraphNode<string>();
    node.id                            = nodeData.id;
    node.value                         = nodeData.hasOwnProperty('value') ? nodeData.value : nodeData.id;

    nodeList[nodeData.id] = node;
    graph.addNode(node);
  });

  const edges: Array<IGraphEdge> = data.edges;

  edges.forEach( (edgeData: IGraphEdge): void => {
    const from: TSMT$GraphNode<string>   = nodeList[edgeData.from];
    const toList: string | Array<string> = edgeData.to;

    let to: TSMT$GraphNode<string>;
    if (Array.isArray(toList))
    {
      toList.forEach( (nodeID: string): void => {
        to = nodeList[nodeID];

        graph.addEdge(from, to);
      });
    }
    else
    {
      to = nodeList[toList as string];
      graph.addEdge(from, to);
    }
  });

  return graph;
};
