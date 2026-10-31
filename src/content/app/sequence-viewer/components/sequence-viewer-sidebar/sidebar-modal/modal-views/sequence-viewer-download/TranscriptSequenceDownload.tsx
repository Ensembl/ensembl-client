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

import { useSearchParams } from 'react-router';

import { useAppSelector } from 'src/store';

import { downloadSequence } from './downloadSequence';
import { getTranscriptSequenceViewFromSearchParams } from 'src/content/app/sequence-viewer/utils/getTranscriptSequenceView';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';
import { prepareOptionsForPayload } from 'src/content/app/sequence-viewer/utils/fetchAnnotatedSequence';

import DownloadFileFormats from './DownloadFileFormats';
import { CircleLoader } from 'src/shared/components/loader';

import { useTranscriptSequenceDownloadOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import type { TranscriptSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

const TranscriptSequenceDownload = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();
  const transcriptId = parsedFocusObjectId?.objectId ?? '';
  const [searchParams] = useSearchParams(); // FIXME: move the discovery of transcript view from url into some shared place

  const transcriptView =
    getTranscriptSequenceViewFromSearchParams(searchParams);

  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'transcript',
      genomeId: genomeId ?? '',
      transcriptId: transcriptId ?? '',
      sequenceView: transcriptView
    })
  );

  const { currentData, isFetching, isError } =
    useTranscriptSequenceDownloadOptionsQuery(
      {
        genomeId: genomeId ?? '',
        sequenceType: 'genomic',
        transcriptId
      },
      {
        skip: !genomeId || !transcriptId
      }
    );

  const onDownload = async (params: {
    fileType: string;
    useSequenceOptions?: boolean;
    options?: Record<string, boolean>;
  }) => {
    if (!genomeId || !transcriptId) {
      // this should not happen
      return;
    }

    const downloadParams: Parameters<typeof downloadSequence>[0] = {
      genome_uuid: genomeId,
      focus_transcript: { stable_id: transcriptId },
      file_type: params.fileType
    };

    if (params.useSequenceOptions) {
      const options = prepareOptionsForPayload(
        sequenceSettings as TranscriptSequenceSettings
      );
      downloadParams.sequence_type = 'genomic';
      downloadParams.options = options;
    } else if (params.options) {
      downloadParams.options = params.options;
    }

    await downloadSequence(downloadParams);
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

export default TranscriptSequenceDownload;
