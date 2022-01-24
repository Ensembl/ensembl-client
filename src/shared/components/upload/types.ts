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

export type TransformTo = 'arrayBuffer' | 'binaryString' | 'dataUrl' | 'text';

export type Options = {
  transformTo?: TransformTo;
  allowMultiple?: boolean;
};

type OptionsForArrayBuffer = {
  transformTo: 'arrayBuffer';
};

export type OptionsWithDefinedTransform = {
  transformTo: TransformTo;
};

type OptionsForMultipleFiles = {
  allowMultiple: true;
};

export type FileTransformedToArrayBuffer = {
  filename: string;
  content: ArrayBuffer;
};

export type FileTransformedToString = {
  filename: string;
  content: string;
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

/*
// FIXME: delete the code below

// TODO: delete example below
const simpleFunction = <T extends Options>(params: T): Result<T> => {
  return {} as unknown as Result<T>; // lying to typescript for simplicity
};

const testVal1 = simpleFunction({ transformTo: 'arrayBuffer', allowMultiple: true }); // infers FileTransformedToArrayBuffer[]
const testVal2 = simpleFunction({ transformTo: 'arrayBuffer' }); // infers FileTransformedToArrayBuffer
const testVal3 = simpleFunction({ transformTo: 'dataUrl' }); // infers FileTransformedToString
const testVal4 = simpleFunction({ allowMultiple: true }); // infers File[]


type UseUploadParams<T extends Options> = T & {
  onChange: (result: Result<T>) => void;
};

const useFileUpload = <T extends Options>(params: UseUploadParams<T>) => {
  const result = {} as unknown as Result<T>; // lying to typescript for simplicity
  params.onChange(result);
};

// 
useFileUpload({
  transformTo: 'arrayBuffer',
  allowMultiple: true,
  onChange: (result: FileTransformedToArrayBuffer[]) => console.log(result)
});


*/
