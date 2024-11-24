
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

  const L = 1;
  const R = 2;

  if (val <= x) {
    // new root has the same value as old root; it reuses right
    // subtree; leave placeholder for left subtree
    tree__ = [x, null, right];
    curr = left; // set current node to left son of the root
    dir = L; // note that current node is left son of the root
  } else {
    // new root has the same value as old root; it reuses left
    // subtree; leave placeholder for right subtree
    tree__ = [x, left, null];
    curr = right; // set current node to right son of the root
    dir = R; // note that current node is right son of the root
  }

  let curr__;  // current node of new tree
  // upper node of new tree; current node is connected to it
  let upper__ = tree__;

  while (true) {
    if (curr === null) {
      upper__[dir] = [val, null, null];
      break;
    }

    [x, left, right] = curr;

    if (val <= x) {
      curr__ = [x, null, right];
      upper__[dir] = curr__;
      // reset for next iteration
      upper__ = curr__;
      curr = left;
      dir = L;
    } else {
      curr__ = [x, left, null];
      upper__[dir] = curr__;
      // reset for next iteration
      upper__ = curr__;
      curr = right;
      dir = R;
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