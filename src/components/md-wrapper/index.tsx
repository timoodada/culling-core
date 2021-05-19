import React, { FC, useMemo } from 'react';
import { toHtml } from 'hast-util-to-html';
import './style.scss';

interface MdWrapperProps {
  data: { hast: any; front: any; };
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
