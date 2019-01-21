import * as React from 'react';

export type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;

export interface InferableComponentEnhancerWithProps<
  TInjectedProps,
  TNeedsProps
> {
  <P extends TInjectedProps>(
    component: React.ComponentType<P>,
  ): React.ComponentType<Omit<P, keyof TInjectedProps> & TNeedsProps>;
}

export function mapProps<TInner, TOutter>(
  propsMapper: (input: TInner) => TOutter,
): InferableComponentEnhancerWithProps<TInner, TOutter>;

export function withProps<TInner, TOutter>(
  createProps: TInner | ((input: TInner) => TOutter),
): InferableComponentEnhancerWithProps<TInner & TOutter, TOutter>;

export function defaultProps<TDefaultProps = {}>(
  props: TDefaultProps,
): InferableComponentEnhancerWithProps<TDefaultProps, Partial<TDefaultProps>>;
