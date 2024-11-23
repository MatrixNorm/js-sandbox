
function __print({nodesDeclarations, nodesConnections}) {
  return (
    ''
    + 'digraph {\n'
    + 'node [shape = circle, ordering=out];\n'
    + nodesDeclarations.map(([id, val]) => {
      let opts = `label="${val}"`;
      return `${id} [${opts}];`;
    }).join('\n')
    + '\n'
    + nodesConnections.map(([source, target]) => {
        return `${source} -> ${target};`;
      }).join('\n')
    + '\n}'
  );
}

export function toDigraph_v1Closure(tree) {

  const nodes = []; // [nodeId, nodeValue]
  const connections = []; // [sourceNodeId, targetNodeId]
  let currentId = 0;

  function recurPreOrder(node, fatherId) {
    // pre: node != null
    const [val, left, right] = node;
    // entering node
    currentId++;
    nodes.push([currentId, val]);
    if (fatherId) {
      connections.push([fatherId, currentId])
    }
    // запоминаем айди текущего узла, чтобы, когда исполнение
    // вылезет из (*), можно было передать в (**) айди
    // правильного отца, т.к. к тому времени currentId
    // убежит вперёд
    let thisNodeId = currentId;

    if (left) {
      recurPreOrder(left, thisNodeId); // (*)
    }      
    if (right) {
      recurPreOrder(right, thisNodeId); // (**)
    }
  }

  if (tree === null) {
    return '';
  }
  // tree != null
  recurPreOrder(tree);

  return __print({
    nodesDeclarations: nodes,
    nodesConnections: connections
  });
}

export function toDigraph_v1Closure_explicitStack(tree) {

  const nodes = []; // [nodeId, nodeValue]
  const connections = []; // [sourceNodeId, targetNodeId]
  let currentId = 0;
  // keeping fatherId in explicit stack
  let stack = [];

  function recurPreOrder(node, fatherId) {
    // pre: node != null
    const [val, left, right] = node;
    // entering node
    currentId++;
    nodes.push([currentId, val]);
    if (stack.length > 0) {
      connections.push([stack.at(-1), currentId])
    }
    stack.push(currentId);

    if (left !== null) {
      recurPreOrder(left);
    }      
    if (right !== null) {
      recurPreOrder(right);
    }
    stack.pop();
  }

  if (tree === null) {
    return '';
  }
  // tree != null
  recurPreOrder(tree);

  return __print({
    nodesDeclarations: nodes,
    nodesConnections: connections
  });
}

export function toDigraph_v2MutableState(tree) {

  function recurPreOrder(node, state, fatherId) {
    const [val, left, right] = node;

    state.currentId++;
    state.nodes.push([state.currentId, val]);

    if (fatherId) {
      state.connections.push([fatherId, state.currentId])
    }

    let thisNodeId = state.currentId;

    if (left !== null) {
      recurPreOrder(left, state, thisNodeId);
    }
      
    if (right !== null) {
      recurPreOrder(right, state, thisNodeId);
    }
  }

  if (tree === null) {
    return '';
  }
  
  let mutState = {
    nodes: [],
    connections: [],
    currentId: 0
  };
  
  recurPreOrder(tree, mutState);

  return __print({
    nodesDeclarations: mutState.nodes,
    nodesConnections: mutState.connections
  });
}

export function toDigraph_v2MutableStateExplicitStack(tree) {

  function recurPreOrder(node, state) {
    const [val, left, right] = node;

    state.currentId++;
    state.nodes.push([state.currentId, val]);

    if (state.stack.length > 0) {
      state.connections.push(
        [state.stack.at(-1), state.currentId]
      )
    }
    state.stack.push(state.currentId);

    if (left !== null) {
      recurPreOrder(left, state);
    }
      
    if (right !== null) {
      recurPreOrder(right, state);
    }
    state.stack.pop();
  }

  if (tree === null) {
    return '';
  }
  
  let mutState = {
    nodes: [],
    connections: [],
    currentId: 0,
    stack: []
  };
  
  recurPreOrder(tree, mutState);

  return __print({
    nodesDeclarations: mutState.nodes,
    nodesConnections: mutState.connections
  });
}

export function toDigraphIterative_v1(tree) {
  if (tree === null) {
    return '';
  }
  
  let nodes = [];
  let connections = [];
  let currentId = 0;
  let stack = [[tree, "entering", null]];

  while (stack.length > 0) {
    let [node, visitorState, nodeId] = stack.pop();
    let [val, left, right] = node;
    switch (visitorState) {
      case "entering":
        currentId++;
        nodes.push([currentId, val]);
        if (stack.length > 0) {
          connections.push([stack[stack.length - 1][2], currentId]);
        }
        if (left) {
          stack.push([node, "after_left_son", currentId]);
          stack.push([left, "entering", null]);
        } else if (right) {
          stack.push([node, "after_right_son", currentId]);
          stack.push([right, "entering", null]);
        }
        break;
      case "after_left_son":
        if (right) {
          stack.push([node, "after_right_son", nodeId]);
          stack.push([right, "entering", null]);
        }
        break;
      case "after_right_son":
        break;
      default:
        throw new Error("Should never happen");
    }
  }
  return __print({
    nodesDeclarations: nodes,
    nodesConnections: connections
  });
}

