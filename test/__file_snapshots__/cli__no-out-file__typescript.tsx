
const _styles = {
  "foo": "mcd8ce0bb3_foo",
  "bar": "mcd8ce0bb3_foo mcd8ce0bb3_bar"
};

const _Button = {
  "cls1": "mc17ec701a_cls1",
  "cls2": "mc17ec701a_cls1 mc17ec701a_cls2",
  "variant-primary": "mc17ec701a_variant-primary",
  "variant-secondary": "mc17ec701a_variant-secondary"
};

const _CssProp1_Button = {
  "cls1": "mc4c29ab1f_cls1",
  "cls2": "mc4c29ab1f_cls1 mc4c29ab1f_cls2"
};

const _CssProp2_Button = {
  "cls1": "mc2fdd70ce_cls1",
  "cls2": "mc2fdd70ce_cls1 mc2fdd70ce_cls2"
};
/** @jsxRuntime classic*/
/** @jsx _j */
/** @jsxFrag _j.F */

import _j from "astroturf/jsx";
import styled from 'astroturf/react'
import React from 'react';
import "./typescript-styles.css";
import "./typescript-Button.css";
import "./typescript-CssProp1_Button.css";
import "./typescript-CssProp2_Button.css";


const SIZE = 75;

const styles = _styles;

interface PropsType {
  children: JSX.Element;
  name: string;
}

function someMath<T extends { x: number }>(obj: T): T {
  console.log(Math.abs(obj.x));
  return obj as T;
}

const Button = /*#__PURE__*/styled('button', null, {
  displayName: "Button",
  styles: _Button
});

class Component extends React.Component<PropsType> {
  render() {
    return (
      <>
        <h2>{this.props.children}</h2>
        <Button
          variant="primary"
          css={[_CssProp1_Button]}
        >
          click
        </Button>
        <Button
          variant="secondary"
          css={[_CssProp2_Button]}
        >
          cancel
        </Button>
      </>
    );
  }
}
