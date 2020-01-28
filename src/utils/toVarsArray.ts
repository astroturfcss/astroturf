import * as t from '@babel/types';

import { DynamicInterpolation } from './buildTaggedTemplate';

export default (interpolations: Set<DynamicInterpolation>) => {
  const vars = Array.from(interpolations, i =>
    t.arrayExpression(
      [
        t.stringLiteral(i.id),
        i.expr.node,
        i.unit ? t.stringLiteral(i.unit) : null,
      ].filter(Boolean),
    ),
  );
  return t.arrayExpression(vars);
};
