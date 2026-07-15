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

/**
 * It appears that Safari has a bug related to files stored in IndexedDB.
 * When the file is read back from the db and appended to FormData for submission to the server,
 * Safari fails to send as a part of a multipart/form-data request;
 * and instead sends a request whose content length is zero.
 * This problem is briefly discussed in a StackOverflow issue in 2021:
 * https://stackoverflow.com/questions/68555937/upload-file-from-safari-using-file-object-stored-in-indexed-db
 * The bug is active for Safari 26 (as of July 2026).
 *
 * The hack around this problem is to create a new instance of the file object,
 * copying into it the contents and the metadata of the original file.
 */

export const cloneFileRestoredFromIndexedDb = async (file: File) => {
  const fileContentClone = await file.arrayBuffer();
  return new File([fileContentClone], file.name, {
    type: file.type,
    lastModified: file.lastModified
  });
};
