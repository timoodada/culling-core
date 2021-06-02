import React, { Suspense, FC, lazy, useMemo } from 'react';
import { queryParse, stringify } from '../../helper';

const cacheModules = new Map<string, Promise<void>>();

export function loadScript(url: string): Promise<void> {
  if (cacheModules.has(url)) {
    return cacheModules.get(url) as Promise<void>;
  }
  const ret = new Promise<void>(((resolve, reject) => {
    const element = document.createElement('script');
    const split = url.split('?');
    const query = Object.assign({}, queryParse(split[1]), { _: process.env.TIMESTAMP });
    element.src = `${split[0]}?${stringify(query)}`;
    element.type = 'text/javascript';
    element.async = true;
    document.head.appendChild(element);
    element.onload = () => {
      resolve();
    };
    element.onerror = (err) => {
      document.head.removeChild(element);
      cacheModules.delete(url);
      reject(err);
    };
  }));
  cacheModules.set(url, ret);
  return ret;
}

export async function loadModule(url: string, scope: string, module: string) {
  await loadScript(url);
  const container = (window as any)[scope]; // or get the container somewhere else
  return await resolveModule(container, module);
}

export function loadAMDModule(url: string[]) {
  return new Promise((resolve, reject) => {
    (window as any).require(url, (container: any) => {
      resolveModule(container, './App').then(resolve).catch(reject);
    });
  });
}

export async function resolveModule(container: any, module: string) {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  // eslint-disable-next-line no-undef
  await __webpack_init_sharing__('default');
  // Initialize the container, it may provide shared modules
  // eslint-disable-next-line no-undef
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  return factory();
}

const Error: FC = () => {
  return (
    <>module load failed</>
  );
};

interface AsyncComponentProps {
  module: Promise<any>;
  [prop: string]: any;
}
export const AsyncComponent: FC<AsyncComponentProps> = (props) => {
  const { module } = props;
  const C = useMemo(() => {
    return lazy(() => {
      return module.catch(() => {
        return Promise.resolve({ default: Error });
      });
    });
  }, [module]);

  return (
    <Suspense fallback={'loading...'}>
      <C { ...props } />
    </Suspense>
  );
};
