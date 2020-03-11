import React, { useState, useRef, useEffect } from 'react';
import { storiesOf } from '@storybook/react';

import {
  Toolbox,
  ToolboxExpandableContent,
  ToggleButton as ToolboxToggleButton,
  ToolboxExpandableContentHandles
} from 'src/shared/components/toolbox';

import styles from './Toolbox.stories.scss';

const DefaultStory = () => {
  const [isShowing, setIsShowing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isToolboxContentRefSet, setToolboxContentRef] = useState(false);
  const toolboxContentRef = useRef<ToolboxExpandableContentHandles>(null);

  const toggleHoverbox = () => {
    setIsShowing(!isShowing);
  };

  useEffect(() => {
    toolboxContentRef.current && setToolboxContentRef(true);
  }, [toolboxContentRef.current]);

  const onRef = (node) => toolboxContentRef.current = node;

  const getMainHoverboxContent = () => {
    console.log('will pass', toolboxContentRef.current);
    return (
      <div>
        <p>This is main hoverbox content</p>
        <p>This is the second paragraph</p>
        {
          isToolboxContentRefSet &&
          <ToolboxToggleButton
            toolboxContentHandles={toolboxContentRef.current}
          />
        }
      </div>
    );
  }

  // const mainHoverboxContent = (
  //   <div>
  //     <p>This is main hoverbox content</p>
  //     <p>This is the second paragraph</p>
  //     {
  //       isToolboxContentRefSet &&
  //       <ToolboxToggleButton
  //         toolboxContentHandles={toolboxContentRef.current}
  //       />
  //     }
  //   </div>
  // );

  const hoverboxFooterContent = (
    <div>
      <p>This is footer content</p>
      <p>This is footer second paragraph</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={toggleHoverbox}
        ref={buttonRef}
      >
        Click me
      </button>
      {isShowing && buttonRef.current && (
        <Toolbox anchor={buttonRef.current}>
          <ToolboxExpandableContent
            ref={(node) => { console.log ('node', node); onRef(node)}}
            mainContent={getMainHoverboxContent()}
            footerContent={hoverboxFooterContent}
          />
        </Toolbox>
      )}
    </div>
  );
};

storiesOf('Components|Shared Components/Toolbox', module).add(
  'default',
  DefaultStory
);
