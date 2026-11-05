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

import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import '@ensembl/ensembl-data-distiller';

import config from 'config';

import DataDistillerAppBar from './components/data-distiller-app-bar/DataDistillerAppBar';

import type { DataDistiller as DataDistillerElement } from '@ensembl/ensembl-data-distiller';

import styles from './DataDistiller.module.css';

const DataDistiller = () => {
  return (
    <div className={styles.container}>
      <DataDistillerAppBar />
      <ens-data-distiller api-base-url={config.distillerApiBaseUrl} />
    </div>
  );
};

type DataDistillerElementProps = DetailedHTMLProps<
  HTMLAttributes<DataDistillerElement>,
  DataDistillerElement
> & {
  'api-base-url': string;
};

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-data-distiller': DataDistillerElementProps;
    }
  }
}

export default DataDistiller;
