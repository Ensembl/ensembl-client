import React, { ReactElement, useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { useSprings, animated } from 'react-spring';

import styles from './SpeciesTabsWrapper.scss';
// import { useEffect } from '@storybook/addons';

type Props = {
  isWrappable: boolean;
  speciesTabs: ReactElement<any>[]; // FIXME any
  terminalLink?: React.ReactNode;
};

const SpeciesTabsWrapper = (props: Props) => {
  return props.isWrappable ? (
    <MultiLineWrapper {...props} />
  ) : (
    <SingleLineWrapper {...props} />
  );
};

SpeciesTabsWrapper.defaultProps = {
  isWrappable: true
};

const animationCalculator = (paramsList: any, index: number) => {
  const params = paramsList[index];
  const isFullWidth = params.isActive; // will also include isHovered
  console.log('index', index, 'isFullWidth', isFullWidth);
  return {
    config: { tension: 280, friction: 45 },
    width: isFullWidth ? '200px' : '100px'
  };
};

const SingleLineWrapper = (props: Props) => {
  const { speciesTabs } = props;
  const [containerRef, containerWidth] = useResizeObserver();
  const speciesTabsProps = React.Children.map(speciesTabs, (tab) => tab.props);
  const [springs, setAnimationProps] = useSprings(speciesTabs.length, (index) =>
    animationCalculator(speciesTabsProps, index)
  );

  useEffect(() => {
    setAnimationProps((index: number) =>
      animationCalculator(speciesTabsProps, index)
    );
  });

  console.log('containerWidth', containerWidth);

  const handleMouseEnter = (fn: () => void) => () => {
    console.log('i am overriding the mouseenter');
    fn();
  };

  const handleMouseLeave = (fn: () => void) => () => {
    console.log('i am overriding the mouseleave');
    fn();
  };

  const children = React.Children.map(
    props.speciesTabs,
    (node: ReactElement<any>, index) => {
      const newProps = {
        ...node.props,
        onMouseEnter: handleMouseEnter(node.props.onMouseEnter),
        onMouseLeave: handleMouseLeave(node.props.onMouseLeave),
        className: styles.species
      };
      const child = React.cloneElement(node, newProps);
      return (
        <animated.div
          className={styles.speciesContainer}
          style={springs[index]}
        >
          {child}
        </animated.div>
      );
    }
  );
  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>}>{children}</div>
  );
};

const MultiLineWrapper = (props: Props) => {
  return <div>{props.speciesTabs}</div>;
};

export default SpeciesTabsWrapper;
