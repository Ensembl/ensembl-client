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

/** Integers as-is, otherwise 4 significant figures with trailing zeros dropped. */
export const num = (value: number): string =>
  Number.isInteger(value)
    ? `${value}`
    : Number(value.toPrecision(4)).toString();

/**
 * Classifier terms arrive underscore-delimited (e.g. "likely_benign"); show
 * them space-separated for readability.
 */
export const humanizeClass = (label: string): string =>
  label.replace(/_/g, ' ');

/**
 * Phenotype terms come `_`/`__`-delimited in mixed case (ClinVar/OMIM/GWAS).
 * Collapse underscore runs to a single space; and where a term is entirely
 * upper-case (OMIM-style shouting) drop it to sentence case. Mixed-case terms
 * are left untouched so embedded gene symbols/acronyms (WARS2, SHOX, CLN8) and
 * prefixes like "ClinVar:" survive.
 */
export const normalizePhenotype = (raw: string): string => {
  const text = raw.replace(/_+/g, ' ').trim();
  const hasLower = /[a-z]/.test(text);
  const hasUpper = /[A-Z]/.test(text);
  if (hasUpper && !hasLower) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  return text;
};

/**
 * A classification with its score, shown score-first with the (humanised) class
 * in brackets, e.g. "0.0854 (likely benign)". Falls back to just the class when
 * there is no score.
 */
export const withScore = (
  classification: string,
  score: number | null
): string =>
  score !== null
    ? `${num(score)} (${humanizeClass(classification)})`
    : humanizeClass(classification);

/** A list of terms as one comma-separated value; null when there is nothing. */
export const joinList = (values: string[] | null | undefined): string | null =>
  values && values.length ? values.join(', ') : null;

/**
 * A list of classification terms, each humanised (underscores -> spaces) and
 * joined into one comma-separated value; null when there is nothing. ClinVar's
 * significance, shown as e.g. "Pathogenic, likely pathogenic".
 */
export const humanizeJoin = (
  values: string[] | null | undefined
): string | null =>
  values && values.length ? values.map(humanizeClass).join(', ') : null;

/**
 * The enriched ClinVar VCF uses `+` where the source had a list, so a single
 * aggregate classification can arrive as
 * `Conflicting_classifications_of_pathogenicity+risk_factor` — two terms in one
 * value.
 */
export const humanizeTerms = (value: string): string | null =>
  value.split('+').map(humanizeClass).filter(Boolean).join(', ') || null;

/**
 * The number of items in a list, or in a `&`-delimited string (IntAct packs its
 * columns that way); null when there are none, so a zero count drops / dashes
 * its row like an absent value — matching the old ProtVar / IntAct summaries.
 */
export const count = (value: unknown): string | null => {
  const n = Array.isArray(value)
    ? value.length
    : typeof value === 'string'
      ? value.split('&').filter(Boolean).length
      : 0;
  return n ? String(n) : null;
};
