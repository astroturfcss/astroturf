import truthy from './truthy';

const rComposes = /\b(?:composes\s*?:\s*([^;>]*?)(?:from\s(.+?))?(?=[;}/\n\r]))/gim;

export default function replaceComposes(
  text: string,
  replacer: (match: string, classList: string[], fromPart?: string) => string,
) {
  return text.replace(rComposes, (composes, classNames: string, fromPart) => {
    const classList = classNames
      .replace(/(\n|\r|\n\r)/, '')
      .split(/,?\s+/)
      .filter(truthy);

    return replacer(composes, classList, fromPart);
  });
}
