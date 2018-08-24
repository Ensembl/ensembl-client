use std::iter;
use arena::ArenaData;
use program::ProgramAttribs;
use coord::{ CPixel, CFraction, CLeaf, Input };

pub fn triangle_gl(pdata: &mut ProgramAttribs, key: &str, p: &[&Input;3]) {
    pdata.add_attrib_data(key,&[p[0], p[1], p[2]]);
}

pub fn rectangle_g(pdata: &mut ProgramAttribs, key: &str, p: &[CLeaf;2]) {
    let v = &p[0].rectangle(p[1]);
    pdata.add_attrib_data(key,&[&v[0], &v[1], &v[2], &v[3]]);
}

pub fn rectangle_p(pdata: &mut ProgramAttribs, key: &str, p: &[CPixel;2]) {
    let v = &p[0].rectangle(p[1]);
    pdata.add_attrib_data(key,&[&v[0], &v[1], &v[2], &v[3]]);
}

pub fn rectangle_t(pdata: &mut ProgramAttribs, key: &str, p: &[CFraction;2]) {
    let v = &p[0].rectangle(p[1]);
    pdata.add_attrib_data(key,&[&v[0], &v[1], &v[2], &v[3]]);
}

pub fn multi_gl(pdata: &mut ProgramAttribs, key: &str, d: &Input, mul: u8) {
    let mut v = Vec::<&Input>::new();
    v.extend(iter::repeat(d).take(mul as usize));
    pdata.add_attrib_data(key,&v.as_slice());
}

pub fn vertices_rect(adata: &ArenaData, pdata: &mut ProgramAttribs) {
    pdata.add_vertices(adata,&[0,3,1,2,1,3],4);
}

pub fn vertices_tri(adata: &ArenaData, pdata: &mut ProgramAttribs) {
    pdata.add_vertices(adata,&[0,1,2],3);
}
