import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import classNames from 'classnames';

import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import styles from './Tooltip.stories.scss';

const canonicalTranscriptDefinition = `
	The canonical transcript is used in the gene tree analysis in Ensembl
  and does not necessarily reflect the most biologically relevant transcript of a gene.
  For human, the canonical transcript for a gene is set according to the following hierarchy:
  1. Longest CCDS translation with no stop codons.
  2. If no (1), choose the longest Ensembl/Havana merged translation with no stop codons.
  3. If no (2), choose the longest translation with no stop codons.
  4. If no translation, choose the longest non-protein-coding transcript.
`;

const ContentSwitch = (props: {
  isLong: boolean;
  onChange: (isLong: boolean) => void;
}) => {
  const { isLong, onChange } = props;
  const handleClick = () => onChange(!isLong);
  const unselectedProps = {
    onClick: handleClick,
    className: classNames(
      styles.contentSwitchItem,
      styles.contentSwitchItemActive
    )
  };
  const selectedProps = {
    className: classNames(styles.contentSwitchItem)
  };

  return (
    <div className={styles.contentSwitch}>
      <span {...(isLong ? unselectedProps : selectedProps)}>Short content</span>
      <span {...(isLong ? selectedProps : unselectedProps)}>Long content</span>
    </div>
  );
};

const DefaultTooltipStory = () => {
  const [isMousedOver, setIsMousedOver] = useState(false);
  const [isLongContent, setIsLongContent] = useState(false);
  const elementRef = useRefWithRerender<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <p>
          Mouse over the rectangle below to see the tooltip. Notice the slight
          delay between the moment your cursor is over the rectangle and the
          moment the tooltip appears.
        </p>
        <ContentSwitch isLong={isLongContent} onChange={setIsLongContent} />
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
            <div className={styles.tooltipContent}>
              {isLongContent ? canonicalTranscriptDefinition : 'I am tooltip'}
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const OnScrollTooltipStory = () => {
  const [isMousedOver, setIsMousedOver] = useState(false);
  const elementRef = useRefWithRerender<HTMLDivElement>(null);

  const hideTooltip = () => setIsMousedOver(false);

  return (
    <div className={classNames(styles.container, styles.containerTall)}>
      <div className={styles.containerInner}>
        <p>
          Scroll the page and mouse over the rectangle below. The tooltip should
          be positioned correctly despite scrolling. Continue scrolling — and
          the tooltip will disappear when the cursor leaves the rectangle.
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
          <Tooltip
            delay={300}
            anchor={elementRef.current}
            onClose={hideTooltip}
          >
            I am tooltip
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const OverflowHiddenStory = () => {
  const [isMousedOver, setIsMousedOver] = useState(false);
  const elementRef = useRefWithRerender<HTMLDivElement>(null);

  return (
    <div className={classNames(styles.container, styles.containerOverflow)}>
      <div className={styles.containerInner}>
        <p>
          The container crops anything that extends beyond its borders, but
          despite that the tooltip is perfectly visible.
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

storiesOf('Components|Shared Components/Tooltip', module)
  .add('default', () => {
    return <DefaultTooltipStory />;
  })
  .add('scrolling', () => {
    return <OnScrollTooltipStory />;
  })
  .add('in cropping container', () => {
    return <OverflowHiddenStory />;
  });
