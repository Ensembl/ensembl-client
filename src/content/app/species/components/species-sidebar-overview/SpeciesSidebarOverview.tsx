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
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getActiveGenomeSidebarPayload } from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';

import { fetchSidebarPayload } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';

import styles from './SpeciesSidebarOverview.scss';

const SpeciesSidebarOverview = () => {
  const dispatch = useAppDispatch();
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const sidebarPayload = useAppSelector(getActiveGenomeSidebarPayload);
  useEffect(() => {
    if (!sidebarPayload) {
      dispatch(fetchSidebarPayload());
    }
  }, [sidebarPayload, activeGenomeId]);

  if (!sidebarPayload) {
    return <div>No data to display</div>;
  }

  type AnnotationEntry = {
    label: string;
    value?: string | null;
    url?: string;
  };
  const assemblyDate = new Date(sidebarPayload.assembly_date);
  const formattedAssemblyDate = Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric'
  }).format(assemblyDate);
  const annotationEntries: AnnotationEntry[][] = [
    [
      {
        label: 'Provider',
        value: sidebarPayload.annotation_provider.name,
        url: sidebarPayload.annotation_provider.url
      },
      { label: 'Method', value: sidebarPayload.annotation_method }
    ],
    [
      { label: 'Assembly date', value: formattedAssemblyDate },
      { label: 'Gencode version', value: sidebarPayload.gencode_version }
    ],
    [
      { label: 'Database version', value: sidebarPayload.database_version },
      { label: 'Taxonomy ID', value: sidebarPayload.taxonomy_id }
    ]
  ];

  return (
    <div>
      <div className={styles.speciesDetails}>
        {sidebarPayload.common_name && (
          <span className={styles.commonName}>
            {sidebarPayload.common_name}
          </span>
        )}
        {sidebarPayload.scientific_name && (
          <span className={styles.scientificName}>
            {sidebarPayload.scientific_name}
          </span>
        )}
      </div>

      {sidebarPayload.strain && (
        <div className={styles.strainDetails}>
          <span className={styles.strainType}>
            {sidebarPayload.strain.type}
          </span>
          <span className={styles.strainValue}>
            {sidebarPayload.strain.value}
          </span>
        </div>
      )}

      <div className={styles.sectionHead}>Assembly</div>
      <div className={styles.assemblyDetails}>
        <div className={styles.assemblyName}>
          {sidebarPayload.assembly_name}
        </div>

        <div className={styles.assemblySource}>
          <ExternalReference
            label={sidebarPayload.assembly_provider.name}
            linkText={sidebarPayload.id}
            to={sidebarPayload.assembly_provider.url}
          />
        </div>
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Assembly level</div>
          <div className={styles.boldValue}>
            {sidebarPayload.assembly_level}
          </div>
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

      {sidebarPayload.notes.map((note, index) => {
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

export default SpeciesSidebarOverview;
