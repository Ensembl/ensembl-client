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

export enum DrawerView {
  BOOKMARKS = 'bookmarks',
  TRACK_DETAILS = 'track_details',
  GENE_SUMMARY = 'gene_summary',
  TRANSCRIPT_SUMMARY = 'transcript_summary'
}

export type DrawerState = Readonly<{
  isDrawerOpened: { [genomeId: string]: boolean };
  drawerView: { [genomeId: string]: DrawerView | null };
  activeDrawerTrackIds: { [genomeId: string]: string | null };
  activeDrawerTranscriptIds: { [genomeId: string]: string | null };
}>;

export const defaultDrawerState = {
  isDrawerOpened: {},
  drawerView: {},
  activeDrawerTrackIds: {},
  activeDrawerTranscriptIds: {}
};
