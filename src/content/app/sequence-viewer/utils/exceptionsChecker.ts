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

const transSplicingException = 'trans_spliced';
const crossOriginException = 'circular_cross_origin';

const exceptionsForGenomicSequence = new Set([
  transSplicingException,
  crossOriginException
]);

export const hasGenomicSequenceException = (exceptions: string[]) => {
  const currentExceptionsSet = new Set(exceptions);
  const intersection = currentExceptionsSet.intersection(
    exceptionsForGenomicSequence
  );
  return intersection.size > 0;
};

export const hasTransSplicingException = (exceptions: string[]) => {
  return exceptions.includes(transSplicingException);
};

export const hasCrossOriginException = (exceptions: string[]) => {
  return exceptions.includes(crossOriginException);
};
