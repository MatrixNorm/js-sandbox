import {
  insertRecur,
  insertIterative,
  compareTreesRecur} from "./bst.js";
import {
  toDigraph_v1Closure,
  toDigraph_v1Closure_explicitStack,
  toDigraph_v2MutableState,
  toDigraph_v2MutableStateExplicitStack,
  toDigraphIterative,
  toDigraphDAG} from "./graphviz.js"


function leaf(val) {
  return [val, null, null];
}

const tree = 
  [12
    ,[9
      ,leaf(7)
      ,leaf(10)
    ]
    ,[16
      ,leaf(14)
      ,[20
          ,[18
            ,leaf(17)
            ,null]
          ,leaf(22)]
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
  document.getElementById("fig1").appendChild(
    viz.renderSVGElement(toDigraph_v1Closure(tree))
  );
  document.getElementById("fig2").appendChild(
    viz.renderSVGElement(toDigraph_v2MutableState(tree))
  );
}); 

{
  const v1 = toDigraph_v1Closure(tree);
  const v1_explicitStack = toDigraph_v1Closure_explicitStack(tree);
  const v2 = toDigraph_v2MutableState(tree);
  const v2_explicitStack = toDigraph_v2MutableStateExplicitStack(tree);
  const iterative = toDigraphIterative(tree);

  console.log(iterative);
  console.log(v1 === v1_explicitStack);
  console.log(v1 === v2);
  console.log(v1 === v2_explicitStack);
  console.log(v1 === iterative);
}
