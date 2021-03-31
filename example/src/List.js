import styled from 'astroturf/react';

export const ListItem = styled('li')`
  list-style: none;
`;

export const List = styled('ul')`
  margin: 0;

  & > ${ListItem} {
    margin-left: 30px;
  }
`;
