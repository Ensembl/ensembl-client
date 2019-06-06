import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getPreviewResult } from '../../state/customDownloadSelectors';

import styles from './PreviewTable.scss';

type OwnProps = {
  resultData: [];
};

type Props = OwnProps & StateProps;

const PreviewTable = (props: Props) => {
  const gridData = [...props.resultData];
  const headerRow: [] = gridData[0];
  gridData.shift();

  return (
    <>
      <table className={styles.previewTableHeader}>
        <tbody>
          <tr>
            {headerRow.map((cell: any, cellKey: number) => {
              return <td key={cellKey}>{cell}</td>;
            })}
          </tr>
        </tbody>
      </table>
      <div className={styles.previewWrapper}>
        <table className={styles.previewTable}>
          <tbody>
            {gridData.map((row: any, rowKey: number) => {
              return (
                <tr key={rowKey}>
                  {[...row].map((cell: any, cellKey: number) => {
                    return <td key={cellKey}>{cell ? cell : '-'}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
