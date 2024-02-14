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

import type { SpeciesFtpLinksResponse } from '../speciesApiTypes';

export const mockFtpLinks = [
  {
    dataset: 'genebuild',
    url: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/genebuild/GENCODE44'
  },
  {
    dataset: 'assembly',
    url: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/genome'
  },
  {
    dataset: 'variation',
    url: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/variation/GENCODE44'
  },
  {
    dataset: 'homologies',
    url: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/homology/GENCODE44'
  },
  {
    dataset: 'regulation',
    url: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/regulation'
  }
] satisfies SpeciesFtpLinksResponse;
