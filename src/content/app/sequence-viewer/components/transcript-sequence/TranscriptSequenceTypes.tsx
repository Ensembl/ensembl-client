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

import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import classNames from 'classnames';

import TabButton from 'src/shared/components/tab-button/TabButton';

import styles from './TranscriptSequenceTypes.module.css';

const TranscriptSequenceTypes = () => {
  const urlLocation = useLocation();
  const { pathname, search } = urlLocation;
  const navigate = useNavigate();

  const view = new URLSearchParams(search).get('view') ?? 'genomic';

  const changeView = (view: string) => {
    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set('view', view);
    const queryString = decodeURIComponent(newSearchParams.toString());
    const newUrl = `${pathname}?${queryString}`;
    navigate(newUrl);
  };

  return (
    <div className={styles.tabs}>
      <TabButton
        pressed={view === 'genomic'}
        className={
          classNames({ [styles.tabButtonPressed]: view === 'genomic' }) ??
          undefined
        }
        onClick={() => changeView('genomic')}
      >
        Genomic
      </TabButton>
      <TabButton
        pressed={view === 'cdna'}
        className={
          classNames({ [styles.tabButtonPressed]: view === 'cdna' }) ??
          undefined
        }
        onClick={() => changeView('cdna')}
      >
        cDNA
      </TabButton>
      <TabButton
        pressed={view === 'cds'}
        className={
          classNames({ [styles.tabButtonPressed]: view === 'cds' }) ?? undefined
        }
        onClick={() => changeView('cds')}
      >
        CDS
      </TabButton>
      <TabButton
        pressed={view === 'protein'}
        className={
          classNames({ [styles.tabButtonPressed]: view === 'protein' }) ??
          undefined
        }
        onClick={() => changeView('protein')}
      >
        Protein
      </TabButton>
    </div>
  );
};

export default memo(TranscriptSequenceTypes);
