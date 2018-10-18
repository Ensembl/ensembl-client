use std::collections::HashMap;

use composit::{ Leaf, vscale_bp_per_leaf };
use program::UniformValue;
use types::{CPixel, cpixel, Move, Dot };

// XXX TODO avoid big-big type calculations

#[derive(Clone,Debug)]
pub struct Stage {
    dims: CPixel,
    base: f64,
    pos: Dot<f64,f64>,
    zoom: f32,
    linzoom: f64, /* bp/screen */
}

impl Stage {
    pub fn new() -> Stage {
        let size = cpixel(0,0);
        let mut out = Stage {
            pos: Dot(0.,0.),
            zoom: 0., linzoom: 0., base: 0.,
            dims: size,
        };
        out.set_zoom(0.);
        out
    }

    pub fn get_pos(&self) -> Dot<f64,f64> { self.pos }

    pub fn inc_pos(&mut self, delta: &Move<f64,f64>) {
        self.pos = self.pos + *delta;
    }

    pub fn set_pos(&mut self, pos: &Dot<f64,f64>) {
        self.pos = *pos;
    }

    pub fn set_zoom(&mut self, val: f32) {
        self.zoom = val;
        self.linzoom = 1.0/10.0_f32.powf(val) as f64;
    }
    
    #[allow(unused)]
    pub fn get_zoom(&self) -> f32 {
        self.zoom
    }
    
    pub fn get_linear_zoom(&self) -> f64 {
        self.linzoom
    }

    pub fn get_size(&self) -> CPixel {
        self.dims
    }

    pub fn set_size(&mut self, size: &CPixel) {
        self.dims = *size;
    }

    pub fn get_uniforms(&self, leaf: &Leaf) -> HashMap<&str,UniformValue> {
        let z = self.get_linear_zoom();
        let zl = vscale_bp_per_leaf(leaf.get_vscale());
        let ls = z as f64 / zl;
        //debug!("trains","{} bp/screen; {} bp/leaf; {} leaf/screen",z,zl,ls);
        let x = self.pos.0*ls/z as f64*1_f64;
        hashmap! {
            "uStageHpos" => UniformValue::Float((x - leaf.get_offset() as f64) as f32),
            "uStageVpos" => UniformValue::Float((self.pos.1 + self.dims.1 as f64/2.) as f32),
            "uStageZoom" => UniformValue::Float((2_f64/ls) as f32),
            "uSize" => UniformValue::Vec2F(
                self.dims.0 as f32/2.,
                self.dims.1 as f32/2.)
        }
    }
}
