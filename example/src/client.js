import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/scss/bootstrap-reboot.scss';

import Button from './Button';

// eslint-disable-next-line no-unused-expressions
css`
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
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
