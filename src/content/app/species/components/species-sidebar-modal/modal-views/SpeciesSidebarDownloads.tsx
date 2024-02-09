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

import React from 'react';

import { useAppSelector } from 'src/store';
import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';

import { useSpeciesFileLinksQuery } from 'src/content/app/species/state/api/speciesApiSlice';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import styles from './SpeciesSidebarDownloads.module.css';

const SpeciesSidebarDownloads = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId) || '';
  const { data: fileLinksResponse } = useSpeciesFileLinksQuery(activeGenomeId, {
    skip: !activeGenomeId
  });
  const fileLinks = fileLinksResponse?.links || [];
  const linkSections: Record<string, string> = {};

  for (const link of fileLinks) {
    linkSections[link.dataset_type] = link.path;
  }

  return (
    <div>
      {linkSections.assembly && (
        <section>
          <div className={styles.sectionHead}>Assembly</div>
          <SpeciesFilesLink title="DNA sequence" link={linkSections.assembly}>
            FASTA
          </SpeciesFilesLink>
        </section>
      )}
      <section>
        <div className={styles.sectionHead}>Annotation</div>
        {linkSections.genebuild && (
          <SpeciesFilesLink
            title="Genes, cDNA, ncRNA, proteins"
            link={linkSections.genebuild}
          >
            FASTA/GTF/GFF3
          </SpeciesFilesLink>
        )}
        {linkSections.variation && (
          <SpeciesFilesLink title="Variation" link={linkSections.variation}>
            VCF
          </SpeciesFilesLink>
        )}
        {linkSections.homologies && (
          <SpeciesFilesLink title="Homologies" link={linkSections.homologies}>
            TSV
          </SpeciesFilesLink>
        )}
        {linkSections.regulation && (
          <SpeciesFilesLink title="Regulation" link={linkSections.regulation}>
            BigBED/TSV/GFF3/BigWig
          </SpeciesFilesLink>
        )}
      </section>
    </div>
  );
};

const SpeciesFilesLink = (props: {
  title: string;
  link: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={styles.speciesFilesLink}>
      <div className={styles.speciesFilesLinkTitle}>{props.title}</div>
      <ExternalLink to={props.link}>{props.children}</ExternalLink>
    </div>
  );
};

export default SpeciesSidebarDownloads;
