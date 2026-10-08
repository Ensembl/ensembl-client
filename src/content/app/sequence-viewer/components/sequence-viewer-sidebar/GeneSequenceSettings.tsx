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

import { useEffect, useCallback } from 'react';
import { Link } from 'react-router';

import { useAppDispatch, useAppSelector } from 'src/store';
import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import {
  setInitialSequenceSettings,
  updateSequenceSettings,
  createInitialGeneSettings,
  type SequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import { useGeneSequenceOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import { SequenceOptionsSections } from 'src/content/app/sequence-viewer/components/sequence-viewer-sidebar/sequence-options/SequenceOptions';

const brca2Url = '/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000139618';
const mapk10Url =
  '/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000109339'; // 604,619
const dmdUrl = '/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000198947'; // 2,241,933

const GeneSequenceSetttings = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();
  const geneId = parsedFocusObjectId?.objectId;
  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, genomeId ?? '')
  );
  const dispatch = useAppDispatch();

  const { data } = useGeneSequenceOptionsQuery(
    {
      geneId: geneId ?? '',
      genomeId: genomeId ?? ''
    },
    {
      skip: !geneId || !genomeId
    }
  );

  const onSettingsChange = useCallback(
    (options: SequenceSettings['options']) => {
      if (!genomeId || !geneId) {
        // this shouldn't be possible
        return;
      }

      dispatch(
        updateSequenceSettings({
          type: 'gene',
          genomeId,
          geneId,
          options
        })
      );
    },
    [dispatch, genomeId, geneId]
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const initialSettings = createInitialGeneSettings({
      geneId: geneId as string,
      payload: data
    });

    dispatch(
      setInitialSequenceSettings({
        genomeId: genomeId as string,
        settings: initialSettings
      })
    );
  }, [dispatch, genomeId, data, geneId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '0.6rem' }}>
      <Link to={brca2Url}>BRCA2 (85,183 bp)</Link>
      <Link to={mapk10Url}>MAPK10 (604,619 bp)</Link>
      <Link to={dmdUrl}>DMD (2,241,933 bp)</Link>

      {data && sequenceSettings?.options && (
        <SequenceOptionsSections
          appliedSettings={sequenceSettings.options}
          onSettingsChange={onSettingsChange}
          sections={data.sections}
        />
      )}
    </div>
  );
};

export default GeneSequenceSetttings;
