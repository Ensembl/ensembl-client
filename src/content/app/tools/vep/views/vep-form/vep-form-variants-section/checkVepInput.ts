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
 * TEMPORARY, lightweight VCF input sanity check.
 *
 * Discrete and easy to remove: delete this file and the small "input check"
 * block (import + guard in onCommitInput + error UI) in VepFormVariantsSection.
 *
 * Intentionally NOT rigorous — it just catches obviously non-VCF pasted/typed
 * input before submission:
 *   - blank lines and `#` comment/header lines are ignored (header not required)
 *   - columns may be separated by any whitespace (single/multiple spaces or tabs)
 *   - each data line needs at least CHROM, POS, REF, ALT, with a numeric POS
 *
 * Returns an error message string, or null when the input looks OK.
 */
export const checkVepInput = (text: string): string | null => {
  const lines = text.split(/\r?\n/);
  let dataLineCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const fields = line.split(/\s+/);
    if (fields.length < 4 || !/^\d+$/.test(fields[1])) {
      return `Line ${i + 1} doesn't look like VCF — expected at least "CHROM POS … REF ALT" with a numeric position.`;
    }
    dataLineCount++;
  }

  if (dataLineCount === 0) {
    return 'Enter at least one VCF variant line.';
  }
  return null;
};
