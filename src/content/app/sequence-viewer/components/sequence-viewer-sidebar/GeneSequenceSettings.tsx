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

import { Link } from 'react-router';

const GeneSequenceSetttings = () => {
  const brca2Url =
    '/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000139618';
  const mapk10Url =
    '/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000109339'; // 604,619
  const dmdUrl = '/sequence-viewer/GCA_000001405.29?focus=gene:ENSG00000198947'; // 2,241,933

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '0.6rem' }}>
      <Link to={brca2Url}>BRCA2 (85,183 bp)</Link>
      <Link to={mapk10Url}>MAPK10 (604,619 bp)</Link>
      <Link to={dmdUrl}>DMD (2,241,933 bp)</Link>
    </div>
  );
};

export default GeneSequenceSetttings;
