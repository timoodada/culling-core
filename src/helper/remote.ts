import { resolveModule, containers, Container } from './load';

(window as any).remoteJsonpCallback = async (container: Container) => {
  containers.index = containers.list.length;
  containers.list.push(container);
  await resolveModule(container, './App');
};
