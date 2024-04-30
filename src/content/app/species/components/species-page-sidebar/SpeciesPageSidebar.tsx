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

import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';

import { updateSpeciesSidebarModalForGenome } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';

import Sidebar from 'src/shared/components/layout/sidebar/Sidebar';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import DownloadIcon from 'static/icons/icon_download.svg';

import { SpeciesSidebarModalView } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';
import type { GenomeInfo } from 'src/shared/state/genome/genomeTypes';

import styles from './SpeciesPageSidebar.module.css';

type Props = {
  data: GenomeInfo;
};

const SpeciesPageSidebar = (props: Props) => {
  const { data } = props;

  return (
    <Sidebar>
      <section className={styles.section}>
        <div className={styles.fieldsGroup}>
          <div>
            {data.common_name && (
              <span className={styles.commonName}>{data.common_name}</span>
            )}
            <span className={styles.scientificName}>
              {data.scientific_name}
            </span>
          </div>
          <SpeciesType {...data} />
        </div>
      </section>

      {/*  There will be buttons to find a gene here */}

      <div className={styles.sectionHead}>Assembly</div>
      <section className={styles.section}>
        <div className={styles.fieldsGroup}>
          <div className={styles.assemblyName}>{data.assembly.name}</div>
          <div className={styles.assemblySource}>
            <ExternalReference to={data.assembly.url}>
              {data.assembly.accession_id}
            </ExternalReference>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Assembly level</span>
          <span className={styles.assemblyLevel}>{data.assembly_level}</span>
        </div>
      </section>

      <div className={styles.sectionHead}>Annotation</div>
      <section className={styles.section}>
        <div className={styles.fieldsGroup}>
          <AnnotationProvider {...data} />
          <AnnotationMethod {...data} />
        </div>

        <div className={styles.fieldsGroup}>
          <AnnotationDate {...data} />
          <AnnotationVersion {...data} />
        </div>

        <div className={styles.fieldsGroup}>
          <div className={styles.field}>
            <span className={styles.label}>Taxonomy ID</span>
            <span>{data.taxonomy_id}</span>
          </div>
          <AssemblyDate {...data} />
        </div>
      </section>

      <section className={classNames(styles.section, styles.getFilesSection)}>
        <GetFilesButton />
      </section>
    </Sidebar>
  );
};

const SpeciesType = (props: GenomeInfo) => {
  const { type, is_reference } = props;

  if (!is_reference && !type) {
    return null;
  }

  const referenceTextElement = is_reference ? (
    <span className={styles.reference}>Reference</span>
  ) : null;

  const typeTextElement = type ? (
    <span>
      {upperFirst(type.kind)} - {type.value}
    </span>
  ) : null;

  return (
    <div className={styles.field}>
      <span className={styles.label}>Type</span>
      <span>
        {typeTextElement}
        {typeTextElement ? ', ' : ''}
        {referenceTextElement}
      </span>
    </div>
  );
};

const AnnotationProvider = (props: GenomeInfo) => {
  const { annotation_provider } = props;

  if (!annotation_provider) {
    return null;
  }

  const annotationProviderElement = annotation_provider.url ? (
    <ExternalLink to={annotation_provider.url}>
      {annotation_provider.name}
    </ExternalLink>
  ) : (
    <span>{annotation_provider.name}</span>
  );

  return (
    <div className={styles.field}>
      <span className={styles.label}>Provider</span>
      <span className={styles.annotationProvider}>
        {annotationProviderElement}
      </span>
    </div>
  );
};

const AnnotationMethod = (props: GenomeInfo) => {
  const { annotation_method } = props;

  if (!annotation_method) {
    return null;
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>Method</span>
      {annotation_method}
    </div>
  );
};

const AnnotationDate = (props: GenomeInfo) => {
  const { annotation_date } = props;

  if (!annotation_date) {
    return null;
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>Last updated</span>
      {annotation_date}
    </div>
  );
};

const AnnotationVersion = (props: GenomeInfo) => {
  const { annotation_version } = props;

  if (!annotation_version) {
    return null;
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>Annotation version</span>
      {annotation_version}
    </div>
  );
};

const AssemblyDate = (props: GenomeInfo) => {
  const { assembly_date } = props;

  if (!assembly_date) {
    return null;
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>Assembly released</span>
      {assembly_date}
    </div>
  );
};

const GetFilesButton = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId) as string;
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(
      updateSpeciesSidebarModalForGenome({
        activeGenomeId,
        fragment: { sidebarModalView: SpeciesSidebarModalView.DOWNLOAD }
      })
    );
  };

  return (
    <button className={styles.getFiles} onClick={onClick}>
      <span>Get files</span>
      <span className={styles.downloadIcon}>
        <DownloadIcon />
      </span>
    </button>
  );
};

export default SpeciesPageSidebar;
