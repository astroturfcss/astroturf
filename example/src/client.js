import { css } from 'astroturf'; // eslint-disable-line import/no-unresolved
import React from 'react';
import ReactDOM from 'react-dom';

import Button from './Button';
import ButtonToolbar from './ButtonToolbar';
import ComposedButton from './ComposedButton';
import { List, ListItem } from './List';

// import 'bootstrap/scss/bootstrap-reboot.scss';

const _ = css`
  html,
  body {
    margin: 0;
  }
`;

function App() {
  return (
    <>
      <List>
        <ListItem>hey</ListItem>
      </List>
      <ButtonToolbar>
        <Button theme="secondary">Styled button</Button>
        <Button theme="primary">Primary button</Button>
        <Button theme="secondary" bold size={2}>
          Big bold button
        </Button>
        <ComposedButton theme="primary">Composed Button</ComposedButton>
      </ButtonToolbar>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
