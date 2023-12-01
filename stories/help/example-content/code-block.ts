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

const html = `
<article>
  <h1>Example containing code blocks</h1>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Vestibulum elementum metus purus, sit amet semper eros bibendum quis.
    Phasellus cursus magna nec pretium feugiat. Pellentesque ut lorem in odio laoreet rhoncus.
    Vestibulum eget odio ac justo hendrerit dictum at eu risus.
    Sed orci mi, ultrices non mauris nec, tempus aliquam erat.
    Vestibulum pellentesque ac felis mollis fermentum. Morbi luctus fringilla tincidunt.
    Phasellus eu justo tempus, efficitur libero id, tempus nisl.
    Curabitur tempus, leo nec ullamcorper sollicitudin, augue odio accumsan dolor, vitae blandit lorem quam non neque.
    Donec eget orci sit amet elit finibus efficitur sit amet sed magna.
  </p>

  <pre>
query {
  genomes(
    by_keyword: {
      keyword:"Triticum aestivum",
      release_version: 108  # Optional
    }
  ) {
    genome_id
    assembly_accession
    scientific_name
    release_number
  }
}
  </pre>

  <p>
    Cras consequat leo mauris, non mollis ligula mollis ut.
    Cras hendrerit urna eu ultrices accumsan. Cras eros nisl, consectetur ac faucibus id, accumsan in lectus.
    Integer condimentum quam ante, vel viverra mi ultrices sed. Donec ut elit lacinia enim lobortis sollicitudin.
    Morbi id libero fermentum, ultrices odio vel, fermentum eros.
    In rutrum massa ut elit aliquam, vel hendrerit augue lacinia.
    Pellentesque bibendum aliquam orci, at volutpat odio iaculis vitae.
    Suspendisse gravida arcu sed tincidunt pharetra. In hac habitasse platea dictumst.
    Nullam imperdiet tellus et nulla dignissim condimentum. Vivamus vestibulum feugiat venenatis.
    Pellentesque sit amet neque mi. Nunc suscipit neque quis tellus mattis, in sagittis arcu finibus.
    Nam blandit risus non lacinia pulvinar. Integer sit amet lorem id augue dictum aliquam in quis sem.
  </p>
</article>
`;

export default html;
