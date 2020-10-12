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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getActiveGenomeSidebarPayload } from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';

import { RootState } from 'src/store';
import {
  SpeciesSidebarPayload,
  fetchSidebarPayload
} from 'src/content/app/species/state/sidebar/speciesSidebarSlice';

import styles from './SpeciesSidebar.scss';

type Props = {
  activeGenomeId: string | null;
  sidebarPayload?: SpeciesSidebarPayload | null;
  fetchSidebarPayload: () => void;
};

const SpeciesSidebar = (props: Props) => {
  useEffect(() => {
    if (!props.sidebarPayload) {
      props.fetchSidebarPayload();
    }
  }, [props.sidebarPayload, props.activeGenomeId]);

  if (!props.sidebarPayload) {
    return <div>No data to display</div>;
  }
  const {
    species,
    assembly,
    annotation,
    psuedoautosomal_regions
  } = props.sidebarPayload;

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.geneDetails}>
        <span className={styles.geneSymbol}>{species.display_name}</span>
        <span className={styles.stableId}>{species.scientific_name}</span>
      </div>

      <div className={styles.sectionHead}>Assembly</div>
      <div className={styles.assemblyDetails}>
        <div className={styles.assemblyName}>{assembly.name}</div>

        <div className={styles.assemblySource}>
          <ExternalReference
            label={assembly.source.name}
            linkText={assembly.source.id}
            to={assembly.source.url}
          />
        </div>
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Assembly level</div>
          <div className={styles.value}>{assembly.level}</div>
        </div>
      </div>

      <div className={styles.sectionHead}>Annotation</div>
      <div className={styles.annotationDetails}>
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Provider</div>
          <div className={styles.value}>{annotation.provider}</div>
          <div className={styles.label}>Method</div>
          <div className={styles.value}>{annotation.method}</div>
          <br />

          <div className={styles.label}>Last updated/patched</div>
          <div className={styles.value}>{annotation.last_updated_date}</div>
          <div className={styles.label}>Gencode version</div>
          <div className={styles.value}>{annotation.gencode_version}</div>
          <br />

          <div className={styles.label}>Database version</div>
          <div className={styles.value}>{annotation.database_version}</div>
          <div className={styles.label}>Taxonomy ID</div>
          <div className={styles.value}>{annotation.taxonomy_id}</div>
        </div>
      </div>

      <div className={styles.sectionHead}>Psuedoautosomal regions</div>
      <div>{psuedoautosomal_regions.description}</div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getActiveGenomeId(state),
  sidebarPayload: getActiveGenomeSidebarPayload(state)
});

const mapDispatchToProps = {
  fetchSidebarPayload
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesSidebar);
