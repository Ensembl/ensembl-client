use std::iter;
use super::super::program::{
    ProgramAttribs, DataBatch, DataGroupIndex, ProgramType, PTMethod, 
    PTGeom, PTSkin
};
use types::{ RFraction, CLeaf, RPixel, RLeaf, cleaf, Rect, Edge, Colour };
use model::shape::ColourSpec;
use super::super::program::Input;

use drivers::webgl::GLProgData;

pub fn rectangle_g(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &RLeaf) {
    if let Some(obj) = pdata.get_object(key) {
        let m = p.offset();
        let n = p.far_offset();
        obj.add_data_f32(&b,&[
            m.0,m.1 as f32,
            m.0,n.1 as f32,
            n.0,n.1 as f32,
            n.0,m.1 as f32
        ]);
    }
}

pub fn rectangle_p(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &RPixel) {
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,&[p]);
    }
}

pub fn rectangle_c(b: DataBatch, pdata: &mut ProgramAttribs, 
                   key: &str, key_sgn: &str, p: &Rect<Edge<i32>,Edge<i32>>) {
    rectangle_p(b,pdata,key,&p.quantity());
    if let Some(obj) = pdata.get_object(key_sgn) {
        obj.add_data(&b,&[&p.corners()]);
    }
}

pub fn poly_p(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[&dyn Input]) {
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,p);
    }
}

pub fn rectangle_t(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &RFraction) {
    if let Some(obj) = pdata.get_object(key) {
        let m = p.offset();
        let n = p.far_offset();
        obj.add_data_f32(&b,&[
            m.0,m.1 as f32,
            m.0,n.1 as f32,
            n.0,n.1 as f32,
            n.0,m.1 as f32
        ]);
    }
}

pub fn colour(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, c: &Colour) {
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data_f32(&b,&c.to_frac());
    }
}

pub fn multi_gl(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, d: &dyn Input, mul: u16) {
    let mut v = Vec::new();
    v.extend(iter::repeat(d).take(mul as usize));
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,&v.as_slice());
    }
}

fn group(pdata: &ProgramAttribs, g: Option<DataGroupIndex>) -> DataGroupIndex {
    g.unwrap_or_else(|| pdata.get_default_group())
}

pub fn vertices_rect(pdata: &mut ProgramAttribs, g: Option<DataGroupIndex>) -> DataBatch {
    let g = group(pdata,g);
    pdata.add_vertices(g,&[0,3,1,2,1,3],4)
}

pub fn vertices_poly(pdata: &mut ProgramAttribs, n: u16, g: Option<DataGroupIndex>) -> DataBatch {
    let g = group(pdata,g);
    let mut v = Vec::<u16>::new();
    
    for i in 0..n-1 {
        v.push(0);
        v.push(i+1);
        v.push(i+2);
    }
    v.push(0);
    v.push(n);
    v.push(1);
    pdata.add_vertices(g,&v,n+1)
}


pub fn vertices_hollowpoly(pdata: &mut ProgramAttribs, n: u16, g: Option<DataGroupIndex>) -> DataBatch {
    let g = group(pdata,g);
    let mut v = Vec::<u16>::new();
    v.push(0);
    for i in 0..n*2 {
        v.push(i);
    }
    v.push(0);
    v.push(1);
    v.push(1);
    pdata.add_vertices(g,&v,n*2)
}

pub fn vertices_strip(pdata: &mut ProgramAttribs, len: u16, g: Option<DataGroupIndex>) -> DataBatch {
    let g = group(pdata,g);
    let mut v = Vec::<u16>::new();
    for i in 0..len {
        v.push(i);
    }
    pdata.add_vertices(g,&v,len)
}

pub fn points_g(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p_in: &[CLeaf], y: i32) {
    if let Some(obj) = pdata.get_object(key) {
        if let Some(v) = p_in.first() { // double first for strip break
            obj.add_data(&b,&[v]);
        }
        for p in p_in {
            let q = *p + cleaf(0.,y);
            obj.add_data(&b,&[p,&q]);
        }
        if let Some(v) = p_in.last() { // double last for strip break
            let q = *v + cleaf(0.,y);
            obj.add_data(&b,&[&q]);
        }
    }
}

pub fn despot(gt: PTGeom, mt: PTMethod, spec: &ColourSpec) -> ProgramType {
    let st = if let ColourSpec::Spot(_) = spec {
        PTSkin::Spot
    } else {
        PTSkin::Colour
    };
    ProgramType(gt,mt,st)
}

pub fn colourspec_to_group(cs: &ColourSpec, g: &mut ProgramAttribs, e: &mut GLProgData) -> Option<DataGroupIndex> {
    match cs {
        ColourSpec::Spot(c) => Some(e.spot().get_group(g,c)),
        _ => None
    }
}
