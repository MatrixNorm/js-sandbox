
export function insertRecur(tree, val) {
  if (tree === null)
    return [val, null, null];
  let [x, left, right] = tree;
  if (val <= x)
    return [x, insertRecur(left, val), right];
  else
    return [x, left, insertRecur(right, val)];
}

export function insertIterative(tree, val) {
  if (tree === null)
    return [val, null, null];

  let curr,   // current node of old tree
      dir,    // is current node left or right son
      tree__; // new root
  let [x, left, right] = tree;

  if (val <= x) {
    // reuse right subree and go left
    tree__ = [x, null, right];
    curr = left;
    dir = 'left'; // current node is left son
  } else {
    // reuse left subree and go right
    tree__ = [x, left, null];
    curr = right;
    dir = 'right'; // current node is right son
  }

  let prev__,  // prev node of new tree
               // current node is connected to it
      curr__;  // current node of new tree

  prev__ = tree__;

  while (true) {
    if (curr === null) {
      prev__[dir === 'left' ? 1 : 2] = [val, null, null];
      break;
    }

    [x, left, right] = curr;

    if (val <= x) {
      curr__ = [x, null, right];
      prev__[dir === 'left' ? 1 : 2] = curr__;

      prev__ = curr__;
      curr = left;
      dir = 'left';
    } else {
      curr__ = [x, left, null];
      prev__[dir === 'left' ? 1 : 2] = curr__;

      prev__ = curr__;
      curr = right;
      dir = 'right';
    }
  }
  return tree__;
}

export function compareTreesRecur(tree1, tree2) {
  if (tree1[0] !== tree2[0])
    return false;
  if (compareTreesRecur(tree1[1]) !== compareTreesRecur(tree2[1]))
    return false;
  if (compareTreesRecur(tree1[2]) !== compareTreesRecur(tree2[2]))
    return false;
  return true;
}