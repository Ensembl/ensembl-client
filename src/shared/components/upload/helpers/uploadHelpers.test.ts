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

import { TextDecoder } from 'util';
import { transformFiles, transformFile } from './uploadHelpers';

const fileText1 = 'Lorem ipsum';
const fileText2 = 'dolor sit amet';

const file1 = new File([fileText1], 'file1.txt', {
  type: 'text/plain'
});

const file2 = new File([fileText2], 'file2.txt', {
  type: 'text/plain'
});

describe('transformFile', () => {
  it('reads file content as text', async () => {
    const result = await transformFile(file1, 'text');
    expect(result.content).toBe(fileText1);
  });

  it('reads file content as array buffer', async () => {
    const { content: arrayBuffer } = await transformFile(file1, 'arrayBuffer');
    expect(arrayBuffer instanceof ArrayBuffer).toBe(true);

    const decodedArrayBuffer = new TextDecoder().decode(
      arrayBuffer as ArrayBuffer
    );
    expect(decodedArrayBuffer).toBe(fileText1);
  });

  it('reads file content as data url', async () => {
    const { content: dataUrl } = await transformFile(file1, 'dataUrl');
    expect(typeof dataUrl).toBe('string');

    const prefix = 'data:text/plain;base64,'; // expected for a plain-text file
    expect((dataUrl as string).startsWith(prefix)).toBe(true);

    const base64Encoded = (dataUrl as string).replace(prefix, '');
    const buffer = Buffer.from(base64Encoded, 'base64');
    const restoredText = buffer.toString('ascii');
    expect(restoredText).toBe(fileText1);
  });
});

describe('transformFiles', () => {
  // just checking the reading of one file vs many files here;
  // individual transformations are checked in the tests for transformFile

  it('reads the content of multiple files', async () => {
    const [result1, result2] = await transformFiles([file1, file2], 'text');
    expect(result1.content).toBe(fileText1);
    expect(result2.content).toBe(fileText2);
  });
});
