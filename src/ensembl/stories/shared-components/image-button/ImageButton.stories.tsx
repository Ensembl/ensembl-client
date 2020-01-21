import React from 'react';
import { storiesOf } from '@storybook/react';

import { ReactComponent as VisibilityIcon } from 'static/img/track-panel/eye.svg';
import { ReactComponent as EllipsisIcon } from 'static/img/track-panel/ellipsis.svg';
import { ReactComponent as BookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as DownloadIcon } from 'static/img/sidebar/download.svg';
import { ReactComponent as SearchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as PersonalDataIcon } from 'static/img/sidebar/own-data.svg';
import { ReactComponent as ShareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as TracksManagerIcon } from 'static/img/sidebar/tracks-manager.svg';

import ImageButtonParent from './ImageButtonParent.stories';

const trackPanelButtons: any = {
  BookmarkIcon: [BookmarkIcon, 'static/img/sidebar/bookmark.svg'],
  DownloadIcon: [DownloadIcon, 'static/img/sidebar/download.svg'],
  EllipsisIcon: [EllipsisIcon, 'static/img/track-panel/ellipsis.svg'],
  PersonalDataIcon: [PersonalDataIcon, 'static/img/sidebar/own-data.svg'],
  SearchIcon: [SearchIcon, 'static/img/sidebar/search.svg'],
  ShareIcon: [ShareIcon, 'static/img/sidebar/share.svg'],
  TracksManagerIcon: [
    TracksManagerIcon,
    'static/img/sidebar/tracks-manager.svg'
  ],
  VisibilityIcon: [VisibilityIcon, 'static/img/track-panel/eye.svg']
};

const trackPanelButtonStories = storiesOf(
  'Components|Shared Components/ImageButton/TrackPanel',
  module
);

Object.keys(trackPanelButtons).forEach((buttonName: string) => {
  trackPanelButtonStories.add(buttonName, () => {
    return (
      <ImageButtonParent
        imageName={buttonName}
        image={trackPanelButtons[buttonName][0]}
        imagePath={trackPanelButtons[buttonName][1]}
        classNames={trackPanelButtons[buttonName][2]}
      />
    );
  });
});
