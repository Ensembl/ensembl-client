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
import classNames from 'classnames';

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
  const payload = props.sidebarPayload;

  type AnnotationEntry = {
    label: string;
    value?: string | null;
    url?: string;
  };
  const assemblyDate = new Date(payload.assembly_date);
  const formattedAssemblyDate = Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric'
  }).format(assemblyDate);
  const annotationEntries: AnnotationEntry[][] = [
    [
      {
        label: 'Provider',
        value: payload.annotation_provider.name,
        url: payload.annotation_provider.url
      },
      { label: 'Method', value: payload.annotation_method }
    ],
    [
      { label: 'Assembly date', value: formattedAssemblyDate },
      { label: 'Gencode version', value: payload.gencode_version }
    ],
    [
      { label: 'Database version', value: payload.database_version },
      { label: 'Taxonomy ID', value: payload.taxonomy_id }
    ]
  ];

  return (
    <div>
      <div className={styles.speciesDetails}>
        <span className={styles.common_name}>{payload.common_name}</span>
        <span className={styles.scientific_name}>
          {payload.scientific_name}
        </span>
      </div>

      {payload.strain && (
        <div className={styles.strainDetails}>
          <span className={styles.strain_type}>{payload.strain.type}</span>
          <span className={styles.strain_value}>{payload.strain.value}</span>
        </div>
      )}

      <div className={styles.sectionHead}>Assembly</div>
      <div className={styles.assemblyDetails}>
        <div className={styles.assemblyName}>{payload.assembly_name}</div>

        <div className={styles.assemblySource}>
          <ExternalReference
            label={payload.assembly_provider.name}
            linkText={payload.id}
            to={payload.assembly_provider.url}
          />
        </div>
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Assembly level</div>
          <div className={styles.boldValue}>{payload.assembly_level}</div>
        </div>
      </div>

      <div className={styles.sectionHead}>Annotation</div>
      <div className={styles.annotationDetails}>
        {annotationEntries.map((entries, group_index) => {
          return (
            <div key={group_index}>
              {entries.map((entry, entry_index) => {
                const labelClassNames = classNames(styles.label, {
                  [styles.labelShort]: group_index === 0
                });

                return entry.value ? (
                  <div key={entry_index} className={styles.standardLabelValue}>
                    <div className={labelClassNames}>{entry.label}</div>
                    <div className={styles.value}>
                      {entry.url && entry.value !== 'Ensembl' ? (
                        <ExternalReference
                          to={entry.url}
                          linkText={entry.value}
                        ></ExternalReference>
                      ) : (
                        entry.value
                      )}
                    </div>
                  </div>
                ) : null;
              })}
              <br />
            </div>
          );
        })}
      </div>

      {payload.notes.map((note, index) => {
        return (
          <div key={index}>
            <div className={styles.sectionHead}>{note.heading}</div>
            <div className={styles.notesContent}>
              {note.body.split('\n').map((content, key) => {
                return <p key={key}>{content}</p>;
              })}
            </div>
          </div>
        );
      })}
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
