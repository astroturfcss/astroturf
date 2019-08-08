// TypeScript Version: 3.0

// changed from: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/styled-components

import * as React from 'react';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

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
  O extends object,
  // The props that are made optional by .attrs
  A extends keyof any
> = Omit<ReactDefaultizedProps<C, React.ComponentPropsWithRef<C>> & O, A> &
  Partial<Pick<React.ComponentPropsWithRef<C> & O, A>> &
  WithChildrenIfReactComponentClass<C>;

// Because of React typing quirks, when getting props from a React.ComponentClass,
// we need to manually add a `children` field.
// See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/31945
// and https://github.com/DefinitelyTyped/DefinitelyTyped/pull/32843
type WithChildrenIfReactComponentClass<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = C extends React.ComponentClass<any> ? { children?: React.ReactNode } : {};

type StyledComponentPropsWithAs<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  O extends object,
  A extends keyof any
> = StyledComponentProps<C, O, A> & { as?: C };

// abuse Pick to strip the call signature from ForwardRefExoticComponent
type ForwardRefExoticBase<P> = Pick<
  React.ForwardRefExoticComponent<P>,
  keyof React.ForwardRefExoticComponent<any>
>;

export interface StyledComponent<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  O extends object = {},
  A extends keyof any = never
> extends ForwardRefExoticBase<StyledComponentProps<C, O, A>> {
  // add our own fake call signature to implement the polymorphic 'as' prop
  // NOTE: TS <3.2 will refuse to infer the generic and this component becomes impossible to use in JSX
  // just the presence of the overload is enough to break JSX
  //
  // TODO (TypeScript 3.2): actually makes the 'as' prop polymorphic
  (props: StyledComponentProps<C, O, A> & { as?: never }): React.ReactElement<
    StyledComponentProps<C, O, A>
  >;
  <AsC extends keyof JSX.IntrinsicElements | React.ComponentType<any> = C>(
    props: StyledComponentPropsWithAs<AsC, O, A>,
  ): React.ReactElement<StyledComponentPropsWithAs<AsC, O, A>>;

  withComponent<
    WithC extends keyof JSX.IntrinsicElements | React.ComponentType<any>
  >(
    component: WithC,
  ): StyledComponent<WithC, O>;
}

export type StyledComponentPropsWithRef<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = React.ComponentPropsWithRef<C>;

type Attrs<P, A extends Partial<P>> = ((props: P) => A) | A;

export interface StyledFunction<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  O extends object = {},
  A extends keyof any = never
> {
  (...rest: any[]): StyledComponent<C, O, A>;
  // tslint:disable-next-line:no-unnecessary-generics
  <U extends object>(...rest: any[]): StyledComponent<C, O & U, A>;

  attrs<
    U extends object,
    NewA extends Partial<StyledComponentPropsWithRef<C> & U> & {
      [others: string]: any;
    } = Partial<StyledComponentPropsWithRef<C> & U>
  >(
    provideProps: Attrs<
      ReactDefaultizedProps<C, React.ComponentPropsWithRef<C>> & U,
      NewA
    >,
  ): StyledFunction<C, O & NewA, A | keyof NewA>;
}

export type StyledTags = {
  readonly [TTag in keyof JSX.IntrinsicElements]: StyledFunction<TTag>;
};

export interface StyledOptions {
  allowAs?: boolean;
}

export type mapper<TInner, TOuter> = (input: TInner) => TOuter;

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
  ): StyledFunction<C, OtherProps>; // tslint:disable-line:no-unnecessary-generics
}

declare const styled: CreateStyled;

export function css(
  template: TemplateStringsArray,
  ...args: any[]
): Record<string, string>;

export default styled;

declare module 'react' {
  interface DOMAttributes<T> {
    css?: string | Record<string, string>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: string | Record<string, string>;
    }
  }
}
