export default interpolations =>
  Array.from(interpolations, ({ expr: _, ...i }) => i);
