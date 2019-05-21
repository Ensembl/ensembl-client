import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getPreviewResult } from '../../customDownloadSelectors';

import styles from './PreviewTable.scss';

type OwnProps = {
  resultData: [];
};

type Props = OwnProps & StateProps;

const PreviewTable = (props: Props) => {
  return (
    <>
      <table className={styles.previewTable}>
        <tbody>
          {[...props.resultData].map((row: any, rowKey: number) => {
            return (
              <tr key={rowKey}>
                {[...row].map((cell: any, cellKey: number) => {
                  return <td key={cellKey}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

type StateProps = {
  previewResult: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  previewResult: getPreviewResult(state)
});

export default connect(mapStateToProps)(PreviewTable);
