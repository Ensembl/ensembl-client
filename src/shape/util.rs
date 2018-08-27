use std::iter;
use program::{ ProgramAttribs, DataBatch };
use coord::{ CPixel, CFraction, CLeaf, Input };

pub fn triangle_gl(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[&Input;3]) {
    let obj = pdata.get_object(key);
    obj.add_data(&b,&[p[0], p[1], p[2]]);
}

pub fn rectangle_g(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[CLeaf;2]) {
    let v = &p[0].rectangle(p[1]);
    let obj = pdata.get_object(key);
    obj.add_data(&b,&[&v[0], &v[1], &v[2], &v[3]]);
}

pub fn rectangle_p(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[CPixel;2]) {
    let v = &p[0].rectangle(p[1]);
    let obj = pdata.get_object(key);
    obj.add_data(&b,&[&v[0], &v[1], &v[2], &v[3]]);
}

pub fn rectangle_t(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, p: &[CFraction;2]) {
    let v = &p[0].rectangle(p[1]);
    let obj = pdata.get_object(key);
    obj.add_data(&b,&[&v[0], &v[1], &v[2], &v[3]]);
}

pub fn multi_gl(b: DataBatch, pdata: &mut ProgramAttribs, key: &str, d: &Input, mul: u8) {
    let mut v = Vec::<&Input>::new();
    v.extend(iter::repeat(d).take(mul as usize));
    let obj = pdata.get_object(key);
    obj.add_data(&b,&v.as_slice());
}

pub fn vertices_rect(pdata: &mut ProgramAttribs) -> DataBatch {
    pdata.add_vertices(&[0,3,1,2,1,3],4)
}

pub fn vertices_tri(pdata: &mut ProgramAttribs) -> DataBatch {
    pdata.add_vertices(&[0,1,2],3)
}
