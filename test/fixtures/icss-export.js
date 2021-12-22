import {stylesheet}  from 'astroturf';

const styles = stylesheet`
  :export {
    foo: bar;
  }

  @value quz: baz;

  @export {
    baz: 1px
  }
`