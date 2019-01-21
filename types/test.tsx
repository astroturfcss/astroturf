// TypeScript Version: 3.0

import React from 'react';
import styled from 'astroturf';

import { defaultProps, mapProps, withProps } from 'astroturf/helpers';

// $ExpectType CreateStyledComponentIntrinsic<"a", {}>
styled.a;
// $ExpectType CreateStyledComponentIntrinsic<"body", {}>
styled.body;
// $ExpectType CreateStyledComponentIntrinsic<"div", {}>
styled.div;
// $ExpectType CreateStyledComponentIntrinsic<"svg", {}>
styled.svg;

// tslint:disable-next-line: interface-over-type-literal
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
const Input2 = Button0.withComponent('input');

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

// $ExpectError
<Button2 />;
// $ExpectError
<Button2 type="button" />;

const Button4 = styled<typeof ReactClassComponent0, PrimaryProps>(
  ReactClassComponent0,
)``;

const Button5 = styled<typeof ReactSFC0, PrimaryProps>(ReactSFC0)``;
<div>
  <Button4 column={true} primary />
  <Button4 column={false} primary />
</div>;
<div>
  <Button5 column={true} primary />
  <Button5 column={false} primary />
</div>;
// $ExpectError
<Button4 />;
// $ExpectError
<Button4 colume={true} />;
// $ExpectError
<Button5 />;
// $ExpectError
<Button5 colume={true} />;

const Container0 = styled(ReactClassComponent0)``;
<Container0 column={false} />;

// $ExpectError
<Container0 />;

const Container1 = Container0.withComponent('span');
<Container1 column={true} />;
<Container1 column={true} onClick={undefined as any} />;
// $ExpectError
<Container1 contentEditable />;

const Container2 = Container0.withComponent(ReactSFC0);
<Container2 column={true} />;
// $ExpectError
<Container2 />;

const Container3 = Container0.withComponent(ReactClassComponent1);
<Container3 column={false} value="123" />;
// $ExpectError
<Container3 colume={true} />;
// $ExpectError
<Container3 value="5" />;

interface ContainerProps {
  extraWidth: string;
}
const Container4 = styled(ReactSFC2)<ContainerProps>``;

<Container4 extraWidth="20px" value={123} />;
// $ExpectError
<Container4 />;
// $ExpectError
<Container4 value="5" />;

const Container5 = Container3.withComponent(ReactSFC2);
<Container5 column={true} value={123} />;
// $ExpectError
<Container5 />;
// $ExpectError
<Container5 column={true} />;
// $ExpectError
<Container5 value={242} />;

// $ExpectError
styled(ReactSFC2)<ReactSFCProps1>();

const StyledClass0 = styled(ReactClassComponent0)({});
declare const ref0_0: (element: ReactClassComponent0 | null) => void;
declare const ref0_1: (element: ReactClassComponent1 | null) => void;
declare const ref0_2: (element: HTMLDivElement | null) => void;
<StyledClass0 column={true} ref={ref0_0} />;
// $ExpectError
<StyledClass0 column={true} ref={ref0_1} />;
// $ExpectError
<StyledClass0 column={true} ref={ref0_2} />;

const StyledClass1 = StyledClass0.withComponent(ReactClassComponent1);
declare const ref1_0: (element: ReactClassComponent1 | null) => void;
declare const ref1_1: (element: ReactClassComponent0 | null) => void;
declare const ref1_2: (element: HTMLDivElement | null) => void;
<StyledClass1 column={true} value="" ref={ref1_0} />;
// $ExpectError
<StyledClass1 column={true} value="" ref={ref1_1} />;
// $ExpectError
<StyledClass1 column={true} value="" ref={ref1_2} />;

const StyledClass2 = StyledClass0.withComponent('div');
declare const ref2_0: (element: HTMLDivElement | null) => void;
declare const ref2_1: (element: ReactClassComponent0 | null) => void;
declare const ref2_2: (element: ReactClassComponent1 | null) => void;
<StyledClass2 column={true} ref={ref2_0} />;
// $ExpectError
<StyledClass2 column={true} ref={ref2_1} />;
// $ExpectError
<StyledClass2 column={true} ref={ref2_2} />;

const StyledClass3 = StyledClass1.withComponent('label');
declare const ref3_0: (element: HTMLLabelElement | null) => void;
declare const ref3_1: (element: ReactClassComponent0 | null) => void;
declare const ref3_2: (element: HTMLDivElement | null) => void;
<StyledClass3 column={true} ref={ref3_0} />;
// $ExpectError
<StyledClass3 column={true} ref={ref3_1} />;
// $ExpectError
<StyledClass3 column={true} ref={ref3_2} />;

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
  <Enhanced2 />;
  // $ExpectError
  <Enhanced2 inn={124} />;
}
{
  interface Props {
    a: string;
    b: number;
    c: number;
  }
  const innerComponent = ({ a, b }: Props) => (
    <div>
      {a}, {b}
    </div>
  );

  const enhancer = defaultProps({ a: 'answer', b: 42 });
  const Enhanced = enhancer(innerComponent);
  <Enhanced c={42} />;

  // $ExpectError
  <Enhanced />;
}
