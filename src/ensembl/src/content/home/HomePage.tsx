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

import React from 'react';
import { Helmet } from 'react-helmet-async';
import loadable from '@loadable/component';

import useHasMounted from 'src/shared/hooks/useHasMounted';

const LoadableHome = loadable(() => import('./Home'));

const HomePage = () => {
  const hasMounted = useHasMounted();

  return (
    <>
      <Helmet>
        <title>Ensembl home page</title>
        <meta name="description" content="This is Ensembl home page" />
      </Helmet>
      {hasMounted && <LoadableHome />}
    </>
  );
};

export default HomePage;
