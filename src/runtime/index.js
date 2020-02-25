export const stylesheet = () => {
  throw new Error(
    'stylesheet template literal evaluated at runtime. ' +
      'Make sure astroturf is properly configured to compile this file',
  );
};

export const css = () => {
  throw new Error(
    'css template literal evaluated at runtime. ' +
      'Make sure astroturf is properly configured to compile this file',
  );
};
