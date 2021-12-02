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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request, gql } from 'graphql-request';

import config from 'config';

type PageMetaState = {
  genomeId: string | null;
  entityId: string | null;
  title: string;
};

type FetchPageTitleInfoParams = {
  genomeId: string;
  geneStableId: string;
};

type GeneSummaryResponse = {
  gene: {
    symbol: string;
    stable_id: string;
  };
};

const geneSummaryQuery = gql`
  query GeneSummary($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      symbol
    }
  }
`;

export const fetchPageTitleInfo = createAsyncThunk<
  PageMetaState,
  FetchPageTitleInfoParams,
  { rejectValue: { status: 404 } }
>(
  'entity-viewer/fetchPageTitleInfo',
  async (params: FetchPageTitleInfoParams, thunkApi) => {
    const { genomeId, geneStableId } = params;
    const url = config.thoasBaseUrl;

    try {
      const data = await request<GeneSummaryResponse>(url, geneSummaryQuery, {
        genomeId,
        geneId: geneStableId
      });
      const { symbol, stable_id } = data.gene;
      const title = `Gene: ${symbol ?? stable_id} — Ensembl`;
      return {
        title,
        genomeId,
        entityId: geneStableId
      };
    } catch {
      throw thunkApi.rejectWithValue({ status: 404 });
    }
  }
);

const initialState: PageMetaState = {
  genomeId: null,
  entityId: null,
  title: 'Entity Viewer – Ensembl'
};

const pageMetaSlice = createSlice({
  name: 'entity-viewer-page-meta',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPageTitleInfo.fulfilled, (_, action) => {
      return action.payload;
    });
  }
});

export default pageMetaSlice.reducer;
