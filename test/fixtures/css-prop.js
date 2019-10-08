import { css } from 'astroturf';
import React from 'react';

function Button() {
  return (
    <button
      css={css`
        color: blue;
      `}
    />
  );
}

function Button2() {
  return <button css="color: violet;" />;
}

const color = 'orange';
function Button3() {
  return (
    <>
      <button
        css={`
          color: ${color};
        `}
      />
    </>
  );
}


function Button4({ theme }) {
  return React.createElement('button', {
    css: `
      color: ${theme};
    `
  }, 'Hi there', React.createElement('span', {
    css: 'width: 3rem;'
  }))
}

