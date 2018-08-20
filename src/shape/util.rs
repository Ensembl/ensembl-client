use std::iter;

use compiler::GLProgramData;
use coord::{
    PCoord,
    TCoord,
    GCoord,
    GLData,
};

pub fn triangle_gl(pdata: &mut GLProgramData, key: &str, p: &[&GLData;3]) {
    pdata.add_attrib_data(key,&[p[0], p[1], p[2]]);
}

pub fn rectangle_g(pdata: &mut GLProgramData, key: &str, p: &[GCoord;2]) {
    let t = &p[0].triangles(p[1]);
    pdata.add_attrib_data(key,&[&t.0[0], &t.0[1], &t.0[2]]);
    pdata.add_attrib_data(key,&[&t.1[0], &t.1[1], &t.1[2]]);
}

pub fn rectangle_p(pdata: &mut GLProgramData, key: &str, p: &[PCoord;2]) {
    let t = &p[0].triangles(p[1]);
    pdata.add_attrib_data(key,&[&t.0[0], &t.0[1], &t.0[2]]);
    pdata.add_attrib_data(key,&[&t.1[0], &t.1[1], &t.1[2]]);
}

pub fn rectangle_t(pdata: &mut GLProgramData, key: &str, p: &[TCoord;2]) {
    let t = &p[0].triangles(p[1]);
    pdata.add_attrib_data(key,&[&t.0[0], &t.0[1], &t.0[2]]);
    pdata.add_attrib_data(key,&[&t.1[0], &t.1[1], &t.1[2]]);
}

pub fn multi_gl(pdata: &mut GLProgramData, key: &str, d: &GLData, mul: u8) {
    let mut v = Vec::<&GLData>::new();
    v.extend(iter::repeat(d).take(mul as usize));
    pdata.add_attrib_data(key,&v.as_slice());
}
