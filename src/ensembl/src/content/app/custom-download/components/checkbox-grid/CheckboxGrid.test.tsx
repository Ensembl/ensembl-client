import React from 'react';
import { mount } from 'enzyme';
import CheckboxGrid from './CheckboxGrid';
import Checkbox from 'src/shared/checkbox/Checkbox';

const checkboxOnChange = jest.fn();
const gridData = {
  default: {
    symbol: {
      id: 'symbol',
      label: 'Symbol',
      checkedStatus: false
    },
    id: {
      id: 'id',
      label: 'Gene stable ID',
      checkedStatus: true
    },
    id_version: {
      id: 'id_version',
      label: 'Gene stable ID version',
      checkedStatus: true
    },
    name: {
      id: 'name',
      label: 'Gene name',
      checkedStatus: false
    },
    strand: {
      id: 'strand',
      label: 'Strand',
      checkedStatus: false
    },
    start: {
      id: 'start',
      label: 'Gene start(bp)',
      checkedStatus: false
    },
    end: {
      id: 'end',
      label: 'End',
      checkedStatus: false
    }
  },
  External: {
    gencode_basic_annotation: {
      id: 'gencode_basic_annotation',
      label: 'GENCODE basic annotation',
      checkedStatus: false
    },
    uniparc_id: {
      id: 'uniparc_id',
      label: 'UniParc ID',
      checkedStatus: false
    },
    ncbi_id: {
      id: 'ncbi_id',
      label: 'NCBI gene ID',
      checkedStatus: false
    },
    HGNC: {
      id: 'HGNC',
      label: 'HGNC symbol',
      checkedStatus: false
    },
    go_domain: { id: 'go_domain', label: 'GO domain', checkedStatus: false }
  }
};

describe('<CheckboxGrid />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    const wrapper = mount(
      <CheckboxGrid gridData={gridData} checkboxOnChange={checkboxOnChange} />
    );
    expect(wrapper.find(CheckboxGrid).length).toEqual(1);
  });

  it('renders N number of checkbox based on the gridData', () => {
    const wrapper = mount(
      <CheckboxGrid gridData={gridData} checkboxOnChange={checkboxOnChange} />
    );

    expect(wrapper.find(Checkbox).length).toEqual(12);
  });

  it('calls the checkboxOnChange when a checkbox is checked', () => {
    const wrapper = mount(
      <CheckboxGrid gridData={gridData} checkboxOnChange={checkboxOnChange} />
    );
    wrapper
      .find(Checkbox)
      .first()
      .find('.defaultCheckbox')
      .simulate('click');
    expect(checkboxOnChange).toHaveBeenCalled();
  });

  it('sorts the checkboxs alphebatically based on the label', () => {
    const wrapper = mount(
      <CheckboxGrid gridData={gridData} checkboxOnChange={checkboxOnChange} />
    );

    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();

    const firstCheckbox = firstGridContainer.find(Checkbox).first();
    expect(firstCheckbox.prop('label')).toEqual('End');

    const lastCheckbox = firstGridContainer.find(Checkbox).last();
    expect(lastCheckbox.prop('label')).toEqual('Symbol');
  });

  it('calls the checkboxOnChange when a checkbox is unchecked', () => {
    const wrapper = mount(
      <CheckboxGrid gridData={gridData} checkboxOnChange={checkboxOnChange} />
    );
    const firstCheckbox = wrapper.find(Checkbox).first();
    firstCheckbox.find('.defaultCheckbox').simulate('click');

    expect(checkboxOnChange).toHaveBeenCalledWith(true, 'default', 'end');
  });

  it('does not display the `Default` title', () => {
    const wrapper = mount(
      <CheckboxGrid gridData={gridData} checkboxOnChange={checkboxOnChange} />
    );
    const firstGridTitle = wrapper.find('.checkboxGridTitle').first();
    expect(firstGridTitle.text()).not.toBe('Default');
  });

  it('hides the unchecked checkboxes when hideUnchecked is true', () => {
    const wrapper = mount(
      <CheckboxGrid
        gridData={gridData}
        checkboxOnChange={checkboxOnChange}
        hideUnchecked={true}
      />
    );

    expect(wrapper.find(Checkbox).length).toBe(2);
  });

  it('hides the title when hideTitles is true', () => {
    const wrapper = mount(
      <CheckboxGrid
        gridData={gridData}
        checkboxOnChange={checkboxOnChange}
        hideTitles={true}
      />
    );

    expect(wrapper.find('.checkboxGridTitle').length).toBe(0);
  });

  it('draws N number of columns based on the `column` parameter', () => {
    const wrapper = mount(
      <CheckboxGrid gridData={gridData} checkboxOnChange={checkboxOnChange} />
    );
    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();
    expect(firstGridContainer.children().length).toBe(3);
  });
});
