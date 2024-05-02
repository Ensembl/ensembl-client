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
  <h1>Images and image captions</h1>

  <img src="https://github.com/Ensembl/ensembl-client/assets/6834224/491e0571-2e2d-4b88-8816-19f6b83192dd" />

  <p>
    Above is an image that immediately follows heading 1. 
  </p>

  <p>
    This is just a random paragraph with some words.
    It is followed by another image.
    Suspendisse tempor dui sed blandit dignissim. Integer ut magna nulla.
    Pellentesque porttitor eget erat sit amet tincidunt.
  </p>

  <img src="https://github.com/Ensembl/ensembl-client/assets/6834224/491e0571-2e2d-4b88-8816-19f6b83192dd" />

  <p>
    Notice, too, that when, in a markdown file, you add an image using the markdown syntax like so:
    <code>[!image_alt](/path-to-image)</code> on a separate line, the markdown parser will wrap this image
    in a paragraph tag (as it does with any inline element written on its own line).
    Therefore, we have a dedicated CSS rule that will prevent paragraphs with images from being narrow.
    See example below.
  </p>

  <p>
    <img src="https://github.com/Ensembl/ensembl-client/assets/6834224/491e0571-2e2d-4b88-8816-19f6b83192dd" />
  </p>

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

  <img src="https://github.com/Ensembl/ensembl-client/assets/6834224/774e8104-44eb-48c1-8e2a-666d8ee34852" width="200" />

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

  <h2>
    Images with captions
  </h2>

  <p>
    Below is an image wrapped in a figure element, with a one-line caption.
  </p>

  <figure>
    <img src="https://github.com/Ensembl/ensembl-client/assets/6834224/491e0571-2e2d-4b88-8816-19f6b83192dd" />
    <figcaption>
      Hello Rectangle!
    </figcaption>
  </figure>

  <p>
    The image below is also wrapped in a figure element, and has caption spanning several paragraphs.
  </p>

  <figure>
    <img src="https://github.com/Ensembl/ensembl-client/assets/6834224/491e0571-2e2d-4b88-8816-19f6b83192dd" />
    <figcaption>
      <p>Hello Rectangle!</p>
      <p>
        Suspendisse tempor dui sed blandit dignissim. Integer ut magna nulla.
        Pellentesque porttitor eget erat sit amet tincidunt.
      </p>
    </figcaption>
  </figure>

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

  <figure>
    <img src="https://github.com/Ensembl/ensembl-client/assets/6834224/774e8104-44eb-48c1-8e2a-666d8ee34852" width="200" />
    <figcaption>
      Hello Rectangle!
    </figcaption>
  </figure>

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
