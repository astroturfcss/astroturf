import styled from 'astroturf/react'; // eslint-disable-line import/no-extraneous-dependencies

const Button = styled('button')`
  @import './styles/mixins.scss';

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

  &.theme-primary {
    @include button-variant(white, #33ad13, #298f0f);
    color: blue;
  }

  &.theme-secondary {
    @include button-variant(#33ad13, white, white);
  }

  &.bold {
    font-weight: bold;
  }

  &.size-2 {
    font-size: 24px;
    line-height: calc(4rem - 2px);
  }
`;

export default Button;
