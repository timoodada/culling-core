import React, { FC, useEffect, useMemo, useState } from 'react';
import { toHtml } from 'hast-util-to-html';
import { visit, Node } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { cloneDeep } from 'lodash';
import './style.scss';

export interface Front {
  [prop: string]: string | number | boolean;
}
interface MdWrapperProps {
  front: Front;
  data: () => Promise<Node>;
}

export const MdWrapper: FC<MdWrapperProps> = (props) => {
  const { data } = props;
  const [hast, setHast] = useState<Node>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (typeof data === 'function') {
      setLoading(true);
      data().then(res => {
        res = cloneDeep(res);
        visit(res, [(v) => {
          return v.type === 'element' && /^h\d+$/.test(v.tagName as string);
        }], (v) => {
          const id = toString(v);
          (v.properties as any).id = id;
          (v.children as any[]).unshift({
            type: 'element',
            tagName: 'a',
            properties: { href: `#${id}`, className: 'anchor-point' },
            children: [{
              type: 'raw',
              value: '<svg viewBox="0 0 16 16" width="1em" height="1em"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0z" /></svg>',
            }],
          });
        });
        setHast(res);
      }).catch(error => {
        setHast({
          type: 'text',
          value: error.message,
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [data]);
  const html = useMemo(() => {
    if (hast) {
      return toHtml(hast as any, { allowDangerousHtml: true });
    }
    return '';
  }, [hast]);
  if (loading) {
    return (
      <div className={'loading-wrapper'}>Loading...</div>
    );
  }
  return (
    <div className={'markdown-body'} dangerouslySetInnerHTML={{ __html: html }} />
  );
};
