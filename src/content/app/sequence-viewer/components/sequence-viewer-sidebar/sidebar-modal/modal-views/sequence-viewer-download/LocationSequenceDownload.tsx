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

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getGenomicLocationFromString } from 'src/shared/helpers/genomicLocationHelpers';
import { downloadSequence } from './downloadSequence';

import DownloadFileFormats from './DownloadFileFormats';
import { CircleLoader } from 'src/shared/components/loader';

import { useLocationSequenceDownloadOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

// FIXME: genomic location parsing should probably happen once in sequence viewer ids context
const getParsedLocation = (locationString: string) => {
  try {
    return getGenomicLocationFromString(locationString);
  } catch {
    return null;
  }
};

const LocationSequenceDownload = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();

  const locationString = parsedFocusObjectId?.objectId ?? '';
  const parsedLocation = getParsedLocation(locationString);

  const { currentData, isFetching, isError } =
    useLocationSequenceDownloadOptionsQuery(
      {
        genomeId: genomeId ?? '',
        regionName: parsedLocation?.regionName ?? '',
        start: parsedLocation?.start ?? 1,
        end: parsedLocation?.end ?? 1
      },
      {
        skip: !genomeId || !parsedLocation
      }
    );

  const onDownload = (params: {
    fileType: string;
    options: Record<string, boolean>;
  }) => {
    if (!genomeId || !parsedLocation) {
      // this should not happen
      return;
    }

    const downloadParams: Parameters<typeof downloadSequence>[0] = {
      genome_uuid: genomeId,
      focus_location: {
        region_name: parsedLocation.regionName,
        start: parsedLocation.start,
        end: parsedLocation.end
      },
      file_type: params.fileType
    };

    if (params.options) {
      downloadParams.options = params.options;
    }

    downloadSequence(downloadParams);
  };

  if (isFetching) {
    return <CircleLoader />;
  }

  if (isError) {
    return <div>An error occurred while fetching download options.</div>;
  }

  if (!currentData) {
    // this shouldn't happen
    return null;
  }

  return (
    <DownloadFileFormats
      formats={currentData.formats}
      onDownload={onDownload}
    />
  );
};

export default LocationSequenceDownload;
