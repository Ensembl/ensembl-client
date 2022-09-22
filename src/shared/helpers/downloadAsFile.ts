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

export const downloadTextAsFile = async (
  content: string | string[],
  fileName: string,
  options?: BlobPropertyBag
) => {
  if (typeof content === 'string') {
    content = [content];
  }
  const blob = content instanceof Blob ? content : new Blob(content, options);

  await downloadBlobAsFile(blob, fileName);
};

// should accept Blob or File objects generated elsewhere in the code
export const downloadBlobAsFile = async (blob: Blob, fileName: string) => {
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = fileName;
  downloadLink.click();

  const cleanupPromise = new Promise((resolve) => {
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      resolve(null);
    }, 100);
  });

  await cleanupPromise;
};
