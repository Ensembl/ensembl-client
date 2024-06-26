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

import { useState } from 'react';

import ChevronButton from 'src/shared/components/chevron-button/ChevronButton';
import RadioGroup from 'src/shared/components/radio-group/RadioGroup';

import type { Direction as ChevronDirection } from 'src/shared/components/chevron/Chevron';

import styles from './Chevron.stories.module.css';

export const ChevronStory = () => {
  const [direction, setDirection] = useState<ChevronDirection>('down');
  const [animation, setAnimation] = useState(false);
  const [customClass, setCustomClass] = useState(false);

  const directionOptions = [
    {
      value: 'down',
      label: 'Down'
    },
    {
      value: 'up',
      label: 'Up'
    },
    {
      value: 'left',
      label: 'Left'
    },
    {
      value: 'right',
      label: 'Right'
    }
  ];

  const animationOptions = [
    {
      value: false,
      label: 'No animation'
    },
    {
      value: true,
      label: 'With animation'
    }
  ];

  const classOptions = [
    {
      value: false,
      label: 'Default'
    },
    {
      value: true,
      label: 'Custom'
    }
  ];

  return (
    <div className={styles.storyWrapper}>
      <div className={styles.showRoom}>
        <span className={styles.label}>Some text next to a chevron</span>
        <ChevronButton
          direction={direction}
          animate={animation}
          className={customClass ? styles.customChevron : undefined}
        />
      </div>
      <div className={styles.controls}>
        <div className={styles.controlsDirection}>
          Direction
          <RadioGroup
            options={directionOptions}
            selectedOption={direction}
            onChange={(direction) =>
              setDirection(direction as ChevronDirection)
            }
          />
        </div>
        <div className={styles.controlsAnimation}>
          Animation
          <RadioGroup
            options={animationOptions}
            selectedOption={animation}
            onChange={(animation) => setAnimation(animation as boolean)}
          />
        </div>
        <div className={styles.controlsClass}>
          CSS class
          <RadioGroup
            options={classOptions}
            selectedOption={customClass}
            onChange={(customClass) => setCustomClass(customClass as boolean)}
          />
        </div>
      </div>
    </div>
  );
};

ChevronStory.storyName = 'default';

export const ChevronWrappedInButtonStory = () => {
  const [direction, setDirection] = useState<ChevronDirection>('down');

  const handleClick = () => {
    const newDirection = direction === 'up' ? 'down' : 'up';
    setDirection(newDirection);
  };

  return (
    <div className={styles.storyWrapper}>
      <div className={styles.showRoom}>
        <span className={styles.label}>Click the chevron →</span>
        <ChevronButton
          direction={direction as ChevronDirection}
          animate={true}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

ChevronWrappedInButtonStory.storyName = 'as button';

export default {
  title: 'Components/Shared Components/ChevronButton'
};
