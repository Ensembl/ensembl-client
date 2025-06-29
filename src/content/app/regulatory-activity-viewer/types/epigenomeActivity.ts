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

export type HistoneMetadata = {
  peak_type: 'gapped' | 'narrow';
  label: string; // arbitrary string
  color: string; // hex color
};

export type HistoneMetadataMap = Record<
  string,
  {
    peak_type: 'gapped' | 'narrow';
    label: string; // arbitrary string
    color: string; // hex color
  }
>;

export type EpigenomeActivityMetadata = {
  histone: HistoneMetadataMap;
};

export type TrackData = {
  epigenome_ids: string[];
  open_chromatin: {
    signal: Array<SignalData>;
    peaks: Array<OpenChromatinPeakData>;
  };
  histones: {
    [key: string]: HistoneNarrowPeakData[] | HistoneGappedPeakData[];
  };
};

type SignalData = {
  start: number; // start (Ensembl genomic coordinate)
  end: number; // end (Ensembl genomic coordinate)
  value: number; // value (an integer between 1 and 9)
};

type OpenChromatinPeakData = {
  start: number; // start (Ensembl genomic coordinate)
  end: number; // end (Ensembl genomic coordinate)
};

type HistoneNarrowPeakData = {
  start: number; // start (Ensembl genomic coordinate)
  end: number; // end (Ensembl genomic coordinate)
};

/**
 * The purpose of 'block starts' and 'block sizes' is the same as in a .bed file.
 * They describe data to draw rectangles whose left x coordinate corresponds to a block start,
 * and whose width corresponds to a block end.
 */
export type HistoneGappedPeakData = {
  start: number;
  end: number;
  block_count: number; // this is kinda superfluous; it is the same as the length of 'block_starts' or 'block_sizes'
  block_starts: number[];
  block_sizes: number[];
};

export type EpigenomeActivityResponse = {
  track_metadata: EpigenomeActivityMetadata;
  track_data: TrackData[];
};
