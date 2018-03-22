import React from 'react';
import { styled, css } from 'css-literal-loader/styled'; // eslint-disable-line

// prettier-ignore
const ButtonBase = styled('button')`
  @import '~./styles/mixins.scss';

  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  margin-bottom: 0;
  line-height: calc(3rem - 2px);
  padding: 0 0.4rem;
  border-radius: 2px;
  font-weight: normal;
  font-size: 16px;
  touch-action: manipulation;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;

  ${p => p.theme === 'primary' && css`
    @include button-variant(white, #33ad13, #298f0f);
  `}

  ${p => p.theme === 'secondary' && css`
    @include button-variant(#33ad13, white, white);
  `}
`;

function Button(props) {
  return <ButtonBase {...props} />;
}

export default Button;
