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

import { useState, useEffect, useRef, type RefObject } from 'react';
import classNames from 'classnames';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { useAppSelector } from 'src/store';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './BrowserLocationIndicator.module.css';

type Props = {
  className?: string;
  containerRef?: RefObject<HTMLElement | null>;
  nonOverlapElementRef?: RefObject<HTMLElement | null>;
};

export const BrowserLocationIndicator = (props: Props) => {
  const shouldCheckProximity = props.containerRef && props.nonOverlapElementRef;
  const [shouldShowRegionName, setShouldShowRegionName] =
    useState(!shouldCheckProximity); // start with false if component needs to figure out how close it is to its neightbor on the left
  const actualChrLocation = useAppSelector(getActualChrLocation);
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string;

  const { data: genomeKaryotype } = useGenomeKaryotypeQuery(activeGenomeId);

  const [regionName, chrStart, chrEnd] = actualChrLocation || [];

  if (!regionName || !chrStart || !chrEnd || !activeGenomeId) {
    return null;
  }

  const activeChromosome = genomeKaryotype?.find((karyotype) => {
    return karyotype.name === regionName;
  });

  const componentClasses = classNames(
    styles.browserLocationIndicator,
    props.className
  );

  const onRegionNameVisibilityChange = (shouldShowRegionName: boolean) => {
    setShouldShowRegionName(shouldShowRegionName);
  };

  return (
    <div className={componentClasses}>
      <div className={styles.chrLocationView}>
        {activeChromosome?.is_circular ? (
          <CircularChromosomeIndicator />
        ) : (
          <div className={styles.regionNameContainer}>
            {shouldShowRegionName && (
              <span className={styles.regionName}>{regionName}</span>
            )}
            {props.nonOverlapElementRef && props.containerRef && (
              <ProximitySensor
                regionName={regionName}
                containerRef={props.containerRef}
                nonOverlapElementRef={props.nonOverlapElementRef}
                isRegionNameVisible={shouldShowRegionName}
                onRegionNameVisibilityChange={onRegionNameVisibilityChange}
              />
            )}
          </div>
        )}
        <div className={styles.chrRegion}>
          <span>{formatNumber(chrStart as number)}</span>
          <span className={styles.chrSeparator}>-</span>
          <span>{formatNumber(chrEnd as number)}</span>
        </div>
      </div>
    </div>
  );
};

const ProximitySensor = ({
  regionName,
  containerRef,
  nonOverlapElementRef,
  isRegionNameVisible,
  onRegionNameVisibilityChange
}: {
  regionName: string;
  containerRef: RefObject<HTMLElement | null>;
  nonOverlapElementRef: RefObject<HTMLElement | null>;
  isRegionNameVisible: boolean;
  onRegionNameVisibilityChange: (x: boolean) => void;
}) => {
  const probeRef = useRef<HTMLSpanElement>(null);
  const isRegionNameVisibleRef = useRef(isRegionNameVisible);
  const minDistanceToLeft = 60;

  useEffect(() => {
    if (!probeRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(onContainerResize);
    resizeObserver.observe(containerRef.current as HTMLElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [probeRef.current, nonOverlapElementRef.current]);

  useEffect(() => {
    isRegionNameVisibleRef.current = isRegionNameVisible;
  }, [isRegionNameVisible]);

  const onContainerResize = () => {
    const isTooClose = isTooCloseToLeft();
    const isRegionNameVisible = isRegionNameVisibleRef.current;
    if (isTooClose && isRegionNameVisible) {
      onRegionNameVisibilityChange(false);
    } else if (!isTooClose && !isRegionNameVisible) {
      onRegionNameVisibilityChange(true);
    }
  };

  const isTooCloseToLeft = () => {
    const featureSummaryStrip = nonOverlapElementRef.current;
    if (!featureSummaryStrip) {
      return true; // to be on the safe side
    }
    const probe = probeRef.current as HTMLElement;
    const featureSummaryStripRightCoord =
      featureSummaryStrip.getBoundingClientRect().right;
    const isfeatureSummaryStripOverflowing =
      featureSummaryStrip.scrollWidth > featureSummaryStrip.clientWidth;
    const probeLeftCoord = probe.getBoundingClientRect().left;
    const distance = probeLeftCoord - featureSummaryStripRightCoord;

    return distance < minDistanceToLeft || isfeatureSummaryStripOverflowing;
  };

  return (
    <div className={styles.probeAnchor}>
      <span className={styles.probe} ref={probeRef}>
        {regionName}
      </span>
    </div>
  );
};

const CircularChromosomeIndicator = () => {
  return <div className={styles.circularIndicator}></div>;
};

export default BrowserLocationIndicator;
