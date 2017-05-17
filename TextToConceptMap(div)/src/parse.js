const getNodeInfo = (str, delimitre) => {
  if (str.length === 0) return null;
  const res = {
    level: 0,
  };
  let value = str;
  while (value[0] === delimitre) {
    res.level += 1;
    value = value.slice(1);
  }
  res.value = value;
  return res;
};

const parse = (str, delimitre) => {
  if (!delimitre) throw new Error('Delimiter is required');
  if (str[0] === delimitre) throw new Error('There is no root element');
  const nodes = str.split('\n');

  var trees = [[]];
  var tree = [];
  let tree_num = 0;
  let id = 1;

  // define root element
  const rootElement = getNodeInfo(nodes[0], delimitre);
  if (!rootElement) throw new Error('There is no root element');
  rootElement.parent = null;
  rootElement.id = 0;
  tree.push(rootElement);
  nodes.shift();

  const prevElement = {
    0: 0, // Id of root element
  };

  let prevlevel = 0; // level of root element
  while (nodes.length) {
    const curenNode = getNodeInfo(nodes[0], delimitre);
    if (curenNode) {
      if (curenNode.level > prevlevel + 1) throw new Error('Syntax error');
      if(curenNode.level === 0){
        //add previous tree to trees
        trees[tree_num] = tree;
        tree = [];  //clear previous tree
        tree_num += 1;  //start next tree
        //add new tree root
        curenNode.id = id;
        curenNode.parent = null;
        tree.push(curenNode);   
      }
      else {
        curenNode.id = id;
        curenNode.parent = prevElement[curenNode.level - 1];
        tree.push(curenNode);    
      }

      prevlevel = curenNode.level;
      prevElement[curenNode.level] = curenNode.id;
      id += 1;
    }
    nodes.shift();
  }
  trees[tree_num] = tree;
  return trees;
};

export default parse;

//const getById = (elements, id) => elements.filter(el => el.id === id)[0];

export const getGraphData = (trees) => {
  var nodes = [];
  var edges = [];
  var tree;
  for (var i=0; i<trees.length; i++){
    tree = trees[i];

    tree.map((data) => {
      nodes.push({
        id: data.id,
        label: data.value,
        level: data.level,
      })
      return null;
    });

    tree.map((data) => {
      const edge = {};
      if (data.level !== 0) {
        edge.from = data.parent;
        edge.to = data.id;

        edges.push(edge)
      }
      return null;
    })
  }

  return {
    edges,
    nodes,
  };
};
