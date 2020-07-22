declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: string | Record<string, string>;
    }
  }
}
declare module 'react' {
  interface DOMAttributes<T> {
    css?: string | Record<string, string>;
  }
}

export function css(template: TemplateStringsArray, ...args: any[]): string;

export function stylesheet(
  template: TemplateStringsArray,
  ...args: any[]
): Record<string, string>;
