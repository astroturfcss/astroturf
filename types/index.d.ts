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

  export interface StyledOptions {
    allowAs?: boolean;
  }

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

  interface CreateStyledComponentBase<InnerProps, ExtraProps> {
    <
      StyleProps extends StyledOmit<
        Overwrapped<InnerProps, StyleProps>,
        ReactClassPropKeys
      > = StyledOmit<InnerProps & ExtraProps, ReactClassPropKeys>
    >(
      ...styles: any[]
    ): StyledComponent<InnerProps, StyleProps>;
    <
      StyleProps extends StyledOmit<
        Overwrapped<InnerProps, StyleProps>,
        ReactClassPropKeys
      > = StyledOmit<InnerProps & ExtraProps, ReactClassPropKeys>
    >(
      template: TemplateStringsArray,
      ...styles: any[]
    ): StyledComponent<InnerProps, StyleProps>;
  }
  interface CreateStyledComponentIntrinsic<
    Tag extends keyof JSXInEl,
    ExtraProps
  > extends CreateStyledComponentBase<JSXInEl[Tag], ExtraProps> {}

  interface CreateStyledComponentExtrinsic<
    Tag extends React.ComponentType<any>,
    ExtraProps
  > extends CreateStyledComponentBase<StyledPropsOf<Tag>, ExtraProps> {}

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
  export interface CreateStyled {
    <Tag extends React.ComponentType<any>, ExtraProps = {}>(
      tag: Tag,
      options?: StyledOptions,
    ): CreateStyledComponentExtrinsic<Tag, ExtraProps>;

    <Tag extends keyof JSXInEl, ExtraProps = {}>(
      tag: Tag,
      options?: StyledOptions,
    ): CreateStyledComponentIntrinsic<Tag, ExtraProps>;
  }

  export function css(
    template: TemplateStringsArray,
    ...args: any[]
  ): { [className: string]: string };

  const styled: CreateStyled;

  export default styled;
}
