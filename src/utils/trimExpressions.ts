import { DynamicInterpolation } from './buildTaggedTemplate';

export default (interpolations: Set<DynamicInterpolation>) =>
  Array.from(interpolations, ({ expr: _, ...i }) => i);
