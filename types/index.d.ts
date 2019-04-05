// TypeScript Version: 3.0

// changed from: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/styled-components

// tslint:disable-next-line:no-single-declare-module
declare module 'astroturf' {
  import * as React from 'react';

  // Any prop that has a default prop becomes optional, but its type is unchanged
  // Undeclared default props are augmented into the resulting allowable attributes
  // If declared props have indexed properties, ignore default props entirely as keyof gets widened
  // Wrap in an outer-level conditional type to allow distribution over props that are unions
  type Defaultize<P, D> = P extends any
    ? string extends keyof P
      ? P
      : Pick<P, Exclude<keyof P, keyof D>> &
          Partial<Pick<P, Extract<keyof P, keyof D>>> &
          Partial<Pick<D, Exclude<keyof D, keyof P>>>
    : never;

  type ReactDefaultizedProps<C, P> = C extends { defaultProps: infer D }
    ? Defaultize<P, D>
    : P;

  export type StyledComponentProps<
    // The Component from whose props are derived
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    // The other props added by the template
    O extends object
  > = ReactDefaultizedProps<C, React.ComponentPropsWithRef<C>> &
    O &
    Partial<React.ComponentPropsWithRef<C> & O> &
    WithChildrenIfReactComponentClass<C>;

  // Because of React typing quirks, when getting props from a React.ComponentClass,
  // we need to manually add a `children` field.
  // See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/31945
  // and https://github.com/DefinitelyTyped/DefinitelyTyped/pull/32843
  type WithChildrenIfReactComponentClass<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>
  > = C extends React.ComponentClass<any>
    ? { children?: React.ReactNode }
    : {};

  type StyledComponentPropsWithAs<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    O extends object
  > = StyledComponentProps<C, O> & { as?: C };

  // abuse Pick to strip the call signature from ForwardRefExoticComponent
  type ForwardRefExoticBase<P> = Pick<
    React.ForwardRefExoticComponent<P>,
    keyof React.ForwardRefExoticComponent<any>
  >;

  export interface StyledComponent<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    O extends object = {}
  > extends ForwardRefExoticBase<StyledComponentProps<C, O>> {
    // add our own fake call signature to implement the polymorphic 'as' prop
    // NOTE: TS <3.2 will refuse to infer the generic and this component becomes impossible to use in JSX
    // just the presence of the overload is enough to break JSX
    //
    // TODO (TypeScript 3.2): actually makes the 'as' prop polymorphic
    (props: StyledComponentProps<C, O> & { as?: never }): React.ReactElement<
      StyledComponentProps<C, O>
    >;
    <AsC extends keyof JSX.IntrinsicElements | React.ComponentType<any> = C>(
      props: StyledComponentPropsWithAs<AsC, O>,
    ): React.ReactElement<StyledComponentPropsWithAs<AsC, O>>;

    withComponent<
      WithC extends keyof JSX.IntrinsicElements | React.ComponentType<any>
    >(
      component: WithC,
    ): StyledComponent<WithC, O>;
  }

  export interface StyledFunction<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    O extends object = {}
  > {
    (...rest: any[]): StyledComponent<C, O>;
    // tslint:disable-next-line:no-unnecessary-generics
    <U extends object>(...rest: any[]): StyledComponent<C, O & U>;
  }

  export type StyledTags = {
    readonly [TTag in keyof JSX.IntrinsicElements]: StyledFunction<TTag>
  };

  export type StyledComponentPropsWithRef<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>
  > = React.ComponentPropsWithRef<C>;

  export interface StyledOptions {
    allowAs?: boolean;
  }

  export interface CreateStyled extends StyledTags {
    <C extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(
      component: C,
      options?: StyledOptions,
    ): StyledFunction<C>;

    <
      C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
      OtherProps extends object
    >(
      component: C,
      options?: StyledOptions,
    // tslint:disable-next-line:no-unnecessary-generics
    ): StyledFunction<C, OtherProps>;
  }

  export function css(
    template: TemplateStringsArray,
    ...args: any[]
  ): { [className: string]: string };

  const styled: CreateStyled;

  export default styled;
}
