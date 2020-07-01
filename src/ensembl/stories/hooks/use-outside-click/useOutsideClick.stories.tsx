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

import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import styles from './useOutsideClick.stories.scss';

// this function returns either a div or a span,
// depending on the number of clicks on the element
// thus guaranteeing that the actual DOM element that receives the click
// will get removed from the DOM, which we are interested in testing in the story
const buildChild = (option: number, onClick: () => void) => {
  const content =
    'I‘m inside Ref, and both me and my parent will re-render if you click me';

  return option % 2 ? (
    <div className={styles.childElement} onClick={onClick}>
      {content}
    </div>
  ) : (
    <span
      className={styles.childElement}
      style={{ borderRadius: '50%' }}
      onClick={onClick}
    >
      {content}
    </span>
  );
};

storiesOf('Hooks|Shared Hooks/useOutsideClick', module)
  .add('single ref', () => {
    const [numberOfClicks, setNumberOfClicks] = useState(0);

    const parentRef = useRef<HTMLDivElement>(null);

    const updateComponent = () => {
      setNumberOfClicks(numberOfClicks + 1);
    };

    const callback = () => {
      action('clicked-outside')(numberOfClicks);
    };

    useOutsideClick(parentRef, callback);

    return (
      <div className={styles.wrapper}>
        <div className={styles.parentElement} ref={parentRef}>
          Ref
          {buildChild(numberOfClicks % 2, updateComponent)}
          <div className={styles.halfInside}>
            {' '}
            I'm also inside Ref and do not cause any updates
          </div>
        </div>
        <div className={styles.someOtherElement}> I'm outside Ref </div>
      </div>
    );
  })
  .add('multiple refs', () => {
    const elementRef1 = useRef<HTMLDivElement>(null);
    const elementRef2 = useRef<HTMLDivElement>(null);

    const callback = () => {
      action('clicked-outside')();
    };

    useOutsideClick([elementRef1, elementRef2], callback);

    return (
      <div className={styles.wrapper}>
        <div className={styles.childElement} ref={elementRef1}>
          Ref1
        </div>
        <div className={styles.someOtherElement}> I'm outside Ref1 & Ref2 </div>
        <div className={styles.childElement} ref={elementRef2}>
          Ref2
        </div>
      </div>
    );
  });
