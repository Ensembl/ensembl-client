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

import { useEffect, useCallback, type ReactNode, type RefObject } from 'react';
import pickBy from 'lodash/pickBy';
import usePrevious from 'src/shared/hooks/usePrevious';

import { useAppSelector } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useDOMElement from 'src/shared/hooks/useDOMElement';

import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { Toolbox, ToolboxPosition } from 'src/shared/components/toolbox';
import GeneAndOneTranscriptZmenu from './zmenus/GeneAndOneTranscriptZmenu';
import TranscriptZmenu from './zmenus/TranscriptZmenu';
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
  containerRef: RefObject<HTMLDivElement | null>;
};

const Zmenu = (props: ZmenuProps) => {
  const [anchor, setAnchorRef] = useDOMElement<HTMLDivElement>();
  const { zmenus, setZmenus } = useGenomeBrowser();
  const chromosomeLocation = useAppSelector(getActualChrLocation);
  const previousChromosomeLocation = usePrevious(chromosomeLocation);

  const destroyZmenu = useCallback(() => {
    setZmenus(pickBy(zmenus, (_, key) => key !== props.zmenuId));
  }, [props.zmenuId, setZmenus, zmenus]);

  useEffect(() => {
    if (
      chromosomeLocation &&
      previousChromosomeLocation &&
      chromosomeLocation.toString() !== previousChromosomeLocation.toString()
    ) {
      destroyZmenu();
    }
  }, [chromosomeLocation, previousChromosomeLocation, destroyZmenu]);

  const direction = chooseDirection(props);
  const toolboxPosition =
    direction === Direction.LEFT ? ToolboxPosition.LEFT : ToolboxPosition.RIGHT;

  const { variety } = props.payload;

  let zmenuContent: ReactNode = null;

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
  } else if (zmenuType === ZmenuPayloadVarietyType.TRANSCRIPT) {
    zmenuContent = (
      <TranscriptZmenu payload={props.payload} onDestroy={destroyZmenu} />
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
      {anchor && (
        <Toolbox
          onOutsideClick={destroyZmenu}
          anchor={anchor}
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
