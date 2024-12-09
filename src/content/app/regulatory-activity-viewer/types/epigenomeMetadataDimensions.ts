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

type CommonMetadataDimensionFields = {
  name: string;
  collapsible: boolean;
  filterable: boolean;
  zero_counts_visible: boolean;
  default_values: string[];
};

type DimensionWithCategoricalData = CommonMetadataDimensionFields & {
  type: 'categorical';
  values: string[]; // <-- this is what makes the dimension "categorical"
};

type DimensionWithCategoricalDataAndOntology = CommonMetadataDimensionFields & {
  type: 'categorical_with_ontology';
  values: {
    name: string;
    ontology: {
      curie: string;
      url: string;
    };
  }[];
};

// the only member of this type currently is age, which is still very uncertain
type DimensionWithCategoricalDataAndDescription =
  CommonMetadataDimensionFields & {
    type: 'categorical_with_description';
    values: {
      name: string;
      description: string;
    }[];
  };

type EpigenomeMetadataDimension =
  | DimensionWithCategoricalData
  | DimensionWithCategoricalDataAndOntology
  | DimensionWithCategoricalDataAndDescription;

export type EpigenomeMetadataDimensions = Record<
  string,
  EpigenomeMetadataDimension
>;

export type EpigenomeMetadataDimensionsResponse = {
  species_name: string;
  assemblies: string[]; // <-- why array of strings?
  filter_layout: string[][];
  table_header_order: string[];
  dimensions: EpigenomeMetadataDimensions;
};
