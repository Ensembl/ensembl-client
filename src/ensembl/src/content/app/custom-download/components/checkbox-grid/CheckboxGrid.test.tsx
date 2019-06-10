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
      isChecked: false
    },
    id: {
      id: 'id',
      label: 'Gene stable ID',
      isChecked: true
    },
    id_version: {
      id: 'id_version',
      label: 'Gene stable ID version',
      isChecked: true
    },
    name: {
      id: 'name',
      label: 'Gene name',
      isChecked: false
    },
    strand: {
      id: 'strand',
      label: 'Strand',
      isChecked: false
    },
    start: {
      id: 'start',
      label: 'Gene start(bp)',
      isChecked: false
    },
    end: {
      id: 'end',
      label: 'End',
      isChecked: false
    }
  },
  External: {
    gencode_basic_annotation: {
      id: 'gencode_basic_annotation',
      label: 'GENCODE basic annotation',
      isChecked: false
    },
    uniparc_id: {
      id: 'uniparc_id',
      label: 'UniParc ID',
      isChecked: false
    },
    ncbi_id: {
      id: 'ncbi_id',
      label: 'NCBI gene ID',
      isChecked: false
    },
    HGNC: {
      id: 'HGNC',
      label: 'HGNC symbol',
      isChecked: false
    },
    go_domain: { id: 'go_domain', label: 'GO domain', isChecked: false }
  }
};

describe('<CheckboxGrid />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    gridData,
    checkboxOnChange
  };

  it('renders without error', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    expect(wrapper.find(CheckboxGrid).length).toEqual(1);
  });

  it('renders N number of checkboxes based on the gridData', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);

    let totalCheckboxes = 0;

    Object.values(gridData).forEach((section) => {
      totalCheckboxes += Object.keys(section).length;
    });

    expect(wrapper.find(Checkbox).length).toEqual(totalCheckboxes);
  });

  it('sorts the checkboxes alphebatically based on the label', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);

    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();

    const firstCheckbox = firstGridContainer.find(Checkbox).first();
    expect(firstCheckbox.prop('label')).toEqual('End');

    const lastCheckbox = firstGridContainer.find(Checkbox).last();
    expect(lastCheckbox.prop('label')).toEqual('Symbol');
  });

  it('calls the checkboxOnChange when a checkbox is checked/unchecked', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    const firstCheckbox = wrapper.find(Checkbox).first();
    firstCheckbox.find('.defaultCheckbox').simulate('click');
    firstCheckbox.find('.defaultCheckbox').simulate('click');
    /* 
      true - current checkbox status
      default - grid sub-section id
      end- id of the checkbox
    */
    expect(checkboxOnChange).toHaveBeenCalledWith(true, 'default', 'end');

    expect(checkboxOnChange).toHaveBeenLastCalledWith(false, 'default', 'end');
  });

  it('does not display the `Default` title if the sub-section is `default`', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    const firstGridTitle = wrapper.find('.checkboxGridTitle').first();
    expect(firstGridTitle.text()).not.toBe('Default');
  });

  it('hides the unchecked checkboxes when hideUnchecked is true', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} hideUnchecked={true} />);

    let totalCheckedCheckboxes = 0;

    Object.values(gridData).forEach((section) => {
      Object.values(section).forEach((subSection) => {
        if (subSection.isChecked) {
          totalCheckedCheckboxes++;
        }
      });
    });

    expect(wrapper.find(Checkbox).length).toBe(totalCheckedCheckboxes);
  });

  it('hides the title when hideTitles is true', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} hideTitles={true} />);

    expect(wrapper.find('.checkboxGridTitle').length).toBe(0);
  });

  it('draws 3 columns by default', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} />);
    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();
    expect(firstGridContainer.children().length).toBe(3);
  });

  it('draws N number of columns based on the `column` parameter', () => {
    wrapper = mount(<CheckboxGrid {...defaultProps} columns={4} />);
    const firstGridContainer = wrapper.find('.checkboxGridContainer').first();
    expect(firstGridContainer.children().length).toBe(4);
  });
});
