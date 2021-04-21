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

 import { getGeneName } from './geneFormatter';
  
 describe('getGeneName', () => {
   it('returns the correct gene display name', () => {
     expect(getGeneName('novel transcript')).toBe('None');
     expect(getGeneName('')).toBe('None');
     expect(getGeneName(null)).toBe('None');
     expect(getGeneName('Heat shock protein 101 [Source:UniProtKB/TrEMBL;Acc:Q9SPH4]')).toBe('Heat shock protein 101');
   });
 });
