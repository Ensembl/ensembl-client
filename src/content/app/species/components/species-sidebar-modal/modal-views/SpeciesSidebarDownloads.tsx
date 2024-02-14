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

import { useSpeciesFtpLinksQuery } from 'src/content/app/species/state/api/speciesApiSlice';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import styles from './SpeciesSidebarDownloads.module.css';

const SpeciesSidebarDownloads = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId) || '';
  const { data: ftpLinksResponse } = useSpeciesFtpLinksQuery(activeGenomeId, {
    skip: !activeGenomeId
  });
  const ftpLinks = ftpLinksResponse || [];
  const linkSections: Record<string, string> = {};

  for (const link of ftpLinks) {
    linkSections[link.dataset] = link.url;
  }

  return (
    <div>
      {linkSections.assembly && (
        <section>
          <div className={styles.sectionHead}>Assembly</div>
          <SpeciesFtpLink title="DNA sequence" link={linkSections.assembly}>
            FASTA
          </SpeciesFtpLink>
        </section>
      )}
      <section>
        <div className={styles.sectionHead}>Annotation</div>
        {linkSections.genebuild && (
          <SpeciesFtpLink
            title="Genes, cDNA, ncRNA, proteins"
            link={linkSections.genebuild}
          >
            FASTA/GTF/GFF3
          </SpeciesFtpLink>
        )}
        {linkSections.variation && (
          <SpeciesFtpLink title="Variation" link={linkSections.variation}>
            VCF
          </SpeciesFtpLink>
        )}
        {linkSections.homologies && (
          <SpeciesFtpLink title="Homologies" link={linkSections.homologies}>
            TSV
          </SpeciesFtpLink>
        )}
        {linkSections.regulation && (
          <SpeciesFtpLink title="Regulation" link={linkSections.regulation}>
            BigBED/TSV/GFF3/BigWig
          </SpeciesFtpLink>
        )}
      </section>
    </div>
  );
};

const SpeciesFtpLink = (props: {
  title: string;
  link: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={styles.SpeciesFtpLink}>
      <div className={styles.SpeciesFtpLinkTitle}>{props.title}</div>
      <ExternalLink to={props.link}>{props.children}</ExternalLink>
    </div>
  );
};

export default SpeciesSidebarDownloads;
