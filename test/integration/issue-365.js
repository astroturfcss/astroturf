import styled, { css } from 'astroturf/react';

const mixins = css`
  display: block;
`;

const Block = <BlockStyled active={false} />;

const BlockStyled = styled.div`
  color: red;

  @at-root {
    .active {
      composes: ${mixins};
    }
  }
`;
