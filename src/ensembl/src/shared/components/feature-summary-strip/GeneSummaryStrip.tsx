import React from 'react';
import classNames from 'classnames';

import { BreakpointWidth } from 'src/global/globalConfig';
import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

import styles from './FeatureSummaryStrip.scss';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type Props = {
  gene: EnsObject;
  isGhosted?: boolean;
  viewportWidth: BreakpointWidth;
};

const GeneSummaryStrip = ({ gene, isGhosted, viewportWidth }: Props) => {
  const stripClasses = classNames(styles.featureSummaryStrip, {
    [styles.featureSummaryStripGhosted]: isGhosted
  });

  const content =
    viewportWidth > BreakpointWidth.LAPTOP ? (
      <FullContent gene={gene} />
    ) : viewportWidth > BreakpointWidth.TABLET ? (
      <CompactContent gene={gene} />
    ) : (
      <MinimalContent gene={gene} />
    );

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

export default GeneSummaryStrip;
