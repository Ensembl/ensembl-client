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

import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import AccordionItemHeading from './AccordionItemHeading';
import AccordionItemButton from './AccordionItemButton';

enum UUIDS {
  FOO = 'FOO',
  BAR = 'Bar'
}

describe('Accordion', () => {
  it('renders without erroring', () => {
    expect(() => {
      render(<Accordion />);
    }).not.toThrow();
  });

  describe('className', () => {
    it('is “accordionDefault” by default', () => {
      const { container } = render(<Accordion />);
      expect(container.querySelector('.accordionDefault')).toBeTruthy();
    });

    it('can be extended', () => {
      const { container } = render(<Accordion className="foo" />);

      expect(
        container.querySelector('.accordionDefault')?.classList.contains('foo')
      ).toBe(true);
    });

    it('can also be overridden by using extendDefaultStyles === false', () => {
      const { container } = render(
        <Accordion className="foo" extendDefaultStyles={false} />
      );
      expect(
        container.querySelector('.foo')?.classList.contains('accordionDefault')
      ).toBe(false);
    });
  });

  describe('expanding and collapsing: ', () => {
    it('permits multiple items to be expanded when allowMultipleExpanded is true', () => {
      const [FooHeader, BarHeader] = [
        (): JSX.Element => <AccordionItemButton className="foo" />,
        (): JSX.Element => <AccordionItemButton className="bar" />
      ];

      const { container } = render(
        <Accordion allowMultipleExpanded={true}>
          <AccordionItem>
            <AccordionItemHeading>
              <FooHeader />
            </AccordionItemHeading>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <BarHeader />
            </AccordionItemHeading>
          </AccordionItem>
        </Accordion>
      );

      userEvent.click(container.querySelector('.foo') as HTMLButtonElement);
      userEvent.click(container.querySelector('.bar') as HTMLButtonElement);

      expect(
        container
          .querySelector('.foo')
          ?.closest('div')
          ?.getAttribute('aria-expanded')
      ).toBe('true');

      expect(
        container
          .querySelector('.bar')
          ?.closest('div')
          ?.getAttribute('aria-expanded')
      ).toBe('true');
    });

    it('does not permit multiple items to be expanded when allowMultipleExpanded is false', () => {
      const [FooHeader, BarHeader] = [
        (): JSX.Element => <AccordionItemButton className="foo" />,
        (): JSX.Element => <AccordionItemButton className="bar" />
      ];

      const { container } = render(
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              <FooHeader />
            </AccordionItemHeading>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <BarHeader />
            </AccordionItemHeading>
          </AccordionItem>
        </Accordion>
      );

      userEvent.click(container.querySelector('.foo') as HTMLButtonElement);
      userEvent.click(container.querySelector('.bar') as HTMLButtonElement);

      expect(
        container
          .querySelector('.foo')
          ?.closest('div')
          ?.getAttribute('aria-expanded')
      ).toBe('false');

      expect(
        container
          .querySelector('.bar')
          ?.closest('div')
          ?.getAttribute('aria-expanded')
      ).toBe('true');
    });

    describe('allowZeroExpanded prop', () => {
      it('permits the last-expanded item to be collapsed when explicitly true', () => {
        const { container } = render(
          <Accordion allowZeroExpanded={true}>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton />
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        );

        userEvent.click(
          container.querySelector(
            '.accordionButtonDefault'
          ) as HTMLButtonElement
        );
        userEvent.click(
          container.querySelector(
            '.accordionButtonDefault'
          ) as HTMLButtonElement
        );

        expect(
          container
            .querySelector('.accordionButtonDefault')
            ?.closest('div')
            ?.getAttribute('aria-expanded')
        ).toBe('false');
      });

      it('prevents the last-expanded item being collapsed by default', () => {
        const { container } = render(
          <Accordion allowZeroExpanded={false}>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton />
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        );

        const accordionButtonDefault = container.querySelector(
          '.accordionButtonDefault'
        ) as HTMLButtonElement;

        userEvent.click(accordionButtonDefault);
        userEvent.click(accordionButtonDefault);

        expect(
          container
            .querySelector('.accordionButtonDefault')
            ?.closest('div')
            ?.getAttribute('aria-expanded')
        ).toBe('true');
      });
    });

    describe('preExpanded prop', () => {
      it('expands items whose uuid props match those passed', () => {
        const { container } = render(
          <Accordion preExpanded={[UUIDS.FOO]}>
            <AccordionItem uuid={UUIDS.FOO}>
              <AccordionItemHeading>
                <AccordionItemButton />
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        );

        expect(
          container
            .querySelector('.accordionButtonDefault')
            ?.closest('div')
            ?.getAttribute('aria-expanded')
        ).toEqual('true');
      });

      it('collapses items by default', () => {
        const { container } = render(
          <Accordion>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton />
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        );

        expect(
          container
            .querySelector('.accordionButtonDefault')
            ?.closest('div')
            ?.getAttribute('aria-expanded')
        ).toEqual('false');
      });
    });

    describe('onChange prop', () => {
      it('is invoked with an array of expanded items’ uuids, if there are any', () => {
        const onChange = jest.fn();
        const { container } = render(
          <Accordion onChange={onChange}>
            <AccordionItem uuid={UUIDS.FOO}>
              <AccordionItemHeading>
                <AccordionItemButton />
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        );

        userEvent.click(
          container.querySelector(
            '.accordionButtonDefault'
          ) as HTMLButtonElement
        );

        expect(onChange).toHaveBeenCalledWith([UUIDS.FOO]);
      });

      it('is invoked with an empty array, if no items are expanded', () => {
        const onChange = jest.fn();
        const { container } = render(
          <Accordion
            onChange={onChange}
            preExpanded={[UUIDS.FOO]}
            allowZeroExpanded={true}
          >
            <AccordionItem uuid={UUIDS.FOO}>
              <AccordionItemHeading>
                <AccordionItemButton />
              </AccordionItemHeading>
            </AccordionItem>
          </Accordion>
        );

        userEvent.click(
          container.querySelector(
            '.accordionButtonDefault'
          ) as HTMLButtonElement
        );

        expect(onChange).toHaveBeenCalledWith([]);
      });
    });
  });
});
