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

import {
  Toolbox,
  ToolboxExpandableContent,
  ToggleButton as ToolboxToggleButton
} from 'src/shared/components/toolbox';

import styles from './Toolbox.stories.module.css';

export const DefaultStory = () => {
  const [isShowing, setIsShowing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleToolbox = () => {
    setIsShowing(!isShowing);
  };

  const mainToolboxContent = (
    <div className={styles.mainToolboxContent}>
      <p>This is main toolbox content</p>
      <p>
        This is the second paragraph
        <span className={styles.toggleButton}>
          <ToolboxToggleButton label="Download" />
        </span>
      </p>
    </div>
  );

  const toolboxFooterContent = (
    <div className={styles.footerToolboxContent}>
      <p>This is footer content</p>
      <p>This is footer second paragraph</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={toggleToolbox} ref={buttonRef}>
        Click me
      </button>
      {isShowing && buttonRef.current && (
        <Toolbox anchor={buttonRef.current}>
          <ToolboxExpandableContent
            mainContent={mainToolboxContent}
            footerContent={toolboxFooterContent}
          />
        </Toolbox>
      )}
    </div>
  );
};

DefaultStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/Toolbox'
};
