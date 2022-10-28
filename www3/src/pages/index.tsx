import { css } from 'astroturf/react';
import React from 'react';

import logo from '../assets/logo.svg';
import Button from '@site/src/components/Button';

function HomePage() {
  return (
    <div>
      <section className="mx-auto container flex flex-col space-y-6 items-center">
        <img
          src={logo}
          alt="astroturf: Better styling through compiling"
          className="mx-auto mt-16"
          css={css`
            max-width: 32rem;
            width: 100%;
            object-fit: contain;
          `}
        />
        <nav className="flex text-2xl space-x-8">
          <Button href="introduction">Docs</Button>
          <Button href="https://github.com/4Catalyzer/astroturf">
            Github
          </Button>
        </nav>
      </section>
    </div>
  );
}

export default HomePage;
