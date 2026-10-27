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

import type { CSSProperties } from 'react';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import useLocationSequenceSettings from 'src/content/app/sequence-viewer/hooks/useLocationSequenceSettings';

import useLocationSequence from './useLocationSequence';

import { CircleLoader } from 'src/shared/components/loader';

import Sequence from 'src/content/app/sequence-viewer/components/sequence/Sequence';

import commonStyles from '../../styles/sequence-viewer-common-styles.module.css';

type Props = {
  genomeId: string;
  location: string;
};

const LocationSequence = (props: Props) => {
  const { genomeId, location } = props;
  const {
    settings: sequenceSettings,
    isLoading: isLoadingSettings,
    isError: isSettingsError
  } = useLocationSequenceSettings({ genomeId, location });

  const {
    data,
    isLoading: isLoadingSequence,
    isError: isSequenceError
  } = useLocationSequence({
    genomeId,
    location,
    settings: sequenceSettings
  });
  const isLoading =
    isLoadingSettings || (!isSettingsError && isLoadingSequence);
  const isError = isSettingsError || (!isLoadingSettings && isSequenceError);

  if (isLoading) {
    return (
      <div className={commonStyles.main}>
        <div className={commonStyles.loadingSpinnerContainer}>
          <CircleLoader />
        </div>
      </div>
    );
  } else if (isError) {
    return <div>There has been an error fetching the sequence</div>;
  } else if (!data) {
    return null;
  }

  const { annotatedSequence, parsedLocation } = data;
  const formattedLocationEnd = formatNumber(parsedLocation.end);
  const formattedLocationLength = formattedLocationEnd.length;

  const styles: CSSProperties & { '--gutter-width': string } = {
    '--gutter-width': `${formattedLocationLength}ch`
  };

  return (
    <div className={commonStyles.main} style={styles}>
      <Sequence sequence={annotatedSequence} />
    </div>
  );
};

export default LocationSequence;
