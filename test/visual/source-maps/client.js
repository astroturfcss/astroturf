import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'astroturf'; // eslint-disable-line import/no-extraneous-dependencies

const RedButton = styled('button')`
  @import './foo.css';

  color: red;
  text-transform: uppercase;
`;

function App() {
  return (
    <div>
      <RedButton>Red Button</RedButton>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
