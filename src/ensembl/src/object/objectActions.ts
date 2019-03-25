import { createAsyncAction } from 'typesafe-actions';

import { getDataThunk } from '../dataThunk';
import { AnalyticsCategory } from '../analyticsHelper';

export const fetchObject = createAsyncAction(
  'object/fetch_object_request',
  'object/fetch_object_success',
  'object/fetch_object_failure'
)<string, {}, Error>();

export const fetchObjectData = (objectId: string) => {
  const url = `/browser/get_object_info/${objectId}`;

  return getDataThunk(url, fetchObject, AnalyticsCategory.OBJECT, objectId);
};

export const fetchExampleObjects = createAsyncAction(
  'object/fetch_example_objects_request',
  'object/fetch_example_objects_success',
  'object/fetch_example_objects_failure'
)<null, {}, Error>();

export const fetchExampleObjectsData = () => {
  const url = '/browser/example_objects';

  return getDataThunk(url, fetchExampleObjects, AnalyticsCategory.OBJECT);
};
