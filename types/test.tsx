// TypeScript Version: 3.0

import * as React from 'react';
import styled, { css } from 'astroturf';

import { mapProps, withProps } from 'astroturf/helpers';

// $ExpectType StyledFunction<"a", {}>
styled.a;
// $ExpectType StyledFunction<"body", {}>
styled.body;
// $ExpectType StyledFunction<"div", {}>
styled.div;
// $ExpectType StyledFunction<"svg", {}>
styled.svg;

// tslint:disable-next-line:interface-over-type-literal
type ReactClassProps0 = {
  readonly column: boolean;
};

declare class ReactClassComponent0 extends React.Component<ReactClassProps0> {}

interface ReactClassProps1 {
  readonly value: string;
}
declare class ReactClassComponent1 extends React.Component<ReactClassProps1> {}

interface ReactClassProps2 {
  readonly column: number;
}
declare class ReactClassComponent2 extends React.Component<ReactClassProps2> {}

// tslint:disable-next-line: interface-over-type-literal
type ReactSFCProps0 = {
  readonly column: boolean;
};
declare const ReactSFC0: React.SFC<ReactSFCProps0>;

interface ReactSFCProps1 {
  readonly value: string;
}
declare const ReactSFC1: React.SFC<ReactSFCProps1>;

interface ReactSFCProps2 {
  readonly value: number;
}
declare const ReactSFC2: React.SFC<ReactSFCProps2>;

const Button0 = styled('button')`
  color: blue;
`;
const Button1 = styled('button')({
  color: 'blue',
});
<div>
  <Button0 />
  <Button0 type="button" />
</div>;
<div>
  <Button1 />
  <Button1 type="button" />
</div>;

const Input0 = styled('input', {
  allowAs: true,
})`
  padding: 4px;
`;

<Input0 />;

interface PrimaryProps {
  readonly primary: boolean;
}
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
const Button2 = styled<'button', PrimaryProps>('button')`
  font-size: ${5}px;

  &.primary {
    color: red;
  }
`;

<div>
  <Button2 primary />
  <Button2 primary type="button" />
</div>;

// missing primary
<Button2 />; // $ExpectError

// missing primary
<Button2 type="button" />; // $ExpectError

const Button4 = styled<typeof ReactClassComponent0>(ReactClassComponent0)<
  PrimaryProps
>``;

const Button5 = styled<typeof ReactSFC0>(ReactSFC0)<PrimaryProps>``;
<div>
  <Button4 column={true} primary />
  <Button4 column={false} primary />
</div>;
<div>
  <Button5 column={true} primary />
  <Button5 column={false} primary />
</div>;

// missing primary, column
<Button4 />; // $ExpectError

// - missing primary
<Button4 column={true} />; // $ExpectError

// - missing primary, column
<Button5 />; // $ExpectError

// - missing primary
<Button5 column={true} />; // $ExpectError

const Container0 = styled(ReactClassComponent0)``;
<Container0 column={false} />;

// column missing
<Container0 />; // $ExpectError

const Container1 = Container0.withComponent('span');
<Container1 onClick={undefined as any} />;

// not a valid span attribute
<Container1 href="foo" />; // $ExpectError

const Container2 = Container0.withComponent(ReactSFC0);
<Container2 column={true} />;

// column missing
<Container2 />; // $ExpectError

const Container3 = Container0.withComponent(ReactClassComponent1);
<Container3 value="123" />;

// value is a string
<Container3 value={5} />; // $ExpectError

// value is not a number
<Container3 value={5} />; // $ExpectError

interface ContainerProps {
  extraWidth: string;
}
const Container4 = styled(ReactSFC2)<ContainerProps>``;

<Container4 extraWidth="20px" value={123} />;

// value missing
<Container4 />; // $ExpectError

// value is not a string
<Container4 value="5" />; // $ExpectError

const Container5 = Container3.withComponent(ReactSFC2);
<Container5 value={123} />;

// value missing
<Container5 />; // $ExpectError

// column not assignable
<Container5 column={true} />; // $ExpectError

const StyledClass0 = styled(ReactClassComponent0)``;
declare const ref0_0: (element: ReactClassComponent0 | null) => void;
declare const ref0_1: (element: ReactClassComponent1 | null) => void;
declare const ref0_2: (element: HTMLDivElement | null) => void;
<StyledClass0 column={true} ref={ref0_0} />;

// wrong ref types
<StyledClass0 column={true} ref={ref0_1} />; // $ExpectError
<StyledClass0 column={true} ref={ref0_2} />; // $ExpectError

const StyledClass1 = StyledClass0.withComponent(ReactClassComponent1);
declare const ref1_0: (element: ReactClassComponent1 | null) => void;
declare const ref1_1: (element: ReactClassComponent0 | null) => void;
declare const ref1_2: (element: HTMLDivElement | null) => void;

<StyledClass1 value="" ref={ref1_0} />;

// wrong ref types
<StyledClass1 value="" ref={ref1_1} />; // $ExpectError
<StyledClass1 value="" ref={ref1_2} />; // $ExpectError

const StyledClass2 = StyledClass0.withComponent('div');
declare const ref2_0: (element: HTMLDivElement | null) => void;
declare const ref2_1: (element: ReactClassComponent0 | null) => void;
declare const ref2_2: (element: ReactClassComponent1 | null) => void;

<StyledClass2 ref={ref2_0} />;
// wrong ref types
<StyledClass2 ref={ref2_1} />; // $ExpectError
<StyledClass2 ref={ref2_2} />; // $ExpectError

const StyledClass3 = StyledClass1.withComponent('label');
declare const ref3_0: (element: HTMLLabelElement | null) => void;
declare const ref3_1: (element: ReactClassComponent0 | null) => void;
declare const ref3_2: (element: HTMLDivElement | null) => void;
<StyledClass3 ref={ref3_0} />;

// wrong ref types
<StyledClass3 ref={ref3_1} />; // $ExpectError
<StyledClass3 ref={ref3_2} />; // $ExpectError

const AsComponent1 = styled('input')``;

<AsComponent1 value="" />;
// href not assignable
<AsComponent1 value="" href="a" />; // $ExpectError

<AsComponent1<'a'> as="a" href="#" />;
<AsComponent1<'a'> as="a" size="4" />; // $ExpectError

{
  interface InnerProps {
    inn: number;
    other: string;
  }
  interface OutterProps {
    out: string;
  }
  const InnerComponent = ({ inn }: InnerProps) => <div>{inn}</div>;

  const enhancer = mapProps((props: OutterProps) => ({ inn: 123 }));
  const Enhanced = enhancer(InnerComponent);

  <Enhanced other="foo" out="bar" />;
}

{
  interface InnerProps {
    inn: number;
    other?: string;
  }
  interface OutterProps {
    out: number;
  }
  const InnerComponent = ({ inn }: InnerProps) => <div>{inn}</div>;

  const enhancer = withProps((props: OutterProps) => ({ inn: props.out }));
  const Enhanced = enhancer(InnerComponent);
  <Enhanced out={123} />;

  const enhancer2 = withProps({ inn: 123 });
  const Enhanced2 = enhancer2(InnerComponent);

  <Enhanced2 other="1" />;
  <InnerComponent inn={23} other="1" />;

  // inn not assignable
  <Enhanced2 inn={124} />; // $ExpectError
}

css`
  .color {
    color: red;
  }
`;
