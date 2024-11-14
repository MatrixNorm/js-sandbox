
(function () {

  function insertRecur(tree, val) {
    if (tree === null)
      return [val, null, null];
    let [x, left, right] = tree;
    if (val <= x)
      return [x, insertRecur(left, val), right];
    else
      return [x, left, insertRecur(right, val)];
  }

  const tree = 
    [12
      ,[9
        ,[7, null, null]
        ,[10, null, null]
      ]
      ,[16
        ,null
        ,[20
            ,[18, null, null]
            ,[22, null, null]]
      ]
    ];

  function toDigraph(tree) {
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

  function toDigraphDAG(oldTree, newTree) {
    const knownNodes = new WeakMap();
    let currId = 0;

    let nodesDeclaration = [];
    let nodesConnections = [];

    function recur (node, father) {
      if (knownNodes.has(node)) {
        nodesConnections.push(
          [knownNodes.get(father),
           knownNodes.get(node)]
        );
        return;
      }
      knownNodes.set(node, ++currId);

      let [val, left, right] = node;

      nodesDeclaration.push([knownNodes.get(node), val]);
      if (father !== null) {
        nodesConnections.push(
          [knownNodes.get(father),
           knownNodes.get(node)]
        );
      }

      if (left !== null) {
        recur(left, node);
      }
      if (right !== null) {
        recur(right, node);
      }
    }

    recur(oldTree, null);
    recur(newTree, null);
    return (
      ''
      + 'digraph {\n'
      + 'node [shape = circle, ordering=out];\n'
      + nodesDeclaration.map(([id, label]) =>
        `${id} [label="${label}"];`
      ).join('\n')
      + '\n'
      + nodesConnections.map(([source, target]) =>
        `${source} -> ${target};`
      ).join('\n')
      + '\n}'
    );
  }

  const tree2 = insertRecur(tree, 19);

  console.log(toDigraphDAG(tree, tree2));

  Viz.instance().then(function(viz) {
    document.body.appendChild(viz.renderSVGElement(toDigraphDAG(tree, tree2)));
  });  
  
})();
