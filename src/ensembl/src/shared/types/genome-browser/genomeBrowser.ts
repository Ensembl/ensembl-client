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

export enum OutgoingActionType {
  PING = 'ping',
  ACTIVATE_BROWSER = 'activate_browser',
  MOVE_DOWN = 'move_down',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  MOVE_UP = 'move_up',
  SET_FOCUS = 'set_focus',
  SET_FOCUS_LOCATION = 'set_focus_location',
  TOGGLE_TRACKS = 'toggle_tracks',
  TURN_ON_TRACKS = 'turn_on_tracks',
  TURN_OFF_TRACKS = 'turn_off_tracks',
  TURN_ON_LABELS = 'turn_on_labels',
  TURN_OFF_LABELS = 'turn_off_labels',
  ZMENU_ACTIVITY_OUTSIDE = 'zmenu-activity-outside', // TODO: sometime later, unify underscores vs hyphens (together with Genome Browser)
  ZMENU_ENTER = 'zmenu-enter',
  ZMENU_LEAVE = 'zmenu-leave',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out'
}

export enum IncomingActionType {
  GENOME_BROWSER_READY = 'genome_browser_ready',
  CURRENT = 'current',
  TARGET = 'target',
  UPDATE_SCROLL_POSITION = 'update_scroll_position',
  UPDATE_TRACK_SUMMARY = 'tracks',
  ZMENU_CREATE = 'create_zmenu',
  ZMENU_DESTROY = 'destroy_zmenu',
  ZMENU_REPOSITION = 'update_zmenu_position'
}
