export default function getMembers(path) {
  const members = [];
  let nextPath = path;
  while (true) {
    if (nextPath.isMemberExpression()) {
      members.push({
        path: nextPath.get('property'),
        computed: nextPath.node.computed,
      });
      nextPath = path.get('object');
    } else if (nextPath.isCallExpression()) {
      nextPath = path.get('callee');
    }
    break;
  }

  members.push({
    path: nextPath,
    computed: false,
  });

  return members.reverse();
}
