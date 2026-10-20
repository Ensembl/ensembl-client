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

import config from 'config';
import { downloadBlobAsFile } from 'src/shared/helpers/downloadAsFile';

type CommonDownloadParams = {
  file_type: string;
  genome_uuid: string;
  options?: Record<string, boolean | string | number>;
};

type LocationDownloadParams = {
  focus_location: {
    region_name: string;
    start: number;
    end: number;
  };
};

type GeneDownloadParams = {
  focus_gene: { stable_id: string };
};

type TranscriptDownloadParams = {
  focus_transcript: { stable_id: string };
};

type DownloadParams = CommonDownloadParams &
  (LocationDownloadParams | GeneDownloadParams | TranscriptDownloadParams);

const getFileName = (contentDisposition: string | null) => {
  if (!contentDisposition) {
    return 'sequence';
  }

  const encodedFileName = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i
  )?.[1];
  if (encodedFileName) {
    try {
      return decodeURIComponent(encodedFileName.trim().replace(/^"|"$/g, ''));
    } catch {
      // Fall back to the regular filename parameter if the encoded value is malformed.
      return 'sequence';
    }
  }

  const fileName = contentDisposition.match(/filename="?([^";]+)"?/i)?.[1];
  return fileName?.trim() || 'sequence';
};

export const downloadSequence = async (params: DownloadParams) => {
  const url = `${config.annotatedSequenceApi}/download`;

  if (!Object.keys(params.options ?? {}).length) {
    delete params.options;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(
        `Sequence download failed with status ${response.status}`
      );
    }

    const fileName = getFileName(response.headers.get('Content-Disposition'));
    const file = await response.blob();
    await downloadBlobAsFile(file, fileName);
  } catch {
    // FIXME: display an error somehow?
  }
};
