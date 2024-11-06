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
import useHasMounted from 'src/shared/hooks/useHasMounted';
import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';
import { useAppDispatch } from 'src/store';
import { ServerFetch } from 'src/routes/routesConfig';
import { Route, Routes } from 'react-router-dom';

import NotFoundErrorScreen from 'src/shared/components/error-screen/NotFoundError';

import styles from './Biomart.module.css';
import Biomart from './Biomart';

const pageTitle = 'BioMart';
const pageDescription = `
Tables of Ensembl data can be downloaded via the highly customisable BioMart data mining tool. 
The easy-to-use web-based tool allows extraction of data without any programming knowledge or understanding of the underlying database structure.
`;

const BiomartPage = () => {
  const hasMounted = useHasMounted();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updatePageMeta({
        title: pageTitle,
        description: pageDescription
      })
    );
  }, []);

  return hasMounted ? (
    <div className={styles.biomartPage}>
      <Routes>
        <Route index element={<Biomart />} />
        <Route path="*" element={<NotFoundErrorScreen />} />
      </Routes>
    </div>
  ) : null;
};

export default BiomartPage;

// not really fetching anything; just setting page meta
export const serverFetch: ServerFetch = async (params) => {
  params.store.dispatch(
    updatePageMeta({
      title: pageTitle,
      description: pageDescription
    })
  );
};
