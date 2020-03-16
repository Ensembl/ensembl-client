import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import styles from './Tooltip.stories.scss';

const DefaultTooltipStory = () => {
  const [isMousedOver, setIsMousedOver] = useState(false);
  const elementRef = useRefWithRerender<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <p>
          Hover over the button to see the tooltip. Notice the slight delay
          between the moment you mouse over the button and the moment the
          tooltip appears.
        </p>
        <div
          onMouseEnter={() => setIsMousedOver(true)}
          onMouseLeave={() => setIsMousedOver(false)}
          ref={elementRef}
          className={styles.tooltipAnchor}
        >
          Mouse over me
        </div>
        {isMousedOver && elementRef.current && (
          <Tooltip delay={300} anchor={elementRef.current}>
            I am tooltip
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const OnScrollTooltipStory = () => {
  return <div>Hello?</div>;
};

storiesOf('Components|Shared Components/Tooltip', module)
  .add('default', () => {
    return <DefaultTooltipStory />;
  })
  .add('scrolling', () => {
    return <OnScrollTooltipStory />;
  });
