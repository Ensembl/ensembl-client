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

import { useAppSelector, useAppDispatch } from 'src/store';

import { isExpandedTranscriptsListModified } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';
import { toggleTranscriptInfo } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

type TranscriptWithCanonicalMetadata = {
  stable_id: string;
  metadata: {
    canonical: unknown; // we don't really care; what's important is whether this field is null or not
  };
};

type Params = {
  geneStableId: string;
  transcripts: TranscriptWithCanonicalMetadata[];
  skip?: boolean;
};

// When the default sorting rule is applied to the list of gene's transcripts,
// the canonical transcript is always put on the first place.
// Knowing this, and also knowing that every gene will always have a canonical transcript,
// we can simply find the canonical transcript among gene's transcripts, and expand it in the initial view
const useExpandedDefaultTranscript = (params: Params) => {
  const { transcripts, skip = false } = params;
  const dispatch = useAppDispatch();
  const haveTranscriptsBeenExpanded = useAppSelector(
    isExpandedTranscriptsListModified
  );

  useEffect(() => {
    if (haveTranscriptsBeenExpanded || skip) {
      return; // nothing to do
    }

    const canonicalTranscript = transcripts.find((transcript) =>
      Boolean(transcript.metadata.canonical)
    );

    if (canonicalTranscript?.stable_id) {
      // a bit of defensive programming:
      // there's something very wrong with our data if a gene doesn't have a canonical transcript;
      // but at least the code won't crash here
      dispatch(toggleTranscriptInfo(canonicalTranscript.stable_id));
    }
  }, [params.geneStableId]);
};

export default useExpandedDefaultTranscript;
