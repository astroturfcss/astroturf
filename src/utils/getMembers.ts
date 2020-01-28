import { NodePath } from '@babel/core';

type MemberPath = { path: NodePath; computed: boolean };

export default function getMembers(path: NodePath) {
  const members = [] as MemberPath[];
  let nextPath = path;
  while (true) {
    if (nextPath.isMemberExpression() || nextPath.isJSXMemberExpression()) {
      members.push({
        path: nextPath.get('property') as NodePath,
        computed: nextPath.isMemberExpression()
          ? nextPath.node.computed
          : false,
      });
      nextPath = path.get('object') as NodePath;
    } else if (nextPath.isCallExpression()) {
      nextPath = path.get('callee') as NodePath;
    }
    break;
  }

  members.push({
    path: nextPath,
    computed: false,
  });

  return members.reverse();
}
