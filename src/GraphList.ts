/**
 * A simple Graph format for connected graphs
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
export interface IGraphNode<T>
{
  id: string;
  value?: T;
}

export interface IGraphEdge
{
  id?: string;
  from: string;
  to: string | Array<string>;
}

export interface GraphList<T>
{
  id?: string;
  desc?: string;
  title?: string;
  nodes: Array<IGraphNode<T>>;
  edges: Array<IGraphEdge>;
}
