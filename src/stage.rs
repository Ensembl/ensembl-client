use std::collections::HashMap;

use arena::ArenaFlatCanvas;
use program::UniformValue;
use types::{ CFraction, CPixel, cfraction, cpixel };

#[derive(Clone,Debug)]
pub struct Stage {
    dims: CPixel,
    pub pos: CFraction,
    zoom: f32,
    linzoom: f32,
}

impl Stage {
    pub fn new() -> Stage {
        let size = cpixel(0,0);
        let mut out = Stage {
            pos: cfraction(0.,0.),
            zoom: 0., linzoom: 0.,
            dims: size
        };
        out.set_zoom(0.);
        out
    }

    pub fn set_zoom(&mut self, val: f32) {
        self.zoom = val;
        self.linzoom = 1.0/10.0_f32.powf(val);
    }
    
    #[allow(unused)]
    pub fn get_zoom(&self) -> f32 {
        self.zoom
    }
    
    pub fn get_linear_zoom(&self) -> f32 {
        self.linzoom
    }

    pub fn get_size(&self) -> CPixel {
        self.dims
    }

    pub fn set_size(&mut self, size: &CPixel) {
        self.dims = *size;
    }

    pub fn get_uniforms(&self, canvs: &ArenaFlatCanvas) -> HashMap<&str,UniformValue> {
        console!("size={:?}",self.dims);
        hashmap! {
            "uSampler" => UniformValue::Int(0), // XXX
            "uStageHpos" => UniformValue::Float(self.pos.0),
            "uStageVpos" => UniformValue::Float(self.pos.1 + self.dims.1 as f32/2.),
            "uStageZoom" => UniformValue::Float(self.get_linear_zoom()*2.),
            "uSize" => UniformValue::Vec2F(
                self.dims.0 as f32/2.,
                self.dims.1 as f32/2.)
        }
    }
}
