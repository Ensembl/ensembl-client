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

import windowService from 'src/services/window-service';

import type { TransformTo } from '../types';

// The File API also includes the `readAsBinaryString` method which is not recommended
// (readAsArrayBuffer should be used instead)
// (see: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString)
type FileReaderMethod = 'readAsArrayBuffer' | 'readAsDataURL' | 'readAsText';

const transformToFileReaderMethodMap: Record<TransformTo, FileReaderMethod> = {
  arrayBuffer: 'readAsArrayBuffer',
  dataUrl: 'readAsDataURL',
  text: 'readAsText'
};

export const transformFiles = async (
  files: File[],
  transformTo: TransformTo
) => {
  const promises = [...files].map(
    async (file) => await transformFile(file, transformTo)
  );
  return await Promise.all(promises);
};

export const transformFile = async (file: File, transformTo: TransformTo) => {
  const fileReaderMethod = transformToFileReaderMethodMap[transformTo];
  try {
    switch (fileReaderMethod) {
      case 'readAsArrayBuffer':
        return await fileToArrayBuffer(file);
      case 'readAsDataURL':
        return await fileToDataUrl(file);
      case 'readAsText':
        return await fileToText(file);
    }
  } catch (error) {
    return {
      filename: file.name,
      content: null,
      error: 'Could not read the file'
    };
  }
};

const fileToArrayBuffer = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as ArrayBuffer | null,
    error: null
  };
  result.content = (await readFromFile(
    file,
    'readAsArrayBuffer'
  )) as ArrayBuffer;
  return result;
};

const fileToDataUrl = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as string | null,
    error: null as string | null
  };
  result.content = (await readFromFile(file, 'readAsDataURL')) as string;
  return result;
};

const fileToText = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as string | null,
    error: null as string | null
  };
  result.content = (await readFromFile(file, 'readAsText')) as string;
  return result;
};

const readFromFile = async (file: File, method: FileReaderMethod) => {
  const fileReader = windowService.getFileReader();
  const promise = new Promise((resolve, reject) => {
    fileReader.onload = resolve;
    fileReader.onerror = reject;
    fileReader[method](file);
  });
  await promise;
  return fileReader.result;
};
