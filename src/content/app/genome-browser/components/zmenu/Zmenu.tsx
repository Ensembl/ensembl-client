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

import { useEffect } from 'react';

import * as React from 'react';
import pickBy from 'lodash/pickBy';
import usePrevious from 'src/shared/hooks/usePrevious';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import { changeHighlightedTrackId } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { Toolbox, ToolboxPosition } from 'src/shared/components/toolbox';
import GeneAndOneTranscriptZmenu from './zmenus/GeneAndOneTranscriptZmenu';
import VariantZmenu from './zmenus/VariantZmenu';
import RegulationZmenu from './zmenus/RegulationZmenu';
import DefaultZmenu from './zmenus/DefaultZmenu';

import {
  ZmenuPayloadVarietyType,
  type ZmenuPayloadVariety,
  type ZmenuPayload
} from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';

import styles from './Zmenu.module.css';

enum Direction {
  LEFT = 'left',
  RIGHT = 'right'
}

export type ZmenuProps = {
  zmenuId: string;
  payload: ZmenuPayload;
  containerRef: React.RefObject<HTMLDivElement>;
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

  const { variety } = props.payload;

  let zmenuContent: React.ReactNode = null;

  const zmenuType = variety.find((variety: ZmenuPayloadVariety) =>
    Boolean(variety.type)
  )?.['zmenu-type'];

  if (zmenuType === ZmenuPayloadVarietyType.GENE_AND_ONE_TRANSCRIPT) {
    zmenuContent = (
      <GeneAndOneTranscriptZmenu
        payload={props.payload}
        onDestroy={destroyZmenu}
      />
    );
  } else if (zmenuType === ZmenuPayloadVarietyType.VARIANT) {
    zmenuContent = (
      <VariantZmenu payload={props.payload} onDestroy={destroyZmenu} />
    );
  } else if (zmenuType === ZmenuPayloadVarietyType.REGULATION) {
    zmenuContent = (
      <RegulationZmenu payload={props.payload} onDestroy={destroyZmenu} />
    );
  } else {
    zmenuContent = (
      <DefaultZmenu payload={props.payload} onDestroy={destroyZmenu} />
    );
  }

  const anchorStyles = getAnchorInlineStyles(props);

  return (
    <div ref={setAnchorRef} className={styles.zmenuAnchor} style={anchorStyles}>
      {anchorRef.current && (
        <Toolbox
          onOutsideClick={destroyZmenu}
          anchor={anchorRef.current}
          position={toolboxPosition}
          className={styles.toolbox}
        >
          {zmenuContent}
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
  const browserElement = params.containerRef.current as HTMLDivElement;
  const { width } = browserElement.getBoundingClientRect();
  const { x } = params.payload;
  return x > width / 2 ? Direction.LEFT : Direction.RIGHT;
};

export default Zmenu;
