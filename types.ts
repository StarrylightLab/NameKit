
export enum ElementType {
  COMPONENT = 'COMPONENT',
  STYLE = 'STYLE',
  VARIABLE = 'VARIABLE'
}

export enum Scope {
  CURRENT_PAGE = 'CURRENT_PAGE',
  ALL_PAGES = 'ALL_PAGES'
}

export enum NamingTab {
  FORMAT = 'FORMAT',
  REPLACE = 'REPLACE'
}

export enum CaseFormat {
  CAMEL = 'camelCase',
  SNAKE = 'snake_case',
  KEBAB = 'kebab-case',
  TITLE = 'Title Case',
  PASCAL = 'PascalCase',
  UPPER = 'UPPER_CASE',
  NONE = 'none'
}

export type NamingTarget = 
  | 'nodeName' | 'propName' | 'propValue' 
  | 'textStyle' | 'colorStyle' | 'effectStyle' | 'gridStyle' 
  | 'colorVar' | 'stringVar' | 'boolVar' | 'numberVar';

export interface PreviewProperty {
  id: string;
  name: { original: string; processed: string };
  value?: { original: string; processed: string };
}

export interface PreviewItem {
  id: string;
  type: 'COMP' | 'SET' | 'STYLE' | 'VAR';
  subType?: string;
  pageName: string;
  elementName: { original: string; processed: string };
  properties: PreviewProperty[];
  nodeType: string;
}
