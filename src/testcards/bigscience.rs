use std::clone::Clone;
use canvasutil;
use campaign::{ StateManager, StateFixed, Campaign, StateValue };

use testcards::common::{ daft, bio_daft, wiggly };

use shape::{
    fix_rectangle,
    fix_texture,
    page_texture,
    pin_triangle,
    pin_texture,
    pin_mathsshape,
    stretch_rectangle,
    stretch_texture,
    stretch_wiggle,
    Spot,
    ColourSpec,
    MathsShape,
};

use drawing::{
    mark_rectangle,
};

use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use std::rc::Rc;

use arena::{
    Arena,
    ArenaSpec,
    Stage,
};

use coord::{
    CLeaf,
    RLeaf,
    CPixel,
    RPixel,
    Colour,
};

use drawing::{ text_texture, bitmap_texture, collage, Mark };

use rand::distributions::Distribution;
use rand::distributions::range::Range;

pub fn big_science(oom: &StateManager, stage: &mut Stage, onoff: bool) -> Arena {
    let seed = 12345678;
    let s = seed as u8;
    let t = (seed/256) as u8;
    let mut rng = SmallRng::from_seed([s,s,s,s,s,s,s,s,t,t,t,t,t,t,t,t]);
    let fc_font = canvasutil::FCFont::new(12,"Roboto");

    let (mut c_odd,mut c_even) = if onoff {
        (
            Campaign::new(Rc::new(oom.get_atom("odd"))),
            Campaign::new(Rc::new(oom.get_atom("even"))),
        )
    } else {
        (
            Campaign::new(Rc::new(StateFixed(StateValue::On()))),
            Campaign::new(Rc::new(StateFixed(StateValue::On())))
        )
    };

    let mut c = Campaign::new(Rc::new(StateFixed(StateValue::On())));
    stage.zoom = 0.1;

    let mut a_spec = ArenaSpec::new();
    a_spec.debug = true;
    let mut arena = Arena::new("#glcanvas",a_spec);
    let mut middle = arena.dims().height_px / 120;
    if middle < 5 { middle = 5; }
    
    let red_spot = Spot::new(arena.get_cman(),&Colour(255,100,50));
    let red = ColourSpec::Spot(red_spot.clone());
    let green_spot = Spot::new(arena.get_cman(),&Colour(50,255,150));
    let green = ColourSpec::Spot(green_spot.clone());
    
    let len_gen = Range::new(0.,0.2);
    let thick_gen = Range::new(0,13);
    let showtext_gen = Range::new(0,10);
    let (sw,sh);
    {
        let a = &mut arena;
        
        let dims = a.dims();
        sw = dims.width_px;
        sh = dims.height_px;
    }
    {
        let col = Colour(200,200,200);
        {
        for yidx in 0..20 {
            let y = yidx * 60;
            let val = daft(&mut rng);
            let tx = text_texture(&val,&fc_font,&col);
            c.add_shape(page_texture(tx, &CPixel(4,y+18), &CPixel(1,1)));
            if yidx == middle - 5 {
                for i in 1..10 {
                    c_odd.add_shape(pin_mathsshape(&CLeaf(-1.+0.4*(i as f32),y+20),
                                   10. * i as f32,None,MathsShape::Circle,
                                   &green));
                    let colour = Colour(255,0,128);
                    c_even.add_shape(pin_mathsshape(&CLeaf(-3.+0.4*(i as f32),y+20),
                                   10. * i as f32,Some(2.),MathsShape::Circle,
                                   &ColourSpec::Colour(colour)));
                }
            }
            if yidx == middle {
                for i in 3..8 {
                    c_odd.add_shape(pin_mathsshape( &CLeaf(-1.+0.4*(i as f32),y+20),
                                   10., None, MathsShape::Polygon(i,0.2*i as f32),
                                   &red));
                    let colour = Colour(0,128,255);
                    c_even.add_shape(pin_mathsshape(&CLeaf(-3.+0.4*(i as f32),y+20),
                                   10., None, MathsShape::Polygon(i,0.2*i as f32),
                                   &ColourSpec::Colour(colour)));
                }
            }
            if yidx == middle +1 {
                for i in 3..8 {
                    let cs = if i % 2 == 1 { &mut c_odd } else { &mut c_even };
                    cs.add_shape(pin_mathsshape(&CLeaf(-1.+0.4*(i as f32),y+20),
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &red));
                    let colour = Colour(0,128,255);
                    cs.add_shape(pin_mathsshape(&CLeaf(-3.+0.4*(i as f32),y+20),
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &ColourSpec::Colour(colour)));
                }
            }
            if yidx == middle {
                let tx = bitmap_texture(
                                    vec! { 0,0,255,255,
                                             255,0,0,255,
                                             0,255,0,255,
                                             255,255,0,255 },CPixel(4,1));
                c.add_shape(stretch_texture(tx,&RLeaf(CLeaf(-5.,y-5),CLeaf(10.,10))));
                let tx = bitmap_texture(
                                    vec! { 0,0,255,255,
                                             255,0,0,255,
                                             0,255,0,255,
                                             255,255,0,255 },CPixel(2,2));
                c.add_shape(pin_texture(tx,&CLeaf(0.,y-25),&CPixel(10,10)));
                c_odd.add_shape(stretch_rectangle(&RLeaf(CLeaf(-2.,y-20),CLeaf(1.,5)),&red));
                c_even.add_shape(stretch_rectangle(&RLeaf(CLeaf(-2.,y-15),CLeaf(1.,5)),&green));
                c_odd.add_shape(pin_triangle(&CLeaf(-2.,y-15),&[CPixel(0,0),
                                         CPixel(-5,10),
                                         CPixel(5,10)],
                                         &red));
                c_even.add_shape(pin_triangle(&CLeaf(-1.,y-15),&[CPixel(0,0),
                                         CPixel(-5,10),
                                         CPixel(5,10)],
                                         &green));
            } else if yidx == middle-2 {
                let mut parts = Vec::<Box<Mark>>::new();
                for row in 0..8 {
                    let mut off = 0;
                    for _pos in 0..100 {
                        let size = rng.gen_range(1,7);
                        let gap = rng.gen_range(1,5);
                        if off + gap + size > 1000 { continue }
                        off += gap;
                        parts.push(mark_rectangle(
                            &RPixel(CPixel(off,row*5),CPixel(size,4)),
                            &Colour(255,200,100)));
                        if rng.gen_range(0,2) == 1 {
                            parts.push(mark_rectangle(
                                &RPixel(CPixel(off,row*5),CPixel(1,4)),
                                &Colour(200,0,0)));
                        }
                        if rng.gen_range(0,2) == 1 {
                            parts.push(mark_rectangle(
                                &RPixel(CPixel(off+size-1,row*5),CPixel(1,4)),
                                &Colour(0,0,200)));
                        }
                        off += size;
                    }
                }
                let tx = collage(parts,CPixel(1000,40));
                c.add_shape(stretch_texture(tx,&RLeaf(CLeaf(-7.,y-25),CLeaf(20.,40))));
            } else if yidx == middle+2 || yidx == middle+4 {
                let wiggle = wiggly(&mut rng,500,CLeaf(-5.,y-5),0.02,20);
                c_odd.add_shape(stretch_wiggle(wiggle,2,&green_spot));
            } else {
                for idx in -100..100 {
                    let v1 = (idx as f32) * 0.1;
                    let v2 = (idx as f32)+10.0*(yidx as f32) * 0.1;
                    let dx = len_gen.sample(&mut rng);
                    let x = v1 * 1.0 + (yidx as f32).cos();
                    let colour = Colour(
                        (128.*v2.cos()+128.) as u32,
                        (128.*v2.sin()+128.) as u32,
                        (128.*(v2+1.0).sin()+128.) as u32,
                    );
                    let h = if thick_gen.sample(&mut rng) == 0 { 1 } else { 5 };
                    c.add_shape(stretch_rectangle(&RLeaf(CLeaf(x,y-h),CLeaf(dx,2*h)),
                                    &ColourSpec::Colour(colour)));
                    if idx %5 == 0 {
                        let colour = Colour(colour.2,colour.0,colour.1);
                        c.add_shape(pin_triangle(&CLeaf(x,y),
                                       &[CPixel(0,0),
                                         CPixel(-5,10),
                                         CPixel(5,10)],
                                       &ColourSpec::Colour(colour)));
                    }
                    if showtext_gen.sample(&mut rng) == 0 {
                        let val = bio_daft(&mut rng);
                        let tx = text_texture(&val,&fc_font,&col);
                        c.add_shape(pin_texture(tx, &CLeaf(x,y-24), &CPixel(1,1)));
                    }
                }
            }
        }
        
        c.add_shape(fix_rectangle(&RPixel(CPixel(sw/2,0),CPixel(1,sh)),
                            &ColourSpec::Colour(Colour(0,0,0))));
        c.add_shape(fix_rectangle(&RPixel(CPixel(sw/2+5,0),CPixel(3,sh)),
                            &red));
        let tx = bitmap_texture(vec! { 0,0,255,255,
                                     255,0,0,255,
                                     0,255,0,255,
                                     255,255,0,255 },CPixel(1,4));
        c.add_shape(fix_texture(tx, &CPixel(sw/2-5,0),&CPixel(1,sh)));
        }
        {
                let a = &mut arena;
        a.get_cman().add_campaign(c);
        a.get_cman().add_campaign(c_odd);
        a.get_cman().add_campaign(c_even);

        stage.zoom = 0.5;
    }
    }
    arena
}
