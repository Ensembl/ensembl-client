import React, { ReactElement, useState, useEffect, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';

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
  containerWidth
}: {
  items: FocusableSelectedSpeciesProps[];
  hoveredItemIndex: number | null;
  containerRef: React.RefObject<HTMLElement>;
  containerWidth: number;
}) => {
  const updatedParamsList = items.map((item, index) => ({
    ...item,
    isHovered: index === hoveredItemIndex
  }));
  if (containerRef.current) {
    return getSpeciesItemWidths({
      items: updatedParamsList,
      containerWidth
    }).map((width) => ({
      width: `${width}px`
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
  const linkRef = useRef<HTMLDivElement>(null);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [containerRef, containerWidth] = useResizeObserver();
  const linkWidth = getLinkWidth(linkRef);
  const itemsContainerWidth = getItemsContainerWidth(containerWidth, linkWidth);
  const speciesTabsProps = React.Children.map(speciesTabs, (tab) => tab.props);
  const activeItemIndex = speciesTabsProps.findIndex((item) => item.isActive);

  const [speciesStyles, setSpeciesStyles] = useState(
    animationCalculator({
      items: speciesTabsProps,
      hoveredItemIndex,
      containerRef,
      containerWidth: itemsContainerWidth
    })
  );

  useEffect(() => {
    setSpeciesStyles(
      animationCalculator({
        items: speciesTabsProps,
        hoveredItemIndex,
        containerRef,
        containerWidth: itemsContainerWidth
      })
    );
  }, [hoveredItemIndex, activeItemIndex, containerWidth]);

  const handleMouseEnter = (index: number, fn?: () => void) => {
    setHoveredItemIndex(index);
    fn && fn();
  };

  const handleMouseLeave = (fn?: () => void) => {
    setHoveredItemIndex(null);
    fn && fn();
  };

  const children = containerRef.current
    ? React.Children.map(
        props.speciesTabs,
        (node: ReactElement<any>, index) => {
          const newProps = {
            ...node.props,
            onMouseEnter: () =>
              handleMouseEnter(index, node.props.onMouseEnter),
            onMouseLeave: () => handleMouseLeave(node.props.onMouseLeave),
            className: styles.species
          };
          const child = React.cloneElement(node, newProps);
          return (
            <div
              className={styles.speciesContainer}
              style={speciesStyles ? speciesStyles[index] : {}}
            >
              {child}
            </div>
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
