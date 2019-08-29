use types::{
    CPixel, Move, Dot, Direction,
    LEFT, RIGHT, UP, DOWN, IN, OUT, XPosition, YPosition, Placement
};
use super::Position;

#[derive(Debug,Clone)]
pub struct Screen {
    dims: Dot<f64,f64>,
    mouse_pos: CPixel,
}

impl Screen {
    pub fn new() -> Screen {
        Screen {
            mouse_pos: Dot(0,0),
            dims: Dot(0.,0.)
        }
    }

    pub fn set_mouse_pos(&mut self, c: &CPixel) {
        self.mouse_pos = *c;
    }

    pub fn get_mouse_pos_prop(&self) -> f64 {
        self.mouse_pos.0 as f64 / self.get_size().0 as f64
    }

    pub fn get_size(&self) -> Dot<f64,f64> {
        self.dims
    }

    pub fn set_size(&mut self, size: &Dot<f64,f64>) {
        self.dims = *size;
    }

    pub fn intersects(&self, pos: Dot<i32,i32>, area: &Placement, apos: &Position) -> bool {
        let screen_bp = apos.get_screen_in_bp();
        let screen_px = self.dims;
        let bp_px = screen_bp / screen_px.0;
        let left_bp = apos.get_edge(&LEFT,false);
        let top_px = apos.get_edge(&UP,false);
        match area {
            Placement::Stretch(r) => {
                let pos_bp = left_bp + pos.0 as f64 * bp_px;
                let nw = r.offset();
                let se = r.far_offset();
                bb_log!("zmenu","Q {:?}<={:?}[{:?}+{:?}*{:?}]<={:?} {:?}<={:?}<={:?}",
                            nw.0,pos_bp,left_bp,pos.0,bp_px,se.0,
                            nw.1,pos.1+top_px as i32,se.1);
                nw.0 as f64 <= pos_bp && se.0 as f64 >= pos_bp &&
                nw.1 <= pos.1+top_px as i32 && se.1 >= pos.1+top_px as i32
            },
            Placement::Placed(x,y) => {
                let (x0,x1) = match x {
                    XPosition::Base(bp,s,e) => {
                        let px = (bp-left_bp) / bp_px;
                        (px+*s as f64,px+*e as f64)
                    },
                    XPosition::Pixel(s,e) => {
                        (s.min_dist(screen_px.0 as i32) as f64,
                         e.min_dist(screen_px.0 as i32) as f64)
                    }
                };
                let (y0,y1) = match y {
                    YPosition::Page(s,e) => {
                        (*s as f64-top_px, *e as f64-top_px)
                    }
                    YPosition::Pixel(s,e) => {
                        (s.min_dist(screen_px.1 as i32) as f64,
                         e.min_dist(screen_px.1 as i32) as f64)
                    }
                };
                bb_log!("zmenu","P {:?}<={:?}<={:?} {:?}<={:?}<={:?}",
                            x0,pos.0,x1, y0,pos.1,y1);
                x0 <= pos.0 as f64 && x1 >= pos.0 as f64 &&
                y0 <= pos.1 as f64 && y1 >= pos.1 as f64
            }
        }
    }
}