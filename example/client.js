import React from 'react';
import ReactDOM from 'react-dom';
import { styled } from 'css-literal-loader/styled';

// prettier-ignore
const Button = styled('a')`
  border-radius: 3px;
  padding: 0.25em 1em;
  margin: 0 1em;
  background: transparent;
  color: palevioletred;
  border: 2px solid palevioletred;

  ${props => props.primary && css`
    background: palevioletred;
    color: white;
  `}
`;

class App extends React.Component {
  render() {
    return (
      <div>
        <Button>Styled button</Button>
        <Button primary>Primary button</Button>
      </div>
    );
  }
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
