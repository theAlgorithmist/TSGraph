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

import {TSMT$GraphArc} from './GraphArc';

export class TSMT$GraphNode<T>
{
  protected _id: string | number;         // id associated with this node (expected to be greater than or equal to zero if number)
  protected _val: T;                      // value of this node
  protected _prev: TSMT$GraphNode<T>;     // reference to previous node in a list
  protected _next: TSMT$GraphNode<T>;     // reference to next node in a list
  protected _arcList: TSMT$GraphArc<T>;   // doubly-linked list of arcs for which this node is a head
  protected _curArc: TSMT$GraphArc<T>;    // reference to most recently added arc out of this node
  protected _marked: boolean;             // true if this node has been marked in a traversal
  protected _parent: TSMT$GraphNode<T>;   // parent of this node
  protected _depth: number;               // traversal depth in a structure

  /**
   * Construct a new GraphNode
   *
   * @param data: T Optional data associated with this node
   *
   * @returns nothing Constructs a new TSMT$GraphNode<T> instance
   */
  constructor(data?: T)
  {
    this.clear();

    this._val = data !== undefined ? data : null;
  }

  /**
   * Clear this graph node and prepare for new data
   *
   * @returns nothing The node is completely clear
   */
  public clear(): void
  {
    this._id      = 0;
    this._val     = null;
    this._prev    = null;
    this._next    = null;
    this._marked  = false;
    this._parent  = null;
    this._depth   = 0;
    this._curArc  = null;
    this._arcList = null;
  }

  /**
   * Access the id of this graph node
   *
   * @returns {string | number} Node ID
   */
  public get id(): string| number
  {
    return this._id;
  }

  /**
   * Assign an ID to this graph node
   *
   * @param value Node ID (zero or greater)
   *
   * @returns nothing The new node id is assigned as long as it is a valid input
   */
  public set id(value: string | number)
  {
    if (typeof value === 'string')
    {
      this._id = value;
    }
    else
    {
      const nodeID: number = +value;
      this._id = !isNaN(nodeID) && isFinite(nodeID) && value >= 0 ? value : this._id;
    }
  }

  /**
   * Has this node been marked in a graph traversal?
   *
   * @returns {boolean} True if this node has been marked as traversed
   */
  public get marked(): boolean
  {
    return this._marked;
  }

  /**
   * Assign that this node was marked during traversal
   *
   * @param value True if this node is marked as traversed
   */
  public set marked(value: boolean)
  {
    this._marked = value === true ? true : false;
  }

  /**
   * Access this node's value
   *
   * @returns {T} Node value
   */
  public get value(): T
  {
    return this._val;
  }

  /**
   * Assign this graph node's value
   *
   * @param v: T New node value
   *
   * @returns nothing New node value is assigned provided it is non-null
   */
  public set value(v: T)
  {
    this._val = v !== undefined && v != null ? v : this._val;
  }

  /**
   * Access previous node in list
   *
   * @returns {TSMT$GraphNode<T>} Reference to previous TSMT$GraphNode<T> in doubly-linked node list
   */
  public get previous(): TSMT$GraphNode<T>
  {
    return this._prev;
  }

  /**
   * Assign previous node in list
   *
   * @param node: TSMT$GraphNode<T> Reference to previous node in doubly-linked node list
   */
  public set previous(node: TSMT$GraphNode<T>)
  {
    this._prev = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._prev;
  }

  /**
   * Access the next node in list
   *
   * @returns {TSMT$GraphNode<T>} Reference to next TSMT$GraphNode<T> in doubly-linked node list
   */
  public get next(): TSMT$GraphNode<T>
  {
    return this._next;
  }

  /**
   * Assign next node in list
   *
   * @param node: TMST$GraphNode<T> Reference to next node in doubly-linked node list
   *
   * @returns nothing
   */
  public set next(node: TSMT$GraphNode<T>)
  {
    this._next = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._next;
  }

  /**
   * Access this node's parent
   *
   * @returns {TSMT$GraphNode<T>} Reference to this node's parent
   */
  public get parent(): TSMT$GraphNode<T>
  {
    return this._parent;
  }

  /**
   * Assign a parent reference
   *
   * @param node: TSMT$GraphNode<T> Node assigned as a parent node during an organized graph traversal
   */
  public set parent(node: TSMT$GraphNode<T>)
  {
    this._parent = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._parent;
  }

  /**
   * Access current traversal depth
   *
   * @returns {number} Traversal depth or distance from first-traversed node
   */
  public get depth(): number
  {
    return this._depth;
  }

  /**
   * Assign traversal depth
   *
   * @param value: number Traversal depth (zero or greater)
   *
   * @returns nothing
   */
  public set depth(value: number)
  {
    this._depth = !isNaN(value) && isFinite(value) && value >= 0 ? value : this._depth;
  }

