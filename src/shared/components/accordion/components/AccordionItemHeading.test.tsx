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

import { render } from '@testing-library/react';

import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import AccordionItemButton from './AccordionItemButton';
import AccordionItemHeading, { SPEC_ERROR } from './AccordionItemHeading';

describe('AccordionItemHeading', () => {
  it('renders without erroring', () => {
    expect(() => {
      render(<AccordionItemHeading />);
    }).not.toThrow();
  });

  describe('children prop', () => {
    it('is respected', () => {
      const { container } = render(
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>Hello World</AccordionItemButton>
            </AccordionItemHeading>
          </AccordionItem>
        </Accordion>
      );
      expect(
        container.querySelector('.accordionButtonDefault')?.textContent
      ).toEqual('Hello World');
    });
  });

  describe('validation', () => {
    // tslint:disable-next-line no-console
    const originalError = console.error;

    beforeEach(() => {
      // tslint:disable-next-line no-console
      console.error = vi.fn();
    });

    afterAll(() => {
      // tslint:disable-next-line no-console
      console.error = originalError;
    });

    it('permits a single AccordionItemButton as a child', () => {
      expect(() =>
        render(
          <Accordion>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Hello World</AccordionItemButton>
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        )
      ).not.toThrow(SPEC_ERROR);
    });

    it('permits a single AccordionItemButton as a child within an array', () => {
      expect(() =>
        render(
          <Accordion>
            <AccordionItem>
              <AccordionItemHeading>
                [
                <AccordionItemButton key="foo">Hello World</AccordionItemButton>
                ]
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        )
      ).not.toThrow(SPEC_ERROR);
    });

    it('does not permit multiple AccordionItemButton as children within an array', () => {
      expect(() =>
        render(
          <Accordion>
            <AccordionItem>
              <AccordionItemHeading>
                [
                <AccordionItemButton key="foo">Hello World</AccordionItemButton>
                <AccordionItemButton key="bar">Hello World</AccordionItemButton>
                ]
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        )
      ).toThrow(SPEC_ERROR);
    });

    it('throws an error if you don’t nest an AccordionItemButton', () => {
      expect(() =>
        render(
          <Accordion>
            <AccordionItem>
              <AccordionItemHeading />
            </AccordionItem>
          </Accordion>
        )
      ).toThrow(SPEC_ERROR);
    });

    it('throws an error if you nest any non-AccordionItemButton element', () => {
      expect(() =>
        render(
          <Accordion>
            <AccordionItem>
              <AccordionItemHeading>Foo</AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        )
      ).toThrow(SPEC_ERROR);
    });
  });
});
