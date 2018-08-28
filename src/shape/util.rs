use std::iter;
use program::{ ProgramAttribs, DataBatch, DataGroup };
use coord::{ CPixel, CFraction, CLeaf, Input, Colour };
use shape::ColourSpec;

pub fn triangle_gl(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[&Input;3]) {
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,&[p[0], p[1], p[2]]);
    }
}

pub fn rectangle_g(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[CLeaf;2]) {
    let v = &p[0].rectangle(p[1]);
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,&[&v[0], &v[1], &v[2], &v[3]]);
    }
}

pub fn rectangle_p(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[CPixel;2]) {
    let v = &p[0].rectangle(p[1]);
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,&[&v[0], &v[1], &v[2], &v[3]]);
    }
}

pub fn rectangle_t(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[CFraction;2]) {
    let v = &p[0].rectangle(p[1]);
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,&[&v[0], &v[1], &v[2], &v[3]]);
    }
}

pub fn multi_gl(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, d: &Input, mul: u8) {
    let mut v = Vec::<&Input>::new();
    v.extend(iter::repeat(d).take(mul as usize));
    if let Some(obj) = pdata.get_object(key) {
        obj.add_data(&b,&v.as_slice());
    }
}

fn group(pdata: &ProgramAttribs, g: Option<DataGroup>) -> DataGroup {
    g.unwrap_or_else(|| pdata.get_default_group())
}

pub fn vertices_rect(pdata: &mut ProgramAttribs, g: Option<DataGroup>) -> DataBatch {
    let g = group(pdata,g);
    pdata.add_vertices(g,&[0,3,1,2,1,3],4)
}

pub fn vertices_tri(pdata: &mut ProgramAttribs, g: Option<DataGroup>) -> DataBatch {
    let g = group(pdata,g);
    pdata.add_vertices(g,&[0,1,2],3)
}

pub fn vertices_strip(pdata: &mut ProgramAttribs, len: u16, g: Option<DataGroup>) -> DataBatch {
    let g = group(pdata,g);
    let mut v = Vec::<u16>::new();
    for i in 0..len {
        v.push(i);
    }
    pdata.add_vertices(g,&v,len)
}

pub fn points_g(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p_in: &[CLeaf], y: i32) {
    if let Some(obj) = pdata.get_object(key) {
        for p in p_in {
            let q = *p + CLeaf(0.,y);
            obj.add_data(&b,&[p,&q]);
        }
    }
}

pub enum ColourSpecImpl {
    Colour(Colour),
    Spot(DataGroup)
}

impl ColourSpecImpl {
    pub fn to_group(&self) -> Option<DataGroup> {
        match self {
            ColourSpecImpl::Spot(dg) => Some(*dg),
            ColourSpecImpl::Colour(_) => None
        }
    }
}

pub fn despot(geom: &str, spec: &ColourSpec) -> (String, ColourSpecImpl) {
        let mut g_out = geom.to_string();
        let c_out = match spec {
            ColourSpec::Colour(c) => 
                ColourSpecImpl::Colour(**c),
            ColourSpec::Spot(s) => {
                g_out.push_str("spot");
                ColourSpecImpl::Spot(s.get_group(&g_out))
            }
        };
        (g_out,c_out)
}
