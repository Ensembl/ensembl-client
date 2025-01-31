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

type UISpecs = {
  filter_layout: string[][]; // <-- tells how to position panels of checkboxes for epigenome selection
  table_layout: string[]; // <-- order in which to display columns of the selected epigenomes table
  collapsible: string[]; // <-- metadata dimensions that can be used to combine epigenomes (and make corresponding table columns disappear)
  filterable: string[]; // <-- metadata dimensions that can be used for selection (filtering) of epigenomes
  sortable: string[]; // <-- metadata dimensions that can be used to sort epigenomes
  zero_counts_visible: []; // <-- metadata dimensions whose filter panels will always display full list of filters even if there aren't any epigenomes matching a filter
};

type CommonMetadataDimensionFields = {
  name: string;
  default_values: string[];
};

type DimensionWithCategoricalData = CommonMetadataDimensionFields & {
  type: 'categorical';
  values: string[]; // <-- this is what makes the dimension "categorical"
};

type DimensionWithCategoricalDataAndOntology = CommonMetadataDimensionFields & {
  type: 'categorical_with_ontology';
  values: {
    value: string;
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
      value: string;
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
  ui_spec: UISpecs;
  dimensions: EpigenomeMetadataDimensions;
};
