import { css } from 'astroturf/react';
import React from 'react';

import logo from '../assets/logo.svg';
import Button from '../components/Button';

function HomePage() {
  return (
    <div>
      <section className="mx-auto container flex flex-col space-y-6 items-center">
        <img
          src={logo}
          alt="astroturf: Better styling through compiling"
          css={css`
            composes: mx-auto, mt-16 from global;

            max-width: 32rem;
            width: 100%;
            object-fit: contain;
          `}
        />
        <nav className="flex text-2xl space-x-8">
          <Button href="getting-started">Docs</Button>
          <Button href="https://github.com/4Catalyzer/astroturf">
            Github
          </Button>
        </nav>
      </section>
    </div>
  );
}

export default HomePage;
