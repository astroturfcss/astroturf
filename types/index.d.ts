// TypeScript Version: 3.0

declare module 'astroturf' {
  import * as React from 'react';

  type JSXInEl = JSX.IntrinsicElements;

  type StyledPropsOf<
    Tag extends React.ComponentType<any>
  > = Tag extends React.SFC<infer Props>
    ? Props & React.Attributes
    : Tag extends React.ComponentClass<infer Props>
      ? (Tag extends new (...args: any[]) => infer Instance
          ? Props & React.ClassAttributes<Instance>
          : never)
      : never;

  type StyledOmit<T, U> = Pick<T, Exclude<keyof T, U>>;
  type Overwrapped<T, U> = Pick<T, Extract<keyof T, keyof U>>;

  type mapper<TInput, TProps> = (input: TInput) => TProps;

  export interface StyledOptions<TInputProps, TProps> {
    allowAs?: boolean;
    mapProps?: mapper<TInputProps, TProps>;
  }

  interface StyledOptionsNoInput<TProps> extends StyledOptions<any, TProps> {}

  export interface StyledComponent<InnerProps, StyleProps>
    extends React.SFC<InnerProps & StyleProps> {
    /**
     * @desc this method is type-unsafe
     */
    withComponent<NewTag extends keyof JSXInEl>(
      tag: NewTag,
    ): StyledComponent<JSXInEl[NewTag], StyleProps>;
    withComponent<Tag extends React.ComponentType<any>>(
      tag: Tag,
    ): StyledComponent<StyledPropsOf<Tag>, StyleProps>;
  }

  type ReactClassPropKeys = keyof React.ClassAttributes<any>;

  interface CreateStyledComponentBase<InnerProps, ExtraProps, InjectedProps> {
    <
      StyleProps extends StyledOmit<
        Overwrapped<InnerProps, StyleProps>,
        ReactClassPropKeys & InjectedProps
      > = StyledOmit<
        InnerProps & ExtraProps,
        ReactClassPropKeys & InjectedProps
      >
    >(
      ...styles: any[]
    ): StyledComponent<InnerProps, StyleProps>;
    <
      StyleProps extends StyledOmit<
        Overwrapped<InnerProps, StyleProps>,
        ReactClassPropKeys & InjectedProps
      > = StyledOmit<
        InnerProps & ExtraProps,
        ReactClassPropKeys & InjectedProps
      >
    >(
      template: TemplateStringsArray,
      ...styles: any[]
    ): StyledComponent<InnerProps, StyleProps>;
  }
  interface CreateStyledComponentIntrinsic<
    Tag extends keyof JSXInEl,
    ExtraProps,
    InjectedProps
  >
    extends CreateStyledComponentBase<
        JSXInEl[Tag],
        ExtraProps,
        InjectedProps
      > {}

  interface CreateStyledComponentExtrinsic<
    Tag extends React.ComponentType<any>,
    ExtraProps,
    InjectedProps
  >
    extends CreateStyledComponentBase<
        StyledPropsOf<Tag>,
        ExtraProps,
        InjectedProps
      > {}

  export type StyledTags = {
    readonly [P in keyof JSXInEl]: CreateStyledComponentIntrinsic<P, {}, {}>
  };

  /**
   * @desc
   * This function accepts `InnerProps`/`Tag` to infer the type of `tag`,
   * and accepts `ExtraProps` for user who use string style
   * to be able to declare extra props without using
   * `` styled('button')<ExtraProps>`...` ``, which does not supported in
   * styled-component VSCode extension.
   * If your tool support syntax highlighting for `` styled('button')<ExtraProps>`...` ``
   * it could be more efficient.
   */
  export interface CreateStyled extends StyledTags {
    <Tag extends React.ComponentType<any>, ExtraProps>(
      tag: Tag,
      options?: StyledOptions<StyledPropsOf<Tag> & ExtraProps, {}>,
    ): CreateStyledComponentExtrinsic<Tag, ExtraProps, {}>;
    <
      Tag extends React.ComponentType<any>,
      ExtraProps,
      InjectedProps extends StyledPropsOf<Tag> & ExtraProps
    >(
      tag: Tag,
      options?: StyledOptions<StyledPropsOf<Tag> & ExtraProps, InjectedProps>,
    ): CreateStyledComponentExtrinsic<Tag, ExtraProps, InjectedProps>;

    <Tag extends keyof JSXInEl, ExtraProps>(
      tag: Tag,
      options?: StyledOptions<JSXInEl[Tag] & ExtraProps, {}>,
    ): CreateStyledComponentIntrinsic<Tag, ExtraProps, {}>;

    <
      Tag extends keyof JSXInEl,
      ExtraProps,
      InjectedProps extends JSXInEl[Tag] & ExtraProps
    >(
      tag: Tag,
      options?: StyledOptions<JSXInEl[Tag] & ExtraProps, InjectedProps>,
    ): CreateStyledComponentIntrinsic<Tag, ExtraProps, InjectedProps>;
  }

  export function css(
    template: TemplateStringsArray,
    ...args: any[]
  ): { [className: string]: string };

  const styled: CreateStyled;

  export default styled;
}
