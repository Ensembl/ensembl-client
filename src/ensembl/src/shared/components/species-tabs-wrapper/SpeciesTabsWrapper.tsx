import React, { ReactElement, useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { useSprings, animated } from 'react-spring';

import { getSpeciesItemWidths } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

import styles from './SpeciesTabsWrapper.scss';

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

const animationCalculator = (
  paramsList: any,
  containerRef: any,
  containerWidth: number
) => {
  const springConfig = { tension: 280, friction: 45 };
  if (containerRef) {
    return getSpeciesItemWidths({ items: paramsList, containerWidth }).map(
      (width) => ({
        config: springConfig,
        width: `${width}px`
      })
    );
  } else {
    return paramsList.map(() => ({
      config: springConfig,
      width: '0px'
    }));
  }
};

const SingleLineWrapper = (props: Props) => {
  const { speciesTabs } = props;
  const [containerRef, containerWidth] = useResizeObserver();
  const speciesTabsProps = React.Children.map(speciesTabs, (tab) => tab.props);
  const animations = animationCalculator(
    speciesTabsProps,
    containerRef,
    containerWidth
  );
  const [springs, setAnimationProps] = useSprings(
    speciesTabs.length,
    (index) => animations[index]
  );

  useEffect(() => {
    // FIXME: can we switch to react-spring v9? Because of types
    // see https://github.com/react-spring/react-spring/pull/722
    const animations = animationCalculator(
      speciesTabsProps,
      containerRef,
      containerWidth
    );
    setAnimationProps((index) => animations[index]);
  });

  const handleMouseEnter = (fn: () => void) => () => {
    // console.log('i am overriding the mouseenter');
    fn();
  };

  const handleMouseLeave = (fn: () => void) => () => {
    // console.log('i am overriding the mouseleave');
    fn();
  };

  const children = containerRef.current
    ? React.Children.map(
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
      )
    : null;

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>}>{children}</div>
  );
};

const MultiLineWrapper = (props: Props) => {
  return <div>{props.speciesTabs}</div>;
};

export default SpeciesTabsWrapper;
