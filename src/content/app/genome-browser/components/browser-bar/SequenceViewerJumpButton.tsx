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

import { useNavigate } from 'react-router';
import classNames from 'classnames';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { getGenomicLocationString } from 'src/shared/helpers/genomicLocationHelpers';

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { MAX_VIEWABLE_LOCATION_SIZE } from 'src/content/app/sequence-viewer/constants/sequence-viewer-location-constants';

import { ImageButton } from 'src/shared/components/image-button/ImageButton';
import { SequenceViewerIcon } from 'src/shared/components/app-icon';

import { Status } from 'src/shared/types/status';

import styles from './BrowserBar.module.css';

const SequenceViewerJumpButton = () => {
  const chrLocation = useAppSelector(getActualChrLocation);
  const { activeGenomeId, genomeIdForUrl } = useGenomeBrowserIds();
  const navigate = useNavigate();

  const onClick = () => {
    if (!chrLocation) {
      return;
    }
    const [regionName, start, end] = chrLocation;
    const locationString = getGenomicLocationString({
      regionName,
      start,
      end
    });
    const focusLocationString = buildFocusIdForUrl({
      type: 'location',
      objectId: locationString
    });
    const sequenceViewerUrl = urlFor.sequenceViewer({
      genomeId: genomeIdForUrl,
      focusObject: focusLocationString
    });
    navigate(sequenceViewerUrl);
  };

  const buttonDescription = 'Open in Sequence Viewer';

  if (!activeGenomeId || !chrLocation) {
    return null;
  }

  const [, start, end] = chrLocation;

  const currentLocationSize = Math.abs(end - start);
  const shouldDisableButton = currentLocationSize > MAX_VIEWABLE_LOCATION_SIZE;

  const componentClasses = classNames(styles.sequenceViewerJumpButton);

  return (
    <ImageButton
      onClick={onClick}
      image={SequenceViewerIcon}
      status={shouldDisableButton ? Status.DISABLED : Status.DEFAULT}
      description={buttonDescription}
      className={componentClasses}
      aria-label={buttonDescription}
    />
  );
};

export default SequenceViewerJumpButton;
