import { createAsyncAction } from 'typesafe-actions';

import { getDataThunk } from '../dataThunk';
import { AnalyticsCategory } from '../analyticsHelper';

export const fetchEnsObject = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<string, {}, Error>();

export const fetchEnsObjectData = (ensObjectId: string) => {
  const url = `/browser/get_ensembl_object_info/${ensObjectId}`;

  return getDataThunk(
    url,
    fetchEnsObject,
    AnalyticsCategory.ENS_OBJECT,
    ensObjectId
  );
};

export const fetchExampleEnsObjects = createAsyncAction(
  'ens-object/fetch_example_ens_objects_request',
  'ens-object/fetch_example_ens_objects_success',
  'ens-object/fetch_example_ens_objects_failure'
)<null, {}, Error>();

export const fetchExampleEnsObjectsData = () => {
  const url = '/browser/example_ens_objects';

  return getDataThunk(
    url,
    fetchExampleEnsObjects,
    AnalyticsCategory.ENS_OBJECT
  );
};
