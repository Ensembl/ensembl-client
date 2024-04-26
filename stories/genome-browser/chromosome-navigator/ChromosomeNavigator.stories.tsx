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

import { useRef, useState } from 'react';

import * as React from 'react';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import { ChromosomeNavigator } from 'src/content/app/genome-browser/components/chromosome-navigator/ChromosomeNavigator';

import styles from './ChromosomeNavigator.stories.module.css';

export const ChromosomeNavigatorStory = () => {
  const length = 1000000;
  const [viewportStart, setViewportStart] = useState(200000);
  const [viewportEnd, setViewportEnd] = useState(500000);
  const [focusRegionStart, setFocusRegionStart] = useState(300000);
  const [focusRegionEnd, setFocusRegionEnd] = useState(350000);
  const [centromereStart, setCentromereStart] = useState(150000);
  const [centromereEnd, setCentromereEnd] = useState(160000);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver({ ref: containerRef });

  const updateValue =
    (updater: (...args: any) => void) =>
    (e: React.FormEvent<HTMLInputElement>) => {
      const value = parseInt(e.currentTarget.value);
      updater(value);
    };

  return (
    <>
      <div ref={containerRef} className={styles.chromosomeNavigatorContainer}>
        <ChromosomeNavigator
          length={1000000}
          viewportStart={viewportStart}
          viewportEnd={viewportEnd}
          focusRegion={{
            start: focusRegionStart,
            end: focusRegionEnd
          }}
          centromere={{
            start: centromereStart,
            end: centromereEnd
          }}
          containerWidth={containerWidth}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsGroup}>
          <div>Viewport</div>
          <label>
            Viewport start
            <input
              type="range"
              min={0}
              max={length}
              value={viewportStart}
              onChange={updateValue(setViewportStart)}
            />
          </label>
          <label>
            Viewport end
            <input
              type="range"
              min={0}
              max={length}
              value={viewportEnd}
              onChange={updateValue(setViewportEnd)}
            />
          </label>
        </div>
        <div className={styles.controlsGroup}>
          <div>Focus region</div>
          <label>
            Focus region start
            <input
              type="range"
              min={0}
              max={length}
              value={focusRegionStart}
              onChange={updateValue(setFocusRegionStart)}
            />
          </label>
          <label>
            Focus region end
            <input
              type="range"
              min={0}
              max={length}
              value={focusRegionEnd}
              onChange={updateValue(setFocusRegionEnd)}
            />
          </label>
        </div>
        <div className={styles.controlsGroup}>
          <div>Centromere</div>
          <label>
            Centromere start
            <input
              type="range"
              min={0}
              max={centromereEnd}
              value={centromereStart}
              onChange={updateValue(setCentromereStart)}
            />
          </label>
          <label>
            Centromere end
            <input
              type="range"
              min={centromereStart}
              max={length}
              value={centromereEnd}
              onChange={updateValue(setCentromereEnd)}
            />
          </label>
        </div>
      </div>
    </>
  );
};

ChromosomeNavigatorStory.storyName = 'default';

export default {
  title: 'Components/Genome Browser/ChromosomeNavigator'
};
