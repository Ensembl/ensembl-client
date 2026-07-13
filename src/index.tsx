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

<<<<<<< HEAD
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
=======
import { isUnsupportedBrowser } from 'src/shared/helpers/browserSupport';
import { checkGenomes } from './checkGenomes';
>>>>>>> 978280bf (Check locally stored genomes when the app initialises, and update them if needed)

const main = async () => {
  if (isUnsupportedBrowser()) {
    window.location.replace('/unsupported-browser');
    return;
  }

  // run checks for genomes
  await checkGenomes();

  await import('./initialiseClient');
};

main();
