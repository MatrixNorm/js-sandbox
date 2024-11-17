export function toDigraph(tree) {
  function recur (tree, mutableState, fatherId) {
    const [val, left, right] = tree;

    mutableState.currentId++;
    mutableState.nodesDeclarations.push(
      [mutableState.currentId, val]
    );
    if (fatherId) {
      mutableState.nodesConnections.push(
        [fatherId, mutableState.currentId]
      )
    }

    fatherId = mutableState.currentId;

    if (left !== null) {
      recur(left, mutableState, fatherId);
    }
      
    if (right !== null) {
      recur(right, mutableState, fatherId);
    }
  }

  if (tree === null) {
    return '';
  }
  
  let mutableState = {
    nodesDeclarations: [],
    nodesConnections: [],
    currentId: 0};
  
  recur(tree, mutableState);

  return (
    ''
    + 'digraph {\n'
    + 'node [shape = circle, ordering=out];\n'
    + mutableState.nodesDeclarations.map(([id, val]) => {
      let opts = `label="${val}"`;
      return `${id} [${opts}];`;
    }).join('\n')
    + '\n'
    + mutableState.nodesConnections.map(([source, target]) => {
        return `${source} -> ${target};`;
      }).join('\n')
    + '\n}'
  );
}

export function toDigraphVersion2(tree) {
  function recur (tree, state) {
    const [val, left, right] = tree;
    const {fatherId} = state;

    state.currentId++;
    state.nodesDeclarations.push([state.currentId, val]);
    if (fatherId) {
      state.nodesConnections.push(
        [fatherId, state.currentId]
      )
    }

    fatherId = mutableState.currentId;

    if (left !== null) {
      recur(left, {...state, fatherId});
    }
      
    if (right !== null) {
      recur(right, {...state, fatherId});
    }
  }

  if (tree === null) {
    return '';
  }
  
  let state = recur(tree, { nodesDeclarations: [],
                            nodesConnections: [],
                            currentId: 0 });

  return (
    ''
    + 'digraph {\n'
    + 'node [shape = circle, ordering=out];\n'
    + state.nodesDeclarations.map(([id, val]) => {
      let opts = `label="${val}"`;
      return `${id} [${opts}];`;
    }).join('\n')
    + '\n'
    + state.nodesConnections.map(([source, target]) => {
        return `${source} -> ${target};`;
      }).join('\n')
    + '\n}'
  );
}

export function toDigraphDAG(oldTree, newTree) {
  const knownNodes = new WeakMap();
  let currId = 0;
  // array of [id, value, options]
  const nodesDeclaration = [];
  // array of [sourceId, targetId, edgeOptions]
  const nodesConnections = [];

  function recur (node, father, options) {
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
      nodesConnections.push(
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

    nodesDeclaration.push(
      [knownNodes.get(node),
       val,
       {color: options.nodeColor}]
    );
    // если узел не корневой, то добавляем дугу
    // от отца к сыну в БД дуг
    if (father !== null) {
      nodesConnections.push(
        [knownNodes.get(father),
         knownNodes.get(node),
         {color: options.edgeColor}]
      );
    }

    if (left !== null) {
      recur(left, node, options);
    }
    if (right !== null) {
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
    + nodesDeclaration.map(([id, val, options]) => {
      let opts = ''
        + `label="${val}"`
        + (options.color ? `, color="${options.color}"` : '');
      return `${id} [${opts}];`;
    }).join('\n')
    + '\n'
    + nodesConnections.map(([source, target, options]) => {
        let opts = ''
          + (options.color ? `color="${options.color}"` : '');
        return `${source} -> ${target} [${opts}];`;
      }).join('\n')
    + '\n}'
  );
}