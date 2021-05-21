import React, { FC, useMemo } from 'react';
import { toHtml } from 'hast-util-to-html';
import { Node as HNode } from 'hast-util-to-html/lib/types';
import './style.scss';

export interface Front {
  [prop: string]: string | number | boolean;
}
interface MdWrapperProps {
  data: {
    hast: HNode | HNode[];
    front: Front;
  };
}

export const MdWrapper: FC<MdWrapperProps> = (props) => {
  const { data } = props;
  const html = useMemo(() => {
    return toHtml(data.hast, { allowDangerousHtml: true });
  }, [data]);
  return (
    <div className={'markdown-body'} dangerouslySetInnerHTML={{ __html: html }} />
  );
};
