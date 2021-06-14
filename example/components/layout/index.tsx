import React, { FC, ReactNode } from 'react';
import './style.scss';

interface LayoutProps {
  nav?: ReactNode;
}

const Layout: FC<LayoutProps> = (props) => {
  const { children, nav } = props;

  return (
    <section className={'custom-layout'}>
      <header className={'main-header'}>
        <h1>MicroContainer</h1>
      </header>
      <section className={'root-main-wrapper'}>
        <nav>{ nav }</nav>
        <main>{ children }</main>
      </section>
    </section>
  );
};

export { Layout };
