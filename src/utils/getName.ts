import * as t from '@babel/types';

const getName = (node: t.Identifier | t.StringLiteral) =>
  'name' in node ? node.name : node.value;

export default getName;
