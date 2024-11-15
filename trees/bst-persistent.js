
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
        ,[14, null, null]
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
    const nodesDeclaration = [];
    const nodesConnections = [];

    function recur (node, father, options) {
      // node != null
      // node = [val, left, right]
      options = options || {};

      if (knownNodes.has(node)) {
        // узел уже посещался ранее
        // добавляем дугу к этому узлу от его отца
        // и закругляемся
        nodesConnections.push(
          [knownNodes.get(father),
           knownNodes.get(node),
          {color: options.edgeColor}]
        );
        return;
      }
      knownNodes.set(node, ++currId);

      let [val, left, right] = node;

      nodesDeclaration.push(
        [knownNodes.get(node),
         val,
         {color: options.nodeColor}]
      );
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

  const tree2 = insertRecur(tree, 19);

  console.log(toDigraphDAG(tree, tree2));

  Viz.instance().then(function(viz) {
    document.body.appendChild(viz.renderSVGElement(toDigraphDAG(tree, tree2)));
  });  
  
})();
