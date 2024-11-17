import {
  insertRecur,
  insertIterative,
  compareTreesRecur} from "./bst.js";
import {
  toDigraph,
  toDigraphDAG} from "./graphviz.js"

const tree = 
  [12
    ,[9
      ,[7, null, null]
      ,[10, null, null]
    ]
    ,[16
      ,[14, null, null]
      ,[20
          ,[18, [17, null, null], null]
          ,[22, null, null]]
    ]
  ];


const tRecur = insertRecur(tree, 19);  
const tIter = insertIterative(tree, 19);

console.log(
  JSON.stringify(tRecur) === 
  JSON.stringify(tIter)
)

const tree2 = insertRecur(tree, 19);

Viz.instance().then(function(viz) {
  // document.getElementById("bear").appendChild(
  //   viz.renderSVGElement(toDigraphDAG(tree, tree2))
  // );
  document.getElementById("cat").appendChild(
    viz.renderSVGElement(toDigraph(tree))
  );
  // document.getElementById("belka").appendChild(
  //   viz.renderSVGElement(toDigraph(tree2))
  // );
  console.log(toDigraph(tree));
}); 
