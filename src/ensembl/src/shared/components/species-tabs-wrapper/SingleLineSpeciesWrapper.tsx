import React, { ReactElement, useState, useEffect, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';
import { useSprings, animated } from 'react-spring';

import { getSpeciesItemWidths } from './speciesTabsWrapperHelpers';

import styles from './SingleLineSpeciesWrapper.scss';

import { Props as FocusableSelectedSpeciesProps } from 'src/shared/components/selected-species/FocusableSelectedSpecies';

export type Props = {
  isWrappable: false;
  speciesTabs: ReactElement<FocusableSelectedSpeciesProps>[];
  link?: React.ReactNode | null;
};

const animationCalculator = ({
  items,
  hoveredItemIndex,
  containerRef,
  containerWidth,
  immediate = false
}: {
  items: FocusableSelectedSpeciesProps[];
  hoveredItemIndex: number | null;
  containerRef: React.RefObject<HTMLElement>;
  containerWidth: number;
  immediate: boolean;
}) => {
  const springConfig = { tension: 280, friction: 45 };
  const updatedParamsList = items.map((item, index) => ({
    ...item,
    isHovered: index === hoveredItemIndex
  }));
  if (containerRef.current) {
    return getSpeciesItemWidths({
      items: updatedParamsList,
      containerWidth
    }).map((width) => ({
      config: springConfig,
      width: `${width}px`,
      immediate
    }));
  } else {
    return items.map(() => ({
      config: springConfig,
      width: '0px',
      immediate
    }));
  }
};

const getLinkWidth = (ref: React.RefObject<HTMLElement>) => {
  if (!ref.current) {
    return 0;
  } else {
    const { width } = ref.current.getBoundingClientRect();
    const linkMargin = 7;
    return Math.ceil(width + linkMargin);
  }
};

const getItemsContainerWidth = (
  totalWidth: number | undefined,
  usedWidth: number | undefined
) => {
  if (!totalWidth) {
    return 0;
  } else if (!usedWidth) {
    return totalWidth;
  } else {
    return totalWidth - usedWidth;
  }
};

const SingleLineWrapper = (props: Props) => {
  const { speciesTabs } = props;
  const shouldAnimateImmediately = useRef(true);
  const linkRef = useRef<HTMLDivElement>(null);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [containerRef, containerWidth] = useResizeObserver();
  const linkWidth = getLinkWidth(linkRef);
  const itemsContainerWidth = getItemsContainerWidth(containerWidth, linkWidth);
  const speciesTabsProps = React.Children.map(speciesTabs, (tab) => tab.props);
  const animations = animationCalculator({
    items: speciesTabsProps,
    hoveredItemIndex,
    containerRef,
    containerWidth: itemsContainerWidth,
    immediate: true
  });
  const [springs, setAnimationProps] = useSprings(
    speciesTabs.length,
    (index) => animations[index]
  );

  useEffect(() => {
    const animations = animationCalculator({
      items: speciesTabsProps,
      hoveredItemIndex,
      containerRef,
      containerWidth: itemsContainerWidth,
      immediate: shouldAnimateImmediately.current
    });
    // FIXME: can we switch to react-spring v9 beta? Types for v8 are incorrect and not maintained
    // see https://github.com/react-spring/react-spring/pull/722
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    setAnimationProps((index) => animations[index]);

    // species tabs should initially appear without animation;
    // but subsequent tabs changes should be animated
    setTimeout(() => {
      if (shouldAnimateImmediately.current) {
        shouldAnimateImmediately.current = false;
      }
    }, 1000);
  });

  const handleMouseEnter = (fn: () => void, index: number) => {
    setHoveredItemIndex(index);
    fn();
  };

  const handleMouseLeave = (fn: () => void) => {
    setHoveredItemIndex(null);
    fn();
  };

  const children = containerRef.current
    ? React.Children.map(
        props.speciesTabs,
        (node: ReactElement<any>, index) => {
          const newProps = {
            ...node.props,
            onMouseEnter: () =>
              handleMouseEnter(node.props.onMouseEnter, index),
            onMouseLeave: () => handleMouseLeave(node.props.onMouseLeave),
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
    <div className={styles.speciesWrapperExternal}>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={styles.speciesWrapper}
      >
        {children}
        {props.link && (
          <div ref={linkRef} className={styles.linkWrapper}>
            {props.link}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleLineWrapper;
