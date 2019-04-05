// TypeScript Version: 3.0

import * as React from 'react';

export type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;

export type mapper<TInner, TOuter> = (input: TInner) => TOuter;

export interface InferableComponentEnhancerWithProps<
  TInjectedProps,
  TNeedsProps
> {
  <P extends TInjectedProps>(
    component: React.ComponentType<P>,
  ): React.ComponentType<Omit<P, keyof TInjectedProps> & TNeedsProps>;
}

export function mapProps<TInner, TOuter>(
  propsMapper: mapper<TOuter, TInner>,
): InferableComponentEnhancerWithProps<TInner, TOuter>;

export function withProps<TInner, TOuter>(
  createProps: TInner | mapper<TOuter, TInner>,
): InferableComponentEnhancerWithProps<TInner & TOuter, TOuter>;
