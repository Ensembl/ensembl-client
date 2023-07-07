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
import type { Pick2 } from 'ts-multipick';

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import type { Slice } from 'src/shared/types/core-api/slice';

type MinimalSlice = Pick2<Slice, 'location', 'start' | 'end'> &
  Pick2<Slice, 'region', 'name'>;

type Props = {
  variant: {
    slice: MinimalSlice;
  };
};

const VariantLocation = (props: Props) => {
  const regionName = props.variant.slice.region.name;
  const start = props.variant.slice.location.start;
  const end = props.variant.slice.location.end;

  const locationString = getFormattedLocation({
    chromosome: regionName,
    start,
    end
  });

  return <span>{locationString}</span>;
};

export default VariantLocation;
