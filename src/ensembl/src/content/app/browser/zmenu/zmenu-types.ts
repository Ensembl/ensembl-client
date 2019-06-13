// relation of the point of interest to the central point of the canvas;
// a gentle hint by genome browser about where there is the most available space
// e.g. if the reported side of a point is 'left', zmenu will position itself
// to the right of this point
// TODO: check if this type is required
export enum Side {
  LEFT = 'left',
  RIGHT = 'right',
  MIDDLE = 'middle'
}

// coordinates of the point at which zmenu should be pointing
type AnchorCoordinates = {
  x: number;
  y: number;
};

enum Markup {
  STRONG = 'strong',
  EMPHASIS = 'emphasis',
  FOCUS = 'focus',
  SMALL = 'SMALL'
}

export enum ZmenuAction {
  CREATE = 'create_zmenu',
  DESTROY = 'destroy_zmenu',
  REPOSITION = 'update_zmenu_position'
}

type ZmenuContentItem = {
  text: string;
  markup: Markup[];
};

type ZmenuContentBlock = ZmenuContentItem[];

type ZmenuContentLine = ZmenuContentBlock[];

type ZmenuContentSection = {
  id: string;
  lines: ZmenuContentLine[];
};

type ZmenuContentFeature = ZmenuContentSection[];

// data that is sufficient to describe an instance of Zmenu
export type ZmenuData = {
  id: string;
  anchor_coordinates: AnchorCoordinates;
  content: ZmenuContentFeature[];
};

export type ZmenuCreatePayload = {
  action: ZmenuAction.CREATE;
  id: string;
  anchor_coordinates: AnchorCoordinates;
  content: ZmenuContentFeature[];
};

// Sent from Genome browser to React
export type ZmenuCreateEvent = Event & ZmenuCreatePayload;

export type ZmenuDestroyPayload = {
  id: string;
  action: ZmenuAction.DESTROY;
};

// Sent from Genome browser to React
export type ZmenuDestroyEvent = Event & ZmenuDestroyPayload;

// Sent from React to Genome browser
// (on mouseover; perhaps tap?)
export type ZmenuEnterEvent = {
  id: string;
  action: 'zmenu-enter';
};

// Sent from React to Genome browser
// (on mouseleave, or on click outside)
export type ZmenuLeaveEvent = {
  id: string;
  action: 'zmenu-leave';
};

// Sent from Genome browser to React
export type ZmenuRepositionPayload = {
  id: string;
  action: ZmenuAction.REPOSITION;
  anchor_coordinates: {
    x: number;
    y: number;
  };
};

export type ZmenuRepositionEvent = Event & ZmenuRepositionPayload;

export type ZmenuIncomingEvent =
  | ZmenuCreateEvent
  | ZmenuDestroyEvent
  | ZmenuRepositionEvent;

/*

======= EXAMPLE OF ZMENU CONTENT ========

[
  {
    id: "transrcipt:ENST00000380152.7", // (4)
    lines: [
      [ // first line
        [ // "Transcript ENST....."
          { text: "Transcript", markup: [] },
          { text: "ENST00000380152.7", markup: ["strong"] }
        ],
        [ // protein coding
          { text: "protein coding", markup: [] }
        ],
        [ // forward strand
          { text: "forward strand", markup: [] }
        ]
      ],
      [ // second line
        [ // ENST....
          { text: "ENST00000380152.7", markup: ["focus"] },
          { text: "MANE select", markup: [] }
        ]
      ]
    ]
  },{
    id: "gene:ENSG00000139618", // (4)
    lines: [
      [
        [ // "Gene BRCA2"
          { text: "Gene", markup: [] },
          { text: "BRCA2", markup: ["strong"] }
        ],
        [ // DNA-repair associated
          { text: "DNA-repair associated", markup: [] },
        ]
      ],
      [ // fourth line
        [
          { text: "ENSG00000139618", markup: [] }
        ]
      ]
    ]
  }
]

*/
