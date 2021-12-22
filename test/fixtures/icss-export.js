import {stylesheet}  from 'astroturf';

const styles = stylesheet`
  :export {
    foo: bar;
  }

  @value bar: baz;

  @export {
    baz: 1px
  }
`