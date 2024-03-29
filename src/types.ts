import * as T from '@babel/types';

// eslint-disable-next-line import/no-cycle
import StyleImportInjector from './utils/ImportInjector';

export interface ResolvedImport {
  identifier: string;
  request: string;
  type: string;
}

export interface UserDependency {
  source: string;
  imported?: string;
  type?: StyleType;
}

export type DependencyResolver = (
  interpolation: ResolvedImport,
  localStyle: Style,
  node: T.Expression,
) => UserDependency | null;

export interface ResolvedOptions {
  configFile?: string | boolean;
  writeFiles: boolean;
  allowGlobal: boolean;
  nesting: boolean | 'auto';

  cssTagName: string | false;
  styledTagName: string | false;
  stylesheetTagName: string | false;

  jsxPragma?: string | boolean;

  enableCssProp: boolean;
  enableDynamicInterpolations: 'cssProp' | boolean;

  noWarnings?: boolean;
  resolveDependency?: DependencyResolver;
  generateInterpolations?: boolean;
  extension: string;
  getFileName?: (
    hostFile: string,
    opts: ResolvedOptions,
    id?: string,
  ) => string;
  getRequirePath?: (from: string, to: string, identifier: string) => string;

  experiments: {
    modularCssExternals?: boolean;
  };
}

export type StyleType = 'stylesheet' | 'class' | 'styled';

export interface BaseStyle {
  start: number;
  end: number;
  type: StyleType;
  hostFilePath?: string;
  absoluteFilePath: string;
  requirePath: string;
  identifier: string;
  value: string;
  code?: string;
  importIdentifier?: string;
}

export interface StaticStyle extends BaseStyle {
  type: 'stylesheet' | 'class';
}

export interface DynamicStyle extends BaseStyle {
  type: 'class' | 'styled';
  imports: string;
  interpolations: Array<{ id: string; unit: string }>;
}

export type Style = StaticStyle | DynamicStyle;

export type NodeStyleMap = Map<T.Node, Style>;

export interface Change {
  type:
    | 'stylesheet'
    | 'class'
    | 'styled'
    | 'create-element'
    | 'style-imports'
    | 'pragma'
    | 'import-optimization';

  start: number;
  end: number;
  code?: string;
}

export interface StyleState {
  styles: Map<string, Style>;
  changeset: Change[];
}

export interface AstroturfMetadata {
  styles: Style[];
  changeset: Change[];
}

export type PluginState = Record<symbol, any> & {
  opts: Partial<ResolvedOptions>;
  styleImports: StyleImportInjector;
  defaultedOptions: ResolvedOptions;
  file: any;
};
