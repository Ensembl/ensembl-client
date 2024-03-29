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

import type { RequiredField } from 'src/shared/types/utility-types/requiredField';

export type TransformTo = 'arrayBuffer' | 'dataUrl' | 'text';

export type Options = {
  transformTo?: TransformTo;
  allowMultiple?: boolean;
};

type OptionsForArrayBuffer = {
  transformTo: 'arrayBuffer';
};

export type OptionsWithDefinedTransform = RequiredField<Options, 'transformTo'>;

export type OptionsForMultipleFiles = Options & {
  allowMultiple: true;
};

export type FileTransformedToArrayBuffer = {
  filename: string;
  content: ArrayBuffer | null;
  error: string | null;
};

export type FileTransformedToString = {
  filename: string;
  content: string | null;
  error: string | null;
};

export type Result<T extends Options> = T extends OptionsForArrayBuffer
  ? ResultForArrayBuffer<T>
  : T extends OptionsWithDefinedTransform
  ? ResultForFileTransformedToString<T>
  : ResultForPlainFile<T>;

type ResultForArrayBuffer<T extends OptionsForArrayBuffer> =
  T extends OptionsForMultipleFiles
    ? FileTransformedToArrayBuffer[]
    : FileTransformedToArrayBuffer;

type ResultForFileTransformedToString<T extends OptionsWithDefinedTransform> =
  T extends OptionsForMultipleFiles
    ? FileTransformedToString[]
    : FileTransformedToString;

type ResultForPlainFile<T extends Options> = T extends OptionsForMultipleFiles
  ? File[]
  : File;

export type FileUploadParams<T extends Options> = T & {
  onUpload: (result: Result<T>) => void;
};
