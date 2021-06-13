import React, { Suspense, FC, lazy, useMemo } from 'react';

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
