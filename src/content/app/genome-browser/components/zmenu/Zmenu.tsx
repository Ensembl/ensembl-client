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
import pickBy from 'lodash/pickBy';
import usePrevious from 'src/shared/hooks/usePrevious';

import {
  ZmenuContentTranscript,
  ZmenuContentGene,
  ZmenuPayloadVariety,
  ZmenuPayloadVarietyType,
  ZmenuCreatePayload
} from '@ensembl/ensembl-genome-browser';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import { changeHighlightedTrackId } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import {
  Toolbox,
  ToolboxPosition,
  ToolboxExpandableContent
} from 'src/shared/components/toolbox';
import ZmenuContent from './ZmenuContent';
import ZmenuInstantDownload from './ZmenuInstantDownload';

import styles from './Zmenu.scss';

enum Direction {
  LEFT = 'left',
  RIGHT = 'right'
}

export type ZmenuProps = {
  zmenuId: string;
  payload: ZmenuCreatePayload;
  browserRef: React.RefObject<HTMLDivElement>;
};

const Zmenu = (props: ZmenuProps) => {
  const [anchorRef, setAnchorRef] = useRefWithRerender<HTMLDivElement>(null);
  const { zmenus, setZmenus } = useGenomeBrowser();
  const chromosomeLocation = useAppSelector(getActualChrLocation);
  const previousChromosomeLocation = usePrevious(chromosomeLocation);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (
      chromosomeLocation &&
      previousChromosomeLocation &&
      chromosomeLocation.toString() !== previousChromosomeLocation.toString()
    ) {
      destroyZmenu();
    }
  }, [chromosomeLocation]);

  const destroyZmenu = () => {
    dispatch(changeHighlightedTrackId(''));
    setZmenus && setZmenus(pickBy(zmenus, (_, key) => key !== props.zmenuId));
  };

  const direction = chooseDirection(props);
  const toolboxPosition =
    direction === Direction.LEFT ? ToolboxPosition.LEFT : ToolboxPosition.RIGHT;

  const { content, variety } = props.payload;
  const features: (ZmenuContentTranscript | ZmenuContentGene)[] = [];

  let featureId = '',
    transcriptId = '',
    transcript: ZmenuContentTranscript | undefined,
    gene: ZmenuContentGene | undefined;

  const zmenuType = variety.find((variety: ZmenuPayloadVariety) =>
    Boolean(variety.type)
  )?.type;

  if (zmenuType === ZmenuPayloadVarietyType.GENE_AND_ONE_TRANSCRIPT) {
    transcript = content.find(
      (feature: ZmenuContentTranscript | ZmenuContentGene) =>
        feature.metadata.type === 'transcript'
    ) as ZmenuContentTranscript;

    if (transcript) {
      features.push(transcript);

      gene = content.find(
        (feature: ZmenuContentTranscript | ZmenuContentGene) =>
          feature.metadata.type === 'gene' &&
          feature.metadata.id === transcript?.metadata.gene_id
      ) as ZmenuContentGene;

      if (gene) {
        features.push(gene);
      }

      transcriptId = transcript.metadata.transcript_id;
      featureId = `gene:${gene.metadata.id.split('.')[0]}`;
    }
  }

  useEffect(() => {
    gene && dispatch(changeHighlightedTrackId(gene.metadata.track));
  }, []);

  if (!transcript || !gene) {
    return null;
  }

  const mainContent = (
    <ZmenuContent
      features={features}
      featureId={featureId}
      destroyZmenu={destroyZmenu}
    />
  );
  const anchorStyles = getAnchorInlineStyles(props);

  return (
    <div ref={setAnchorRef} className={styles.zmenuAnchor} style={anchorStyles}>
      {anchorRef.current && (
        <Toolbox
          onOutsideClick={destroyZmenu}
          anchor={anchorRef.current}
          position={toolboxPosition}
        >
          <ToolboxExpandableContent
            mainContent={mainContent}
            footerContent={getToolboxFooterContent(transcriptId)}
          />
        </Toolbox>
      )}
    </div>
  );
};

const getAnchorInlineStyles = (params: ZmenuProps) => {
  const { x, y } = params.payload;
  return {
    left: `${x}px`,
    top: `${y}px`
  };
};

// choose how to position zmenu relative to its anchor point
const chooseDirection = (params: ZmenuProps) => {
  const browserElement = params.browserRef.current as HTMLDivElement;
  const { width } = browserElement.getBoundingClientRect();
  const { x } = params.payload;
  return x > width / 2 ? Direction.LEFT : Direction.RIGHT;
};

const getToolboxFooterContent = (id: string) => (
  <div className={styles.zmenuFooterContent}>
    <ZmenuInstantDownload id={id} />
  </div>
);

export default Zmenu;
