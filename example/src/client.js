import { css } from 'astroturf'; // eslint-disable-line import/no-extraneous-dependencies
import React from 'react';
import ReactDOM from 'react-dom';

import Button from './Button';
import ComposedButton from './ComposedButton';

// import 'bootstrap/scss/bootstrap-reboot.scss';

const _ = css`
  html,
  body {
    margin: 0;
  }
`;

function App() {
  return (
    <div>
      <Button theme="secondary">Styled button</Button>
      <Button theme="primary">Primary button</Button>
      <Button theme="secondary" bold size={2}>
        Big bold button
      </Button>
      <ComposedButton theme="primary">Composed Button</ComposedButton>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
