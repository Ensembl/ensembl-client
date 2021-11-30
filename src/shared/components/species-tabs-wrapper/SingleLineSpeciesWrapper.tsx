/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement, useState, useEffect, useRef, memo } from 'react';
import isEqual from 'lodash/isEqual';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';
import { getSpeciesItemWidths } from './speciesTabsWrapperHelpers';

import styles from './SingleLineSpeciesWrapper.scss';

import { Props as SelectedSpeciesProps } from 'src/shared/components/selected-species/SelectedSpecies';

export type Props = {
  isWrappable: false;
  speciesTabs: ReactElement<SelectedSpeciesProps>[];
  link?: React.ReactNode | null;
};

const animationCalculator = ({
  items,
  hoveredItemIndex,
  containerRef,
  containerWidth
}: {
  items: SelectedSpeciesProps[];
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
  const [containerWidthMeasured, setContainerWidthMeasured] = useState(false);
  const { speciesTabs } = props;
  const linkRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const { width: containerWidth } = useResizeObserver({ ref: containerRef });
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
    if (containerWidth && !containerWidthMeasured) {
      setContainerWidthMeasured(true);
    }
  }, [hoveredItemIndex, activeItemIndex, containerWidth]);

  const handleMouseEnter = (index: number, fn?: () => void) => {
    setHoveredItemIndex(index);
    fn && fn();
  };

  const handleMouseLeave = (fn?: () => void) => {
    setHoveredItemIndex(null);
    fn && fn();
  };

  const children = containerWidthMeasured
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

export default memo(SingleLineWrapper, isEqual);
