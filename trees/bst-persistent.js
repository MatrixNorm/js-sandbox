
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

  const tree2 = insertRecur(tree, 19);

  console.log(toDigraph(tree));

  Viz.instance().then(function(viz) {
    document.body.appendChild(viz.renderSVGElement(toDigraph(tree)));
  });  
  
})();
