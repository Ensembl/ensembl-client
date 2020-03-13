/*
The first part of position name signifies the direction in which PointerBox
is positioned relative to the anchor.
The second part of position name refers to the direction in which the body
of the pointer box will grow with more content

Eexamples:

anchor
__/\____________
| BOTTOM_RIGHT |
|______________|

__________
|          \ 
|  LEFT    /  anchor
|  BOTTOM |
|         |
|_________|

*/

export enum Position {
  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
  RIGHT_TOP = 'right_top',
  RIGHT_BOTTOM = 'right_bottom',
  BOTTOM_RIGHT = 'bottom_right',
  BOTTOM_LEFT = 'bottom_left',
  LEFT_BOTTOM = 'left_bottom',
  LEFT_TOP = 'left_top'
}
