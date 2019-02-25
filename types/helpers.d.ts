import * as React from 'react';

export type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;

export type mapper<TInner, TOutter> = (input: TInner) => TOutter;

export interface InferableComponentEnhancerWithProps<
  TInjectedProps,
  TNeedsProps
> {
  <P extends TInjectedProps>(
    component: React.ComponentType<P>,
  ): React.ComponentType<Omit<P, keyof TInjectedProps> & TNeedsProps>;
}

export function mapProps<TInner, TOutter>(
  propsMapper: mapper<TOutter, TInner>,
): InferableComponentEnhancerWithProps<TInner, TOutter>;

export function withProps<TInner, TOutter>(
  createProps: TInner | mapper<TOutter, TInner>,
): InferableComponentEnhancerWithProps<TInner & TOutter, TOutter>;
