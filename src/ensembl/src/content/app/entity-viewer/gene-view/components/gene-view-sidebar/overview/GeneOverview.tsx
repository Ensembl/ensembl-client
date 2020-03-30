import React from 'react';
import { connect } from 'react-redux';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import MainAccordion from './MainAccordion';
import PublicationsAccordion from './PublicationsAccordion';

import {
  getEntityViewerSidebarPayload,
  getEntityViewerSidebarUIState
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { updateEntityUI } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import { RootState } from 'src/store';
import JSONValue from 'src/shared/types/JSON';
import { EntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

import styles from './GeneOverview.scss';

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
  sidebarUIState: { [key: string]: JSONValue } | null;
  updateEntityUI: (uIstate: { [key: string]: JSONValue }) => void;
};

const GeneOverview = (props: Props) => {
  if (!props.sidebarPayload) {
    return null;
  }
  const { gene } = props.sidebarPayload;
  return (
    <div>
      <div className={styles.geneDetails}>
        <span className={styles.geneSymbol}>{gene.symbol}</span>
        <span className={styles.stableId}>{gene.id}</span>
      </div>

      <div className={styles.sectionHead}>Gene name</div>

      <div className={styles.geneName}>
        <ExternalReference
          label={gene.name}
          linkText={gene.source?.value || ''}
          href={''}
        />
      </div>
      {gene.synonyms && (
        <div>
          <div className={styles.sectionHead}>Synonyms</div>
          <div className={styles.synonyms}>{gene.synonyms.join(', ')}</div>
        </div>
      )}
      {gene.attributes && (
        <div>
          <div className={styles.sectionHead}>Additional attributes</div>
          <div>
            {gene.attributes.map((attribute, key) => (
              <div key={key}> {attribute} </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <MainAccordion {...props} />
      </div>

      {props.sidebarPayload.homeologues && (
        <div className={styles.homeologues}>
          <div className={styles.sectionHead}>Homeologues</div>
          <div>
            {props.sidebarPayload.homeologues.map((homeologue, key) => (
              <div className={styles.standardLabelValue} key={key}>
                <div className={styles.label}>{homeologue.type}</div>
                <div className={styles.value}>
                  <a href={''}>{homeologue.stable_id}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {props.sidebarPayload.other_assemblies && (
        <div>
          <div className={styles.sectionHead}>
            Other assemblies with this gene
          </div>
          <div>
            {props.sidebarPayload.other_assemblies.map((otherAssembly, key) => (
              <div className={styles.otherAssembly} key={key}>
                <div className={styles.speciesName}>
                  {otherAssembly.species_name}
                </div>
                <div className={styles.geneName}>
                  {otherAssembly.assembly_name}
                </div>
                <div className={styles.stableId}>{otherAssembly.stable_id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {props.sidebarPayload.publications && (
          <PublicationsAccordion {...props} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  sidebarPayload: getEntityViewerSidebarPayload(state),
  sidebarUIState: getEntityViewerSidebarUIState(state)
});

const mapDispatchToProps = {
  updateEntityUI
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneOverview);
