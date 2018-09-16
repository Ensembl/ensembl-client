use std::collections::HashMap;

use stdweb::web::HtmlElement;

use arena::ArenaCanvases;
use dom::domutil;
use program::UniformValue;
use types::{ CFraction, CPixel, cfraction, cpixel };

#[derive(Clone,Debug)]
pub struct Stage {
    dims: CPixel,
    pub pos: CFraction,
    zoom: f32,
    linzoom: f32,
    el: HtmlElement,
}

impl Stage {
    pub fn new(el: &HtmlElement) -> Stage {
        let size = cpixel(0,0);
        let mut out = Stage {
            pos: cfraction(0.,0.), el: el.clone(),
            zoom: 0., linzoom: 0.,
            dims: size
        };
        out.set_zoom(0.);
        out.recalc_size();
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

    pub fn recalc_size(&mut self) {
        self.dims = domutil::size(&self.el);
    }

    pub fn get_uniforms(&self, canvs: &ArenaCanvases) -> HashMap<&str,UniformValue> {
        hashmap! {
            "uSampler" => UniformValue::Int(canvs.idx),
            "uStageHpos" => UniformValue::Float(self.pos.0),
            "uStageVpos" => UniformValue::Float((self.pos.1 + self.dims.1 as f32)/2.),
            "uStageZoom" => UniformValue::Float(self.get_linear_zoom()),
            "uSize" => UniformValue::Vec2F(
                self.dims.0 as f32/2.,
                self.dims.1 as f32/2.)
        }
    }
}
