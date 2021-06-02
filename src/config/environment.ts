import { tryRead } from './culling';

export interface Environments {
  [prop: string]: string;
}

export function argvParser(): Environments {
  const argv = process.argv.reduce<any[]>((previous, current) => {
    if (current.indexOf('--') === 0) {
      previous.push({ name: current.replace(/^--/, ''), value: [] });
    } else if (previous.length) {
      const last = previous[previous.length - 1];
      last.value.push(current);
    }
    return previous;
  }, []);
  const ret: Environments = {};
  argv.forEach(v => {
    ret[v.name] = (v.value && v.value[v.value.length - 1]) || '';
  });
  return ret;
}

function loadEnv(): Environments {
  const argv = argvParser();
  const NODE_ENV = argv.mode === 'production' ?
    'production' :
    'development';
  return {
    PUBLIC_URL: '/',
    NODE_ENV,
    TIMESTAMP: String(Date.now()),
    PORT: argv.port || '3000',
  };
}

export const environments = Object.assign({}, loadEnv(), tryRead<Environments>('environments', {}));
