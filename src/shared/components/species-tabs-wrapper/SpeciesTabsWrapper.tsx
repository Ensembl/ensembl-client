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

import SingleLineSpeciesWrapper, {
  Props as SingleLineSpeciesWrapperProps
} from './SingleLineSpeciesWrapper';
import MultiLineSpeciesWrapper, {
  Props as MultiLineSpeciesWrapperProps
} from './MultiLineSpeciesWrapper';

type Props = (SingleLineSpeciesWrapperProps | MultiLineSpeciesWrapperProps) & {
  isWrappable?: boolean;
};

const SpeciesTabsWrapper = (props: Props) => {
  const { isWrappable = true } = props;

  return isWrappable ? (
    <MultiLineSpeciesWrapper {...props} />
  ) : (
    <SingleLineSpeciesWrapper {...props} />
  );
};

export default SpeciesTabsWrapper;
