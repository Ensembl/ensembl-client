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

import type {
  Options,
  Result,
  OptionsWithDefinedTransform,
  TransformTo
} from '../types';

// The File API also includes the `readAsBinaryString` method which is not recommended
// (readAsArrayBuffer should be used instead)
// (see: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString)
type FileReaderMethod = 'readAsArrayBuffer' | 'readAsDataURL' | 'readAsText';

const transformToFileReaderMethodMap: Record<TransformTo, FileReaderMethod> = {
  arrayBuffer: 'readAsArrayBuffer',
  dataUrl: 'readAsDataURL',
  text: 'readAsText'
};

const fileReaderErrorMessages: Record<number, string> = {
  1: 'The file can not be found (NOT_FOUND_ERR).',
  2: 'The operation is insecure (SECURITY_ERR).',
  4: 'The I/O read operation failed (NOT_READABLE_ERR).'
};

export const transformFiles = async <
  T extends Options & OptionsWithDefinedTransform
>(
  files: File[],
  options: T
): Promise<Result<T>> => {
  const { allowMultiple, transformTo } = options;
  if (allowMultiple) {
    const promises = [...files].map(
      async (file) => await transformFile(file, transformTo)
    );
    const results = await Promise.all(promises);
    return results.filter((result) =>
      Boolean(result.content)
    ) as unknown as Result<T>;
  } else {
    const result = await transformFile(files[0], transformTo);
    return result as unknown as Result<T>;
  }
};

const transformFile = async (file: File, transformTo: TransformTo) => {
  const fileReaderMethod = transformToFileReaderMethodMap[transformTo];
  switch (fileReaderMethod) {
    case 'readAsArrayBuffer':
      return await fileToArrayBuffer(file);
    case 'readAsDataURL':
      return await fileToDataUrl(file);
    case 'readAsText':
      return await fileToText(file);
  }
};

const fileToArrayBuffer = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as ArrayBuffer | null,
    error: null as string | null
  };
  try {
    result.content = (await readFromFile(
      file,
      'readAsArrayBuffer'
    )) as ArrayBuffer;
  } catch (error) {
    result.error = getErrorMessage(error as ProgressEvent<FileReader>);
  }
  return result;
};

const fileToDataUrl = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as string | null,
    error: null as string | null
  };
  try {
    result.content = (await readFromFile(file, 'readAsDataURL')) as string;
  } catch (error) {
    result.error = getErrorMessage(error as ProgressEvent<FileReader>);
  }
  return result;
};

const fileToText = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as string | null,
    error: null as string | null
  };
  try {
    result.content = (await readFromFile(file, 'readAsText')) as string;
  } catch (error) {
    result.error = getErrorMessage(error as ProgressEvent<FileReader>);
  }
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

const getErrorMessage = (error: ProgressEvent<FileReader>) => {
  const errorCode = (error as ProgressEvent<FileReader>).target?.error
    ?.code as number;
  return fileReaderErrorMessages[errorCode];
};
