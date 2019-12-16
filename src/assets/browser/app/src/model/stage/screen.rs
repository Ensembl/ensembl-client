use types::{
    CPixel, Dot, LEFT, UP, XPosition, YPosition, Placement
};
use super::Position;

#[derive(Debug,Clone)]
pub struct Screen {
    dims: Dot<f64,f64>,
    mouse_pos: CPixel,
    min_x_bumper: f64,
    max_x_bumper: f64,
    max_y: i32,
    y_pos: f64
}

impl Screen {
    pub fn new() -> Screen {
        let mut out = Screen {
            mouse_pos: Dot(0,0),
            dims: Dot(0.,0.),
            min_x_bumper: 0.,
            max_x_bumper: 0.,
            max_y: 0,
            y_pos: 0.
        };
        out.maybe_nudge_y_to_fit_limits();
        out
    }

    pub fn get_y_pos(&self) -> f64 { self.y_pos }

    fn maybe_nudge_y_to_fit_limits(&mut self) {
        let screen_y_height = self.get_size().1;
        let max_y = self.get_max_y() as f64;
        self.y_pos = self.y_pos
            .min(max_y - screen_y_height as f64/2.)
            .max(screen_y_height as f64/2.);
    }

    pub fn set_y_pos(&mut self, y: f64) {
        self.y_pos = y;
        self.maybe_nudge_y_to_fit_limits();
    }

    pub fn get_top_edge(&self) -> f64 {
        self.y_pos - self.get_size().1/2.
    }

    pub fn get_bottom_edge(&self) -> f64 {
        self.y_pos + self.get_size().1/2.
    }

    pub fn set_max_y(&mut self, y: i32) { self.max_y = y; }
    pub fn get_max_y(&self) -> i32 { self.max_y }

    pub fn get_x_bumpers(&self) -> (f64,f64) {
        (self.min_x_bumper,self.max_x_bumper)
    }

    pub fn set_x_bumpers(&mut self, min: f64, max: f64) {
        self.min_x_bumper = min;
        self.max_x_bumper = max;
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
        let left_bp = apos.get_left_edge();
        let top_px = self.get_top_edge();
        match area {
            Placement::Stretch(r) => {
                let pos_bp = left_bp + pos.0 as f64 * bp_px;
                let nw = r.offset();
                let se = r.far_offset();
                blackbox_log!("zmenu","Q {:?}<={:?}[{:?}+{:?}*{:?}]<={:?} {:?}<={:?}<={:?}",
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
                blackbox_log!("zmenu","P {:?}<={:?}<={:?} {:?}<={:?}<={:?}",
                            x0,pos.0,x1, y0,pos.1,y1);
                x0 <= pos.0 as f64 && x1 >= pos.0 as f64 &&
                y0 <= pos.1 as f64 && y1 >= pos.1 as f64
            }
        }
    }
}