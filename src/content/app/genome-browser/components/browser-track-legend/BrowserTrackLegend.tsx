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

import { useState, useEffect, type RefObject } from 'react';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { Position as TooltipPosition } from 'src/shared/components/pointer-box/PointerBox';

import type { HotspotMessage } from 'src/content/app/genome-browser/services/genome-browser-service/types/genomeBrowserMessages';
import type { TrackLegendHotspotPayload } from 'src/content/app/genome-browser/services/genome-browser-service/types/hotspot';

import styles from './BrowserTrackLegend.module.css';

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
};

type Position = {
  x: number;
  y: number;
};

const BrowserTrackLegend = (props: Props) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [anchorRef, setAnchorRef] = useRefWithRerender<HTMLDivElement>(null);
  const { genomeBrowserService } = useGenomeBrowser();

  useEffect(() => {
    const subscription = genomeBrowserService?.subscribe(
      'hotspot',
      handleHotspot
    );

    return () => subscription?.unsubscribe();
  }, [genomeBrowserService]);

  const handleHotspot = (message: HotspotMessage) => {
    const { payload } = message;
    if (!isTrackLegendHotspot(payload)) {
      return;
    }

    const { bottom, top, right } = payload['hotspot-area'];
    const toolTipX = right - 5;
    const toolTipY = top + (bottom - top) / 2 + 4;

    if (payload.start) {
      setPosition({ x: toolTipX, y: toolTipY });
    } else {
      setPosition(null);
    }
  };

  return position ? (
    <>
      <div
        ref={setAnchorRef}
        className={styles.anchor}
        style={{ top: position.y, left: position.x }}
      />
      {anchorRef.current && (
        <Tooltip
          container={props.containerRef.current}
          position={TooltipPosition.RIGHT_BOTTOM}
          autoAdjust={true}
          renderInsideAnchor={true}
          delay={300}
          anchor={anchorRef.current}
        >
          <Message />
        </Tooltip>
      )}
    </>
  ) : null;
};

const isTrackLegendHotspot = (payload: {
  variety: { type: string }[];
}): payload is TrackLegendHotspotPayload => {
  return payload.variety[0].type === 'track-hover';
};

const Message = () => (
  <div className={styles.message}>
    <p>
      Indicates the tab at the top of the panel on the right where this track is
      listed
    </p>
    <ul>
      <li>
        <span>Genomic</span>
      </li>
      <li>
        <span>Variation</span>
      </li>
      <li>
        <span>Regulation</span>
      </li>
    </ul>
    <p>
      Where relevant, an arrow also indicates the orientation of features on a
      track
    </p>
  </div>
);

export default BrowserTrackLegend;
