use std::collections::HashMap;

use composit::{ Leaf, Wrapping };
use controller::output::{ Report, ViewportReport };
use drivers::webgl::program::UniformValue;
use types::{
    CPixel, Move, Dot, Direction,
    LEFT, RIGHT, UP, DOWN, IN, OUT, XPosition, YPosition, Placement
};
use super::position::{ Position };
use super::Screen;

// XXX TODO avoid big-minus-big type calculations which accumulate error

#[derive(Debug)]
pub struct Stage {
    screen: Screen,
    apos: Position,
    ipos: Position,
}

impl Stage {
    pub fn new() -> Stage {
        let size = Dot(0.,0.);
        Stage {
            screen: Screen::new(),
            apos: Position::new(Dot(0.,0.),size),
            ipos: Position::new(Dot(0.,0.),size),
        }
    }

    pub fn get_screen(&self) -> &Screen { &self.screen }
    pub fn get_screen_mut(&mut self) -> &mut Screen { &mut self.screen }

    pub fn get_position(&self) -> &Position { &self.apos }
    pub fn get_position_mut(&mut self) -> &mut Position { &mut self.apos }

    pub fn intend_here(&mut self) {
        self.ipos.set_middle(&self.apos.get_middle());
        self.ipos.set_zoom(self.apos.get_zoom());
    }

    fn bumped(&self, direction: &Direction) -> bool {
        let mul : f64 = direction.1.into();
        self.apos.get_edge(direction,true).floor() * mul >= self.apos.get_limit_of_edge(direction).floor() * mul
    }

    pub fn update_report(&self, report: &Report) {
        let (aleft,aright) = (self.apos.get_edge(&LEFT,false),self.apos.get_edge(&RIGHT,false));
        report.set_status("a-start",&aleft.floor().to_string());
        report.set_status("a-end",&aright.ceil().to_string());
        let (ileft,iright) = (self.ipos.get_edge(&LEFT,false),self.ipos.get_edge(&RIGHT,false));
        report.set_status("i-start",&ileft.floor().to_string());
        report.set_status("i-end",&iright.ceil().to_string());
        report.set_status_bool("bumper-left",self.bumped(&LEFT));
        report.set_status_bool("bumper-right",self.bumped(&RIGHT));
        report.set_status_bool("bumper-top",self.bumped(&UP));
        report.set_status_bool("bumper-bottom",self.bumped(&DOWN));
        report.set_status_bool("bumper-in",self.bumped(&IN));
        report.set_status_bool("bumper-out",self.bumped(&OUT));
    }

    pub fn set_wrapping(&mut self, w: &Wrapping) {
        self.apos.set_bumper(&LEFT,w.get_bumper(&LEFT));
        self.apos.set_bumper(&RIGHT,w.get_bumper(&RIGHT));
        self.ipos.set_bumper(&LEFT,w.get_bumper(&LEFT));
        self.ipos.set_bumper(&RIGHT,w.get_bumper(&RIGHT));
    }
    
    pub fn set_screen_in_bp(&mut self, zoom: f64) {
        self.apos.set_screen_in_bp(zoom);
        self.ipos.set_screen_in_bp(zoom);
    }
     
    pub fn get_pos_prop_bp(&self, prop: f64) -> f64 {
        let start = self.apos.get_middle().0 - self.apos.get_linear_zoom() / 2.;
        start + prop * self.apos.get_linear_zoom()
    }

    pub fn pos_prop_bp_to_origin(&self, pos: f64, prop: f64) -> f64 {
        let start = pos - prop * self.apos.get_linear_zoom();
        start + self.apos.get_linear_zoom()/2.
    }

    pub fn set_limit(&mut self, which: &Direction, val: f64) {
        self.apos.set_limit(which,val);
        self.ipos.set_limit(which,val);
    }
    
    pub fn inform_screen_size(&mut self, size: &Dot<f64,f64>) {
        self.apos.inform_screen_size(size);
        self.ipos.inform_screen_size(size);
    }

    pub fn get_uniforms(&self, leaf: &Leaf, opacity: f32) -> HashMap<&str,UniformValue> {
        let bp_per_screen = self.apos.get_linear_zoom();
        let bp_per_leaf = leaf.total_bp();
        let leaf_per_screen = bp_per_screen as f64 / bp_per_leaf;
        let middle_bp = self.apos.get_middle();
        let middle_leaf = middle_bp.0/bp_per_leaf; // including fraction of leaf
        let current_leaf_left = leaf.get_index() as f64;
        let px_per_screen = self.get_screen().get_size();
        hashmap! {
            "uOpacity" => UniformValue::Float(opacity),
            "uStageHpos" => UniformValue::Float((middle_leaf - current_leaf_left) as f32),
            "uStageVpos" => UniformValue::Float(middle_bp.1 as f32),
            "uStageZoom" => UniformValue::Float((2_f64/leaf_per_screen) as f32),
            "uSize" => UniformValue::Vec2F(
                px_per_screen.0 as f32/2.,
                px_per_screen.1 as f32/2.)
        }
    }    
}
