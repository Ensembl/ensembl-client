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

import type { RefObject } from 'react';

import GeneSummaryStrip from './GeneSummaryStrip';
import LocationSummaryStrip from './LocationSummaryStrip';
import VariantSummaryStrip from './VariantSummaryStrip';

import type { FocusObject } from 'src/shared/types/focus-object/focusObjectTypes';

export type FeatureSummaryStripProps = {
  focusObject: FocusObject;
  className?: string;
  isGhosted?: boolean;
  ref?: RefObject<HTMLDivElement | null>;
};

export const FeatureSummaryStrip = (props: FeatureSummaryStripProps) => {
  const { focusObject, isGhosted, ref } = props;

  switch (focusObject.type) {
    case 'gene':
      return (
        <GeneSummaryStrip
          gene={focusObject}
          isGhosted={isGhosted}
          ref={ref}
          className={props.className}
        />
      );
    case 'location':
      return (
        <LocationSummaryStrip
          location={focusObject}
          isGhosted={isGhosted}
          ref={ref}
          className={props.className}
        />
      );
    case 'variant':
      return (
        <VariantSummaryStrip
          variant={focusObject}
          isGhosted={isGhosted}
          ref={ref}
          className={props.className}
        />
      );
    default:
      return null;
  }
};

export default FeatureSummaryStrip;
