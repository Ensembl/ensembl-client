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
import noop from 'lodash/noop';

import PillButton from 'src/shared/components/pill-button/PillButton';

export default {
  title: 'Components/Shared Components/Pill button'
};

export const PlusButtonStory = () => (
  <>
    <div>
      <PillButton onClick={noop}>+2</PillButton>
    </div>
    <div>
      <PillButton onClick={noop}>+42</PillButton>
    </div>
    <div>
      <PillButton onClick={noop}>+512</PillButton>
    </div>
    <div>
      <PillButton onClick={noop}>+1234</PillButton>
    </div>
  </>
);

PlusButtonStory.storyName = 'default';
