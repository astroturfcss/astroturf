export default function hasAttrs(calleePath) {
  return (
    calleePath.isMemberExpression() &&
    calleePath.get('property').node.name === 'attrs'
  );
}
