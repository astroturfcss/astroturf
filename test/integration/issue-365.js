import styled, { css } from 'astroturf';

const mixins = css`
  .show {
    display: block;
  }
`;

const Block = <BlockStyled active={false} />;

const BlockStyled = styled.div`
  color: red;

  @at-root {
    .active {
      composes: ${mixins.show};
    }
  }
`;
