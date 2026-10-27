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

import { useAppSelector } from 'src/store';

import { downloadSequence } from './downloadSequence';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';
import { prepareOptionsForPayload } from 'src/content/app/sequence-viewer/utils/fetchAnnotatedSequence';

import DownloadFileFormats from './DownloadFileFormats';
import { CircleLoader } from 'src/shared/components/loader';

import { useGeneSequenceDownloadOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import type { TranscriptSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

const GeneSequenceDownload = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();
  const geneId = parsedFocusObjectId?.objectId ?? '';

  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'gene',
      genomeId: genomeId ?? '',
      geneId
    })
  );

  const { currentData, isFetching, isError } =
    useGeneSequenceDownloadOptionsQuery(
      {
        genomeId: genomeId ?? '',
        geneId
      },
      {
        skip: !genomeId || !geneId
      }
    );

  const onDownload = (params: {
    fileType: string;
    useSequenceOptions?: boolean;
    options?: Record<string, boolean>;
  }) => {
    if (!genomeId || !geneId) {
      // this should not happen
      return;
    }

    const downloadParams: Parameters<typeof downloadSequence>[0] = {
      genome_uuid: genomeId,
      focus_gene: { stable_id: geneId },
      file_type: params.fileType
    };

    if (params.useSequenceOptions) {
      const options = prepareOptionsForPayload(
        sequenceSettings as TranscriptSequenceSettings
      );
      downloadParams.options = options;
    } else if (params.options) {
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

export default GeneSequenceDownload;
