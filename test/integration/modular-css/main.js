import styled, { css, stylesheet } from 'astroturf/react';
import React from 'react';
import Widget from 'widget';

const width = 75;

const styles = stylesheet`
  .parent {
    color: red;
  }

  .test > ${Widget} {
    holla: yo;
  }
`;
