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
import { useEffect } from 'react';

import config from 'config';

const HOTJAR_ID = 2555715; // if we discover that this needs to be updated, we will extract it into an environment variable
const HOTJAR_SCRIPT_VERSION = 6;
const scriptSrc = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=${HOTJAR_SCRIPT_VERSION}`;

const ThirdPartyScripts = () => {
  const { shouldReportAnalytics } = config;

  if (shouldReportAnalytics) {
    return <HotjarScript />;
  } else {
    return null;
  }
};

// TODO: remove as soon as it is no longer needed
export const HotjarScript = () => {
  useEffect(() => {
    if (!('hj' in window)) {
      (window as any).hj = hotjarQueue;
    }
    (window as any)._hjSettings = {
      hjid: HOTJAR_ID,
      hjsv: HOTJAR_SCRIPT_VERSION
    };

    const script = document.createElement('script');
    script.src = scriptSrc;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

function hotjarQueue() {
  (window as any).hj.q = (window as any).hj.q || [];
  (window as any).hj.q.push(arguments); // eslint-disable-line prefer-rest-params
}

export default ThirdPartyScripts;
