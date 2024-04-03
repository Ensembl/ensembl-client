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

import { useAppDispatch } from 'src/store';

import { changeHighlightedTrackId } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import {
  ToolboxExpandableContent,
  ToggleButton as ToolboxToggleButton
} from 'src/shared/components/toolbox';
import ZmenuContent from '../ZmenuContent';
import ZmenuInstantDownload from '../ZmenuInstantDownload';
import ZmenuAppLinks from '../ZmenuAppLinks';

import type {
  ZmenuContentTranscript,
  ZmenuContentGene,
  ZmenuPayload
} from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';

import styles from '../Zmenu.module.css';

type Props = {
  payload: ZmenuPayload;
  onDestroy: () => void;
};

const GeneAndOneTranscriptZmenu = (props: Props) => {
  const { content } = props.payload;
  const dispatch = useAppDispatch();

  let featureId = '',
    transcriptId = '',
    gene: ZmenuContentGene | undefined;

  const features: (ZmenuContentTranscript | ZmenuContentGene)[] = [];

  const transcript = content.find(
    (feature) => feature.metadata.type === 'transcript'
  ) as ZmenuContentTranscript;

  if (transcript) {
    features.push(transcript);

    gene = content.find(
      (feature) =>
        feature.metadata.type === 'gene' &&
        (feature.metadata as ZmenuContentGene['metadata']).versioned_id ===
          transcript?.metadata.gene_id
    ) as ZmenuContentGene;

    if (gene) {
      features.push(gene);
    }

    transcriptId = transcript.metadata.versioned_id;
    featureId = `gene:${gene.metadata.unversioned_id}`;
  }

  useEffect(() => {
    gene && dispatch(changeHighlightedTrackId(gene.metadata.track));
  }, []);

  const mainContent = (
    <>
      <ZmenuContent
        features={features}
        featureId={featureId}
        destroyZmenu={props.onDestroy}
      />
      <div className={styles.zmenuLinksGrid}>
        <ToolboxToggleButton
          className={styles.zmenuToggleFooter}
          label="Download"
        />
        <ZmenuAppLinks featureId={featureId} destroyZmenu={props.onDestroy} />
      </div>
    </>
  );

  const footerContent = (
    <div className={styles.zmenuFooterContent}>
      <ZmenuInstantDownload id={transcriptId} />
    </div>
  );

  return (
    <ToolboxExpandableContent
      mainContent={mainContent}
      footerContent={footerContent}
    />
  );
};

export default GeneAndOneTranscriptZmenu;
