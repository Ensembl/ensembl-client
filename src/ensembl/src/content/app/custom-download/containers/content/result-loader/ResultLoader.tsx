import { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getPreviewResult,
  getIsLoadingResult
} from '../../../state/customDownloadSelectors';

import { getSelectedAttributes } from '../../../state/attributes/attributesSelector';
import { getSelectedFilters } from '../../../state/filters/filtersSelector';

import {
  setPreviewResult,
  setIsLoadingResult,
  fetchPreviewResult
} from '../../../state/customDownloadActions';

import JSONValue from 'src/shared/types/JSON';

import { getEndpointUrl } from './resultLoaderHelper';

import { flattenObject } from 'src/content/app/custom-download/containers/content/customDownloadContentHelper';

type StateProps = {
  selectedAttributes: JSONValue;
  selectedFilters: JSONValue;
  preview: JSONValue;
  isLoadingResult: boolean;
};

type DispatchProps = {
  fetchPreviewResult: (endpointURL: string) => void;
  clearPreviewResult: () => void;
  setIsLoadingResult: (isLoadingResult: boolean) => void;
};

type Props = StateProps & DispatchProps;

const ResultLoader = (props: Props) => {
  useEffect(() => {
    const flatSelectedAttributes: { [key: string]: boolean } = flattenObject(
      props.selectedAttributes
    );

    const totalSelectedAttributes = Object.keys(flatSelectedAttributes).length;
    if (!totalSelectedAttributes && props.preview.results) {
      props.clearPreviewResult();
      return;
    } else if (!totalSelectedAttributes) {
      return;
    }

    const endpointURL = getEndpointUrl(
      flatSelectedAttributes,
      props.selectedFilters
    );

    if (totalSelectedAttributes) {
      props.setIsLoadingResult(true);
      props.fetchPreviewResult(endpointURL);
    }
  }, [props.selectedAttributes, props.selectedFilters]);

  useEffect(() => {
    props.setIsLoadingResult(false);
  }, [props.preview]);

  return null;
};

const mapDispatchToProps: DispatchProps = {
  fetchPreviewResult: fetchPreviewResult,
  clearPreviewResult: () => setPreviewResult.success({}),
  setIsLoadingResult
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state),
  selectedFilters: getSelectedFilters(state),
  preview: getPreviewResult(state),
  isLoadingResult: getIsLoadingResult(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultLoader);
