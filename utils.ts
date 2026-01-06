
import { CaseFormat } from './types';

export const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
};

export const toSnakeCase = (str: string) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('_') || str;
};

export const toKebabCase = (str: string) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('-') || str;
};

export const toTitleCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

export const toPascalCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '');
};

export const toUpperCase = (str: string) => {
  return str.toUpperCase().replace(/\s+/g, '_');
};

export const formatName = (name: string, format: CaseFormat): string => {
  if (format === CaseFormat.NONE || !name) return name;
  switch (format) {
    case CaseFormat.CAMEL: return toCamelCase(name);
    case CaseFormat.SNAKE: return toSnakeCase(name);
    case CaseFormat.KEBAB: return toKebabCase(name);
    case CaseFormat.TITLE: return toTitleCase(name);
    case CaseFormat.PASCAL: return toPascalCase(name);
    case CaseFormat.UPPER: return toUpperCase(name);
    default: return name;
  }
};

export const applyReplace = (name: string, from: string, to: string, useRegex: boolean, caseSensitive: boolean): string => {
  if (!from) return name;
  try {
    const flags = caseSensitive ? 'g' : 'gi';
    const pattern = useRegex ? from : from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(pattern, flags);
    return name.replace(regex, to);
  } catch (e) {
    return name;
  }
};
