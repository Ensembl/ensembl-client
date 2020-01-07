import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import styles from './FeatureSummaryStrip.scss';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

const MEDIUM_WIDTH = 800;
const SMALL_WIDTH = 500;

enum Display {
  FULL = 'full',
  COMPACT = 'compact',
  MINIMAL = 'minimal'
}

type Props = {
  gene: EnsObject;
  isGhosted?: boolean;
};

type WidthAwareProps = Props & {
  display: Display;
};

const GeneSummaryWrapper = (props: Props) => {
  const [display, setDisplay] = useState(Display.MINIMAL);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver({ ref: containerRef });

  useEffect(() => {
    if (containerWidth < SMALL_WIDTH) {
      display !== Display.MINIMAL && setDisplay(Display.MINIMAL);
    } else if (containerWidth < MEDIUM_WIDTH) {
      display !== Display.COMPACT && setDisplay(Display.COMPACT);
    } else {
      display !== Display.FULL && setDisplay(Display.FULL);
    }
  }, [containerWidth]);

  return (
    <div className={styles.featureSummaryStripWrapper} ref={containerRef}>
      <GeneSummaryStrip {...props} display={display} />
    </div>
  );
};

const GeneSummaryStrip = ({ gene, isGhosted, display }: WidthAwareProps) => {
  const stripClasses = classNames(styles.featureSummaryStrip, {
    [styles.featureSummaryStripGhosted]: isGhosted
  });

  let content;

  if (display === Display.MINIMAL) {
    content = <MinimalContent gene={gene} />;
  } else if (display === Display.COMPACT) {
    content = <CompactContent gene={gene} />;
  } else {
    content = <FullContent gene={gene} />;
  }

  return <div className={stripClasses}>{content}</div>;
};

const MinimalContent = (props: { gene: EnsObject }) => (
  <div>
    <span className={styles.featureSummaryStripLabel}>Gene</span>
    {props.gene.label ? (
      <span className={styles.featureNameEmphasized}>{props.gene.label}</span>
    ) : (
      <span>{getDisplayStableId(props.gene)}</span>
    )}
  </div>
);

const CompactContent = (props: { gene: EnsObject }) => (
  <div>
    <span className={styles.featureSummaryStripLabel}>Gene</span>
    {props.gene.label && (
      <span className={styles.featureNameEmphasized}>{props.gene.label}</span>
    )}
    <span>{getDisplayStableId(props.gene)}</span>
  </div>
);

const FullContent = ({ gene }: { gene: EnsObject }) => (
  <>
    <div>
      <span className={styles.featureSummaryStripLabel}>Gene</span>
      {gene.label && (
        <span className={styles.featureNameEmphasized}>{gene.label}</span>
      )}
      <span>{getDisplayStableId(gene)}</span>
    </div>
    {gene.bio_type && <div>{gene.bio_type.toLowerCase()}</div>}
    <div>{gene.strand} strand</div>
    <div>{getFormattedLocation(gene.location)}</div>
  </>
);

export default GeneSummaryWrapper;
