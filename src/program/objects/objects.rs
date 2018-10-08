use std::collections::HashMap;

use stdweb::web::TypedArray;

use stdweb::web::html_element::CanvasElement;
use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use drawing::Drawing;
use drawing::AllCanvasMan;
use program::data::{ DataBatch, DataGroup, Input };
use program::objects::UniformValue;

/* This is the meat of each Object implementation */
pub trait Object {
    fn add_f32(&mut self, _values: &[f32], _batch: &DataBatch) {}
    fn add_tdr(&mut self, _value: &Drawing) {}

    fn get_tdr(&self) -> Vec<Drawing> {
        Vec::<Drawing>::new()
    }

    fn add_data(&mut self, _batch: &DataBatch, _values: &[&Input]) {}
    fn set_uniform(&mut self, _group: Option<DataGroup>, _value: UniformValue) {}

    fn is_main(&self) -> bool { false }
    fn add_index(&mut self, _batch: &DataBatch, _indexes: &[u16], _points: u16) {}

    fn obj_final(&mut self, _batch: &DataBatch, _ctx: &glctx, _acm: &AllCanvasMan) {}
    fn execute(&self, _ctx: &glctx, _batch: &DataBatch) {}
    fn clear(&mut self) {}
}
