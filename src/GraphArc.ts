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

import {TSMT$GraphNode} from "./GraphNode";
/**
 * Typescript Math Toolkit: Graph Arc.  An arc is defined by a terminating node and a numerical cost, which is zero
 * by default.  This is largely a convenience class for TSMT$Graph<T>.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

export class TSMT$GraphArc<T>
{
  protected _node: TSMT$GraphNode<T>;      // node this arc points to
  protected _prev: TSMT$GraphArc<T>;       // previous arc in a list
  protected _next: TSMT$GraphArc<T>;       // next arc in a list
  protected _cost: number;                 // numerical cost of this arc

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
  constructor(node: TSMT$GraphNode<T>, cost: number=0.0)
  {
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
  public clear(): void
  {
    this._node = null;
    this._next = null;
    this._prev = null;
    this._cost = 0.0;
  }

 /**
  * Access internal node's value
  *
  * @return number : Node value
  */
  public get nodeValue(): T
  {
    return this._node ? this._node.value : null;
  }

  /**
   * Access this arc's cost
   *
   * @returns {number} Arc cost
   */
  public get cost(): number
  {
    return this._cost;
  }

  /**
   * Assign a new cost to this arc
   *
   * @param value: number Graph cost (zero or greater)
   *
   * @returns nothing
   */
  public set cost(value: number)
  {
    this._cost = !isNaN(value) && isFinite(value) && value >= 0 ? value : this._cost;
  }

  /**
   * Access the previous arc in a doubly-linked list of arcs
   *
   * @returns {TSMT$GraphArc<T>} Direct reference to previous arc
   */
  public get previous(): TSMT$GraphArc<T>
  {
    return this._prev;
  }

  /**
   * Assign the previous arc reference
   *
   * @param arc: TSMT$GraphArc<T> Reference to previous arc in doubly-linked arc list
   *
   * @returns nothing
   */
  public set previous(arc: TSMT$GraphArc<T>)
  {
    this._prev = arc !== undefined && arc != null ? arc : this._prev;
  }

  /**
   * Access the next arc in a doubly-linked list of arcs
   *
   * @returns {TSMT$GraphArc<T>} Direct reference to next arc in doubly-linked arc list
   */
  public get next(): TSMT$GraphArc<T>
  {
    return this._next;
  }

  /**
   * Assign the next arc reference
   *
   * @param arc: TSMT$GraphArc<T> Reference to next arc in doubly-linked arc list
   */
  public set next(arc: TSMT$GraphArc<T>)
  {
    this._next = arc !== undefined && arc != null ? arc : this._next;
  }

  /**
   * Access the terminal node associated with this arc
   *
   * @returns TSMT$GraphNode<T> Direct reference to terminal node
   */
  public get node(): TSMT$GraphNode<T>
  {
    return this._node;
  }

  /**
   * Assign a new terminal node
   *
   * @param value: TSMT$GraphNode<T> New terminating node for this arc
   */
  public set node(value: TSMT$GraphNode<T>)
  {
    this._node = value !== undefined && value != null && value instanceof TSMT$GraphNode ? value : this._node;
  }
}
