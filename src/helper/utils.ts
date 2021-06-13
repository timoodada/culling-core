export function isPlainObject(val: any) {
  return toString.call(val) === '[object Object]';
}

export function debounce(func: Function, delay = 3000) {
  let timer: any;
  return (...args: any[]) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function combineClassNames(...args: string[]) {
  const classNames: string[] = [];
  args.forEach((item) => {
    item = item.trim();
    if (!item) {
      return;
    }
    item.split(' ').forEach((className) => {
      if (classNames.indexOf(className) === -1) {
        classNames.push(className);
      }
    });
  });
  return classNames.join(' ');
}
interface ClassMap {
  [key: string]: boolean;
}
export function classNames(params: string | ClassMap, map?: ClassMap) {
  let names = '';
  if (typeof params === 'string') {
    names = params;
  } else {
    names = combineClassNames(...Object.keys(params).filter(k => params[k]));
  }
  if (map) {
    names = combineClassNames(names, ...Object.keys(map).filter(k => map[k]));
  }
  return names;
}
export function queryParse(val: any) {
  if (typeof val === 'string') {
    if (val.indexOf('?') === 0) {
      val = val.substr(1);
    }
    const query: { [prop: string]: string } = {};
    val.split('&').forEach((item: string) => {
      const arr = item.split('=');
      const [key, value] = arr;
      query[key] = value;
    });
    return query;
  }
  if (isPlainObject(val)) {
    return val;
  }
  return {};
}

export function stringify(obj: any): string {
  return Object.keys(obj).reduce<string[]>((pre, key) => {
    pre.push(`${key}=${encodeURIComponent(obj[key])}`);
    return pre;
  }, []).join('&');
}
