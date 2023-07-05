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

export type PopularSpecies = {
  id: string | number; // <-- an id of the collection of genomes associated with this species
  name: string; // <-- human-friendly text we are going to show in the tooltip
  image: string; // <-- url of the associated svg
  members_count: number; // <-- the number to show in the lozenge (could name the field "genomes_count")
  is_selected: boolean; // <-- to display popular species button as selected
};
