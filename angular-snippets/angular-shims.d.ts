declare module '@angular/common' {
  export const CommonModule: unknown;
}

declare module '@angular/core' {
  export interface InjectableOptions {
    providedIn?: 'root' | 'platform' | 'any' | null;
  }

  export interface ComponentOptions {
    selector?: string;
    standalone?: boolean;
    imports?: unknown[];
    template?: string;
    styles?: string[];
  }

  export function Injectable(options?: InjectableOptions): ClassDecorator;
  export function Component(options: ComponentOptions): ClassDecorator;
}
