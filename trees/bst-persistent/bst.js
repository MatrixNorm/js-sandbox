
export function insertRecur(tree, val) {
  if (tree === null)
    return [val, null, null];
  let [x, left, right] = tree;
  if (val <= x)
    return [x, insertRecur(left, val), right];
  else
    return [x, left, insertRecur(right, val)];
}

export function toDigraph(tree) {
  function recur (tree) {
    let [val, left, right] = tree;    
    return (
      (left !== null ?
        (
          String(val) + ' -> ' + String(left[0]) + '\n' +
          recur(left)
        ) : ''
      ) +
      (right !== null ?
        (
          String(val) + ' -> ' + String(right[0]) + '\n' +
          recur(right)
        ) : ''
      )
    )
  }

  if (tree === null) {
    return '';
  }
  return (
    'digraph {\n' +
    'node [shape = circle, ordering=out];\n' +
    recur(tree) +
    '\n}'
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