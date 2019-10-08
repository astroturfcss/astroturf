import * as t from '@babel/types';

export default interpolations =>
  t.ArrayExpression(
    Array.from(interpolations, i =>
      t.ArrayExpression(
        [
          t.StringLiteral(i.id),
          i.expr.node,
          i.unit && t.StringLiteral(i.unit),
        ].filter(Boolean),
      ),
    ),
  );