  /**
   * Access the arc list for this node
   *
   * @returns {TSMT$GraphArc<T>} Head of doubly-linked list of arcs for which this node is a head
   */
  public get arcList(): TSMT$GraphArc<T>
  {
    return this._arcList;
  }

  /**
   * Assign a new head pointer for the arc list from this node
   *
   * @param value: TSMT$GraphArc<T> New head arc in doubly-linked arc list
   *
   * @returns nothing
   */
  public set arcList(value: TSMT$GraphArc<T>)
  {
    this._arcList = value !== undefined && value != null && value instanceof TSMT$GraphArc ? value : this._arcList;
  }

  /**
   * Access the number of arcs emanating from this node
   *
   * @returns {number} Arc count or number of arcs emanating from this node
   */
  public get arcCount(): number
  {
    let count: number = 0;
    let arc: TSMT$GraphArc<T> = this._arcList;

    while (arc != null)
    {
      count++;
      arc = arc.next;
    }

    return count;
  }

  /**
   * Access if this node is connected to a specified node
   *
   * @param target: TSMT$GraphNode<T> Target node to check one-way connectivity
   *
   * @returns {boolean} True if there is a defined arc from this node to the specified target node
   */
  public connected(target: TSMT$GraphNode<T>): boolean
  {
    return target !== undefined && target != null && target instanceof TSMT$GraphNode ? this.getArc(target) != null : false;
  }

  /**
   * Is there a mutual connection from this node to and from the specified node?
   *
   * @param target: TSMT$GraphNode<T> Target node to check mututal connectivity
   *
   * @returns {boolean} True if there is an arc from this node to the target node AND from the target node to this node
   */
  public mutuallyConnected(target: TSMT$GraphNode<T>): boolean
  {
    if (target !== undefined && target != null && target instanceof TSMT$GraphNode)
    {
      // check mutual connection
      return this.getArc(target) != null && target.getArc(this) != null;
    }
    else
    {
      return false;
    }
  }

  /**
   * Access the arc from this node to the specified target
   *
   * @param target: TSMT$GraphNode<T> Target node to check for one-way connectivity
   *
   * @returns {TSMT$GraphArc<T>} Direct reference to the graph arc from this node to the specified target node
   */
  public getArc(target: TSMT$GraphNode<T>): TSMT$GraphArc<T>
  {
    if (target === undefined || target == null)
    {
      // game over
      return null;
    }

    let found: boolean      = false;
    let a: TSMT$GraphArc<T> = this._arcList;

    while (a != null)
    {
      if (a.node == target)
      {
        found = true;
        break;
      }
      a = a.next;
    }
      
    return found ? a : null
  }

  /**
   * Add a graph arc from this node to the specified node
   *
   * @param target: TSMT$GraphNode<T> Terminal node of arc
   *
   * @param cost: number Numerical cost associated with this arc (negative values are not currently allowed)
   */
  public addArc(target: TSMT$GraphNode<T>, cost: number=1.0): void
  {
    if (target !== undefined && target != null)
    {
      // clip for now
      cost = Math.max(0.0, cost);

      const arc: TSMT$GraphArc<T> = new TSMT$GraphArc<T>(target, cost);

      if (this._arcList == null)
      {
        // begin new list
        this._arcList = arc;
        this._curArc  = arc;
      }
      else
      {
        arc.previous      = this._curArc;
        this._curArc.next = arc;
        this._curArc      = arc;
      }
    }
  }

  /**
   * Remove an arc from the set of arcs emanating from this node
   *
   * @param target: TSMT$GraphNode<T> Terminal node of the arc to remove
   *
   * @returns {boolean} True if the arc was found and removed
   */
  public removeArc(target: TSMT$GraphNode<T>): boolean
  {
    if (target !== undefined && target != null)
    {
      const arc: TSMT$GraphArc<T> = this.getArc(target);
      if (arc != null)
      {
        if (arc.previous != null)
        {
          // update prev.next after removal
          arc.previous.next = arc.next;
        }

        if (arc.next != null)
        {
          // update next.prev after removal
          arc.next.previous = arc.previous;
        }

        if (this._arcList == arc)
        {
          // update arcList ref after removal
          this._arcList = arc.next;
        }

        return true;
      }

      return false;
    }
    else
    {
      // nothing to remove
      return false;
    }
  }

  /**
   * Remove all outgoing arcs from this node
   *
   * @returns nothing
   */
  public removeOutgoingArcs(): void
  {
    let arc: TSMT$GraphArc<T> = this._arcList;

    while (arc != null)
    {
      this.removeArc(arc.node);
      arc = arc.next;
    }
  }

  /**
   * Remove all outgoing and incoming arcs from this node
   *
   * @return nothing
   */
  public removeAllArcs(): void
  {
    let arc: TSMT$GraphArc<T> = this._arcList;

    while (arc != null)
    {
      arc.node.removeArc(this);
      this.removeArc(arc.node);
      arc = arc.next;
    }
      
    this._arcList = null;
  }
}
