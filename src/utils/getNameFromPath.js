import getMembers from './getMembers';
import pascalCase from './pascalCase';

export default function getNameFromPath(path) {
  if (path.isIdentifier()) return path.node.name;
  if (path.isLiteral()) return path.node.raw || path.node.value;
  if (path.isMemberExpression()) {
    return pascalCase(
      getMembers(path)
        .map(m => getNameFromPath(m.path))
        .filter(Boolean)
        .join('-'),
    );
  }
  return null;
}
