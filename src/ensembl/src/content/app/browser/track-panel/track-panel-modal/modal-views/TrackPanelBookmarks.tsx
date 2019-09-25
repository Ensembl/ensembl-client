import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { getBrowserActiveGenomeId } from '../../../browserSelectors';
import { updateTrackStates } from 'src/content/app/browser/browserActions';
import { TrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { closeTrackPanelModal } from '../../trackPanelActions';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as EllipsisIcon } from 'static/img/track-panel/ellipsis.svg';
import { changeDrawerViewAndOpen } from 'src/content/app/browser/drawer/drawerActions';
import { Bookmark } from 'src/content/app/browser/track-panel/trackPanelState';

import styles from '../TrackPanelModal.scss';

type StateProps = {
  activeGenomeId: string | null;
  exampleEnsObjects: EnsObject[];
  previouslyViewedObjects: Bookmark[];
};

type DispatchProps = {
  fetchExampleEnsObjects: (objectId: string) => void;
  updateTrackStates: (trackStates: TrackStates) => void;
  closeTrackPanelModal: () => void;
  changeDrawerViewAndOpen: (drawerView: string) => void;
};
export type TrackPanelBookmarksProps = StateProps & DispatchProps;

type ExampleLinksProps = Pick<
  TrackPanelBookmarksProps,
  'exampleEnsObjects' | 'activeGenomeId' | 'closeTrackPanelModal'
>;
export const ExampleLinks = (props: ExampleLinksProps) => {
  return (
    <div>
      {props.exampleEnsObjects.map((exampleObject) => {
        const path = urlFor.browser({
          genomeId: props.activeGenomeId,
          focus: exampleObject.object_id
        });

        return (
          <dd key={exampleObject.object_id}>
            <Link to={path} onClick={props.closeTrackPanelModal}>
              {exampleObject.label}
            </Link>
            <span className={styles.previouslyViewedType}>
              {upperFirst(exampleObject.object_type)}
            </span>
          </dd>
        );
      })}
    </div>
  );
};

type PreviouslyViewedLinksProps = Pick<
  TrackPanelBookmarksProps,
  'previouslyViewedObjects' | 'updateTrackStates' | 'closeTrackPanelModal'
>;

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  const onClickHandler = (previouslyViewedObject: Bookmark) => {
    props.updateTrackStates({
      [previouslyViewedObject.genome_id]: {
        ...previouslyViewedObject.trackStates
      }
    });

    props.closeTrackPanelModal();
  };

  return (
    <div>
      {[...props.previouslyViewedObjects]
        .reverse()
        .map((previouslyViewedObject, index) => {
          const path = urlFor.browser({
            genomeId: previouslyViewedObject.genome_id,
            focus: previouslyViewedObject.object_id
          });

          return (
            <dd key={index}>
              <Link
                to={path}
                onClick={() => onClickHandler(previouslyViewedObject)}
              >
                {previouslyViewedObject.label}
              </Link>
              <span className={styles.previouslyViewedType}>
                {upperFirst(previouslyViewedObject.object_type)}
              </span>
            </dd>
          );
        })}
    </div>
  );
};

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  const {
    previouslyViewedObjects,
    exampleEnsObjects,
    activeGenomeId,
    updateTrackStates,
    closeTrackPanelModal
  } = props;

  const limitedPreviouslyViewedObjects = previouslyViewedObjects.slice(-20);

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      {exampleEnsObjects.length ? (
        <dl className={styles.previouslyViewedObject}>
          <dt>Example links</dt>
          <ExampleLinks
            exampleEnsObjects={exampleEnsObjects}
            activeGenomeId={activeGenomeId}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </dl>
      ) : null}
      {limitedPreviouslyViewedObjects.length ? (
        <dl className={styles.previouslyViewedObject}>
          <dt>
            Previously viewed
            <span className={styles.ellipsis}>
              <ImageButton
                buttonStatus={ImageButtonStatus.ACTIVE}
                description={'View all'}
                image={EllipsisIcon}
                onClick={() => props.changeDrawerViewAndOpen('bookmarks')}
              />
            </span>
            <span className={styles.allText}>All</span>
          </dt>
          <PreviouslyViewedLinks
            previouslyViewedObjects={limitedPreviouslyViewedObjects}
            updateTrackStates={updateTrackStates}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </dl>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  previouslyViewedObjects: getActiveGenomePreviouslyViewedObjects(state)
});

const mapDispatchToProps = {
  fetchExampleEnsObjects,
  updateTrackStates,
  closeTrackPanelModal,
  changeDrawerViewAndOpen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
