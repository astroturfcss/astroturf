import { css } from 'astroturf';

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
