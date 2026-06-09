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

import config from 'config';

import DownloadLink from 'src/shared/components/download-button/DownloadLink';

type SearchParam = {
  name: 'query' | 'species_taxonomy_id' | 'genome_group_id';
  value: string;
};

type Props = {
  searchParam: SearchParam;
  className?: string;
};

const endpointUrl = `${config.searchApiBaseUrl}/genomes/v2/download`;

const GenomesDownloadButton = (props: Props) => {
  const searchParams = new URLSearchParams();
  searchParams.set(props.searchParam.name, props.searchParam.value);
  searchParams.set('format', 'csv');
  const url = `${endpointUrl}?${searchParams.toString()}`;

  return (
    <DownloadLink
      href={url}
      label="download full table of results"
      className={props.className}
    />
  );
};

export default GenomesDownloadButton;
