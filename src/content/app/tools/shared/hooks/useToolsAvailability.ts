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

import { useState } from 'react';

const DISABLED_FROM = '2026-11-03T08:00:00+00:00'; // 8:00 AM, Tuesday, 3rd November 2026
const DISABLED_UNTIL = '2026-11-05T12:30:00+00:00'; // 12:00 PM, Thursday, 5th November 2026 (+30 minutes)

export const getInitialState = () => {
  const downtimeStart = new Date(DISABLED_FROM);
  const downtimeEnd = new Date(DISABLED_UNTIL);
  const currentTime = Date.now();

  const isDowntime =
    currentTime >= downtimeStart.getTime() &&
    currentTime <= downtimeEnd.getTime();

  if (isDowntime) {
    return {
      areToolsAvailable: false,
      downtimeMessage: getLocalDowntimeMessage()
    };
  } else {
    return {
      areToolsAvailable: true,
      downtimeMessage: null
    };
  }
};

const getLocalDowntimeMessage = () => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });

  return `
Due to scheduled infrastructure maintenance,
the BLAST and VEP tools on the Ensembl website will be unavailable from
${formatter.format(new Date(DISABLED_FROM))} until
${formatter.format(new Date(DISABLED_UNTIL))}.
`;
};

const useToolsAvailability = () => {
  const [state] = useState(getInitialState);

  return state;
};

export default useToolsAvailability;
