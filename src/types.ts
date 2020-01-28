import { Node } from '@babel/types';
import * as T from '@babel/types';
// eslint-disable-next-line import/no-cycle
import StyleImportInjector from './utils/ImportInjector';

export interface ResolvedImport {
  identifier: string;
  request: string;
  type: string;
}

export interface UserInterpolation {
  source: string;
  imported?: string;
  isStyledComponent?: boolean;
}

export type DependencyResolver = (
  interpolation: ResolvedImport,
  localStyle: Style,
  node: T.Expression,
) => UserInterpolation | null;

export interface ResolvedOptions {
  writeFiles: boolean;
  allowGlobal: boolean;

  cssTagName: string;
  styledTagName: string;
  stylesheetTagName: string;

  enableCssProp: boolean;
  noWarnings?: boolean;
  resolveDependency?: DependencyResolver;
  generateInterpolations?: boolean;
  customCssProperties: 'cssProp' | boolean;
  extension: string;
  getFileName?: (
    hostFile: string,
    opts: ResolvedOptions,
    id?: string,
  ) => string;
}

export interface BaseStyle {
  start: number;
  end: number;
  absoluteFilePath: string;
  relativeFilePath: string;
  identifier: string;
  value: string;
  code?: string;
}

export interface StaticStyle extends BaseStyle {
  isStyledComponent: false;
}

export interface DynamicStyle extends BaseStyle {
  isStyledComponent: boolean;
  imports: string;
  interpolations: Array<{ id: string; unit: string }>;
}

export type Style = StaticStyle | DynamicStyle;

export type NodeStyleMap = Map<Node, Style>;

export interface Change {
  start: number;
  end: number;
  code?: string;
}

export interface StyleState {
  styles: Map<string, Style>;
  changeset: Change[];
}

export type PluginState = Record<symbol, any> & {
  opts: Partial<ResolvedOptions>;
  styleImports: StyleImportInjector;
  defaultedOptions: ResolvedOptions;
  file: any;
};
