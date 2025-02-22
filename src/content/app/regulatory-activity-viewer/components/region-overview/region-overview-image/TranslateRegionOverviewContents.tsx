import { useState, useEffect, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const TranslateRegionOverviewContents = (props: Props) => {
  const { children } = props;
  const [translateX, setTranslateX] = useState(1);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTranslateX(state => {
  //       console.log('state', state);
  //       return state + 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <g transform={`translate(${translateX}, 0)`} >
      { children }
    </g>
  );

};

export default TranslateRegionOverviewContents;
