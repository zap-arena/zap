// Type stubs for third-party modules not available during type-check
// These stubs provide minimal type satisfaction without the actual packages

// jspdf-autotable type stub
declare module "jspdf-autotable" {
  import jsPDF from "jspdf"
  interface AutoTableOptions {
    head?: unknown[][]
    body?: unknown[][]
    foot?: unknown[][]
    startY?: number
    theme?: string
    styles?: Record<string, unknown>
    headStyles?: Record<string, unknown>
    bodyStyles?: Record<string, unknown>
    columnStyles?: Record<string, Record<string, unknown>>
    columns?: Array<{ header: string; dataKey: string }>
    [key: string]: unknown
  }
  function autoTable(doc: jsPDF, options: AutoTableOptions): void
  export default autoTable
}

// UUID type stub
declare module "uuid" {
  export function v4(): string;
  export function v1(): string;
  export function v3(name: string | Uint8Array, namespace: string | Uint8Array): string;
  export function v5(name: string | Uint8Array, namespace: string | Uint8Array): string;
  export function validate(uuid: string): boolean;
  export function version(uuid: string): number;
  export function parse(uuid: string): Uint8Array;
  export function stringify(arr: Uint8Array): string;
}

// Leaflet type stub (actual types from @types/leaflet when installed)
declare module "leaflet" {
  const L: Record<string, unknown>;
  export = L;
}

// Type stubs for Next.js modules
// These provide TypeScript type resolution during development
// when the next package is installed in the deployment environment

declare module "next" {
  export interface NextConfig {
    rewrites?: () => Promise<
      | Array<{ source: string; destination: string }>
      | {
          beforeFiles?: Array<{ source: string; destination: string }>;
          afterFiles?: Array<{ source: string; destination: string }>;
          fallback?: Array<{ source: string; destination: string }>;
        }
    >;
    webpack?: (config: Record<string, unknown>) => Record<string, unknown>;
    [key: string]: unknown;
  }
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (href: string) => void;
  };

  export function useParams(): Record<string, string | string[]>;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams & {
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
    has: (key: string) => boolean;
    entries: () => IterableIterator<[string, string]>;
    keys: () => IterableIterator<string>;
    values: () => IterableIterator<string>;
    forEach: (fn: (value: string, key: string) => void) => void;
    toString: () => string;
    size: number;
  };
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare module "next/link" {
  import { AnchorHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
  interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }
  const Link: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module "next/dynamic" {
  import { ComponentType, ReactNode } from "react";
  interface DynamicOptions<P = Record<string, unknown>> {
    loading?: ComponentType;
    ssr?: boolean;
    suspense?: boolean;
    displayName?: string;
  }
  function dynamic<P = Record<string, unknown>>(
    dynamicOptions: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>,
    options?: DynamicOptions<P>
  ): ComponentType<P>;
  export default dynamic;
}

declare module "next/image" {
  import { ImgHTMLAttributes } from "react";
  interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
  }
  export default function Image(props: ImageProps): JSX.Element;
}

declare module "next/font/google" {
  interface FontOptions {
    weight?: string | string[];
    style?: string | string[];
    subsets?: string[];
    display?: "auto" | "block" | "swap" | "fallback" | "optional";
    variable?: string;
    preload?: boolean;
  }
  export function Inter(options: FontOptions): { className: string; style: { fontFamily: string } };
  export function Roboto(options: FontOptions): { className: string; style: { fontFamily: string } };
  export function Geist(options: FontOptions): { className: string; style: { fontFamily: string } };
  export function Geist_Mono(options: FontOptions): { className: string; style: { fontFamily: string } };
}

// Metadata type for Next.js App Router
declare module "next" {
  export interface Metadata {
    title?: string | { default: string; template?: string; absolute?: string };
    description?: string;
    keywords?: string | string[];
    openGraph?: Record<string, unknown>;
    twitter?: Record<string, unknown>;
    icons?: Record<string, unknown>;
    viewport?: string | Record<string, unknown>;
    [key: string]: unknown;
  }
}

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
}

declare module "next/types.js" {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
}
