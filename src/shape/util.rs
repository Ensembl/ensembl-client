use std::iter;
use program::ProgramAttribs;
use coord::{ CPixel, CFraction, CLeaf, Input };

pub fn triangle_gl(pdata: &mut ProgramAttribs, key: &str, p: &[&Input;3]) {
    pdata.add_attrib_data(key,&[p[0], p[1], p[2]]);
}

pub fn rectangle_g(pdata: &mut ProgramAttribs, key: &str, p: &[CLeaf;2]) {
    let t = &p[0].triangles(p[1]);
    pdata.add_attrib_data(key,&[&t.0[0], &t.0[1], &t.0[2]]);
    pdata.add_attrib_data(key,&[&t.1[0], &t.1[1], &t.1[2]]);
}

pub fn rectangle_p(pdata: &mut ProgramAttribs, key: &str, p: &[CPixel;2]) {
    let t = &p[0].triangles(p[1]);
    pdata.add_attrib_data(key,&[&t.0[0], &t.0[1], &t.0[2]]);
    pdata.add_attrib_data(key,&[&t.1[0], &t.1[1], &t.1[2]]);
}

pub fn rectangle_t(pdata: &mut ProgramAttribs, key: &str, p: &[CFraction;2]) {
    let t = &p[0].triangles(p[1]);
    pdata.add_attrib_data(key,&[&t.0[0], &t.0[1], &t.0[2]]);
    pdata.add_attrib_data(key,&[&t.1[0], &t.1[1], &t.1[2]]);
}

pub fn multi_gl(pdata: &mut ProgramAttribs, key: &str, d: &Input, mul: u8) {
    let mut v = Vec::<&Input>::new();
    v.extend(iter::repeat(d).take(mul as usize));
    pdata.add_attrib_data(key,&v.as_slice());
}
