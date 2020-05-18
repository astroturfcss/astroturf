import styled, { css } from 'astroturf/react';
import React from 'react';
import { render } from 'react-dom';

import Button, { styles as btnStyles } from './Button';
import greeting from './unrelated';

const mixins = css`
  display: block;
`;

const BlockStyled = styled.span`
  composes: ${btnStyles.cool};

  color: red;

  @at-root {
    .active {
      composes: ${mixins};
    }
  }
`;

const div = document.createElement('div');
document.body.appendChild(div);

render(
  <div>
    {'Hey '}
    <BlockStyled block>there</BlockStyled>
    <Button>button</Button>
  </div>,
  div,
);
