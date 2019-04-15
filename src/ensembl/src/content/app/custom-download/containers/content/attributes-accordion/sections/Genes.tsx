import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getSelectedGeneDataToDownload } from 'src/content/app/custom-download/customDownloadSelectors';
import { setAttributes } from 'src/content/app/custom-download/customDownloadActions';
import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

type Props = StateProps;

const Genes = (props: Props) => {
  if (!props.geneDataToDownload || !props.geneDataToDownload.default) {
    return null;
  }

  const onChangeHandler = (status: boolean, attribute_id: string) => {
    props.setGeneAttributes(Ob);
  };

  return (
    <CheckBoxGrid
      checkboxOnChange={onChangeHandler}
      gridData={props.geneDataToDownload}
      columns={3}
    />
  );
};

type StateProps = {
  geneDataToDownload: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  geneDataToDownload: getSelectedGeneDataToDownload(state)
});

export default connect(mapStateToProps)(Genes);
