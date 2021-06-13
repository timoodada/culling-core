export interface Container<T=any> {
  get(module: string): Promise<() => T>;
  init(def: any): any;
}

const cacheModules = new Map<string, Promise<Container[]>>();

export const containers: { index: number; list: Container[] } = {
  index: 0,
  list: [],
};

export function loadScript(url: string): Promise<Container[]> {
  if (cacheModules.has(url)) {
    return cacheModules.get(url) as Promise<Container[]>;
  }
  const ret = new Promise<Container[]>(((resolve, reject) => {
    const element = document.createElement('script');
    element.src = url;
    element.type = 'text/javascript';
    element.async = true;
    document.head.appendChild(element);
    element.onload = () => {
      resolve(containers.list.splice(containers.index));
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

export async function loadModule<T=any>(url: string, module: string): Promise<T | null> {
  const containers = await loadScript(url);
  const container = containers[0];
  if (container) {
    return await resolveModule<T>(container, module);
  }
  return Promise.resolve(null);
}

export async function loadModules<T=any>(url: string, module: string): Promise<T[]> {
  const containers = await loadScript(url);
  return await Promise.all(containers.map(v => resolveModule<T>(v, module)));
}

export async function resolveModule<T=any>(container: Container, module: string): Promise<T> {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  // eslint-disable-next-line no-undef
  await __webpack_init_sharing__('default');
  // Initialize the container, it may provide shared modules
  // eslint-disable-next-line no-undef
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  return factory();
}