export function toDigraphIterative_v2(tree) {
  if (tree === null) {
    return '';
  }
  
  let nodes = [];
  let connections = [];
  let currentId = 0;
  let stack = [[tree, "entering", null]];

  while (stack.length > 0) {
    let [node, visitorState, nodeId] = stack.pop();
    let [val, left, right] = node;
    switch (visitorState) {
      case "entering":
        currentId++;
        nodes.push([currentId, val]);
        if (stack.length > 0) {
          connections.push([stack[stack.length - 1][2], currentId]);
        }
        if (right) {
          stack.push([node, "after_right_son", currentId]);
          stack.push([right, "entering", null]);
        }
        if (left) {
          stack.push([node, "after_left_son", currentId]);
          stack.push([left, "entering", null]);
        }
        break;
      case "after_left_son":
      case "after_right_son":
        break;
      default:
        throw new Error("Should never happen");
    }
  }
  return __print({
    nodesDeclarations: nodes,
    nodesConnections: connections
  });
}

export function toDigraphIterative_v3(tree) {
  if (tree === null) {
    return '';
  }
  
  let nodes = [];
  let connections = [];
  let currentId = 0;
  let stack = [{node: tree, nodeId: null, entering: true}];

  while (stack.length > 0) {
    let {node, nodeId, entering} = stack.pop();
    let [val, left, right] = node;
    if (entering) {
      currentId++;
      nodes.push([currentId, val]);
      if (stack.length > 0) {
        connections.push(
          [stack[stack.length - 1]["nodeId"], currentId]);
      }
      if (right) {
        stack.push({node, nodeId: currentId});
        stack.push({node: right, entering: true});
      }
      if (left) {
        stack.push({node, nodeId: currentId});
        stack.push({node: left, entering: true});
      }
    }
  }
  return __print({
    nodesDeclarations: nodes,
    nodesConnections: connections
  });
}

export function toDigraphIterative_v4(tree) {
  if (tree === null) {
    return '';
  }
  
  let nodes = [];
  let connections = [];
  let currentId = 0;
  let stack = [{node: tree, fatherId: null}];

  while (stack.length > 0) {
    let {node, fatherId} = stack.pop();
    let [val, left, right] = node;
    currentId++;
    nodes.push([currentId, val]);
    if (fatherId) {
      connections.push([fatherId, currentId]);
    }
    if (right) {
      stack.push({node: right, fatherId: currentId});
    }
    if (left) {
      stack.push({node: left, fatherId: currentId});
    }
  }
  return __print({
    nodesDeclarations: nodes,
    nodesConnections: connections
  });
}

export function toDigraphDAG(oldTree, newTree) {
  const knownNodes = new WeakMap();
  let currId = 0;
  // array of [id, value, options]
  const nodes = [];
  // array of [sourceId, targetId, edgeOptions]
  const connections = [];

  function recur(node, father, options) {
    // предусловия:
    // node != null
    // node = [val, left, right]
    // father = Node | null
    options = options || {};

    if (knownNodes.has(node)) {
      // узел уже посещался ранее. добавляем дугу к 
      // этому узлу от его отца и закругляемся
      // т.к. корень никогда не посещается дважды
      // можно не проверять наличие отца
      connections.push(
        [knownNodes.get(father),
         knownNodes.get(node),
        {color: options.edgeColor}]
      );
      return;
    }
    // первый раз посещаем узел, добавляем его в БД
    // известных узлов. Присваеваем ему айдишник.
    knownNodes.set(node, ++currId);

    let [val, left, right] = node;

    nodes.push(
      [knownNodes.get(node),
       val,
       {color: options.nodeColor}]
    );
    // если узел не корневой, то добавляем дугу
    // от отца к сыну в БД дуг
    if (father !== null) {
      connections.push(
        [knownNodes.get(father),
         knownNodes.get(node),
         {color: options.edgeColor}]
      );
    }

    if (left) {
      recur(left, node, options);
    }
    if (right) {
      recur(right, node, options);
    }
  }

  // populates nodesDeclaration and nodesConnections
  recur(oldTree, null);
  recur(newTree, null, {nodeColor: "red", edgeColor: "red"});

  return (
    ''
    + 'digraph {\n'
    + 'node [shape = circle, ordering=out];\n'
    + nodes.map(([id, val, options]) => {
      let opts = ''
        + `label="${val}"`
        + (options.color ? `, color="${options.color}"` : '');
      return `${id} [${opts}];`;
    }).join('\n')
    + '\n'
    + connections.map(([source, target, options]) => {
        let opts = ''
          + (options.color ? `color="${options.color}"` : '');
        return `${source} -> ${target} [${opts}];`;
      }).join('\n')
    + '\n}'
  );
}

export function toDigraph2(tree, history = null) {
  if (tree === null)
    return '';
  if (history?.visitedNodes?.has(tree))
    return;
  
  let nodes = [];
  let connections = [];

  let currentId = history?.currentId || 0;
  let visitedNodes = new Map(history?.visitedNodes);
  
  let stack = [{node: tree, fatherId: null}];

  while (stack.length > 0) {
    let {node, fatherId} = stack.pop();
    let [val, left, right] = node;
    
    currentId++;
    nodes.push([currentId, val]);
    visitedNodes.set(node, currentId);
    
    if (fatherId) {
      connections.push([fatherId, currentId]);
    }
    if (right) {
      if (visitedNodes.has(right)) {
        connections.push([currentId, visitedNodes.get(right)]);
      } else {
        stack.push({node: right, fatherId: currentId});
      }
    }
    if (left) {
      if (visitedNodes.has(left)) {
        connections.push([currentId, visitedNodes.get(left)]);
      } else {
        stack.push({node: left, fatherId: currentId});
      }
    }
  }

  return {
    nodes,
    connections,
    visitedNodes,
    currentId,
  };
}

export function toDigraphDAG2(oldTree, newTree) {
  const x1 = toDigraph2(oldTree);
  console.log(x1);
  const x2 = toDigraph2(newTree, x1);
  console.log(x2);
}