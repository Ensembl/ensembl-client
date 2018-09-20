use std::sync::{ Arc, Mutex };
use std::clone::Clone;
use canvasutil;
use composit::{ StateFixed, Component, StateValue, StateAtom };

use debug::testcards::common::{ daft, bio_daft, wiggly };

use shape::{
    fix_rectangle, fix_texture,
    page_texture,  pin_triangle, pin_texture,  pin_mathsshape,
    stretch_rectangle, stretch_texture, stretch_wiggle,
    Spot, ColourSpec, MathsShape,
};

use drawing::{
    mark_rectangle,
};

use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use std::rc::Rc;

use controller::Global;

use types::{ Colour, cleaf, cpixel, area_size, area, cedge,
             TOPLEFT, TOPRIGHT };

use drawing::{ text_texture, bitmap_texture, collage, Mark };

use rand::distributions::Distribution;
use rand::distributions::range::Range;

use controller::Event;

struct Palette {
    white: Spot
}

fn draw_frame(g: &Global, p: &Palette) -> Component {
    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
    c.add_shape(fix_rectangle(&area(cedge(TOPLEFT,cpixel(0,0)),
                                    cedge(TOPRIGHT,cpixel(0,10))),
                        &ColourSpec::Spot(p.white.clone())));
    c
}

pub fn testcard_polar(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();
    let seed = 12345678;
    let s = seed as u8;
    let t = (seed/256) as u8;
    let mut rng = SmallRng::from_seed([s,s,s,s,s,s,s,s,t,t,t,t,t,t,t,t]);

    let p = g.with_compo(|c| Palette {
        white: Spot::new(c,&Colour(255,255,25))
    }).unwrap();


    let frame = draw_frame(&g,&p);
    g.with_compo(|co| {
        co.add_component(frame);
    });

    let size = g.canvas_size();

    
    
    
    let mut c_odd = Component::new(Rc::new(StateAtom::new("odd")));
    let mut c_even = Component::new(Rc::new(StateAtom::new("even")));

    let (red_spot, green_spot) = g.with_compo(|c| {
        (Spot::new(c,&Colour(255,100,50)),
         Spot::new(c,&Colour(50,255,150)))
    }).unwrap();
        
    let fc_font = canvasutil::FCFont::new(12,"Lato");

    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));

    let mut middle = size.1 / 120;
    if middle < 5 { middle = 5; }
    
    
    let red = ColourSpec::Spot(red_spot.clone());
    let green = ColourSpec::Spot(green_spot.clone());
    
    let len_gen = Range::new(0.,0.2);
    let thick_gen = Range::new(0,13);
    let showtext_gen = Range::new(0,10);
    let (sw,sh);
    {
        sw = size.0;
        sh = size.1;
    }
    let col = Colour(200,200,200);
    for yidx in 0..20 {
        let y = yidx * 60;
        let val = daft(&mut rng);
        let tx = text_texture(&val,&fc_font,&col);
        //c.add_shape(page_texture(tx, &cpixel(4,y+18), &cpixel(1,1)));
        if yidx == middle - 5 {
            for i in 1..10 {
                c_odd.add_shape(pin_mathsshape(&cleaf(-100.+40.*(i as f32),y+20),
                               10. * i as f32,None,MathsShape::Circle,
                               &green));
                let colour = Colour(255,0,128);
                c_even.add_shape(pin_mathsshape(&cleaf(-300.+40.*(i as f32),y+20),
                               10. * i as f32,Some(2.),MathsShape::Circle,
                               &ColourSpec::Colour(colour)));
            }
        }
        if yidx == middle {
            for i in 3..8 {
                c_odd.add_shape(pin_mathsshape( &cleaf(-100.+40.*(i as f32),y+20),
                               10., None, MathsShape::Polygon(i,0.2*i as f32),
                               &red));
                let colour = Colour(0,128,255);
                c_even.add_shape(pin_mathsshape(&cleaf(-300.+40.*(i as f32),y+20),
                               10., None, MathsShape::Polygon(i,0.2*i as f32),
                               &ColourSpec::Colour(colour)));
            }
        }
        if yidx == middle +1 {
            for i in 3..8 {
                let cs = if i % 2 == 1 { &mut c_odd } else { &mut c_even };
                cs.add_shape(pin_mathsshape(&cleaf(-100.+40.*(i as f32),y+20),
                               10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                               &red));
                let colour = Colour(0,128,255);
                cs.add_shape(pin_mathsshape(&cleaf(-300.+40.*(i as f32),y+20),
                               10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                               &ColourSpec::Colour(colour)));
            }
        }
        if yidx == middle {
            let tx = bitmap_texture(
                                vec! { 0,0,255,255,
                                         255,0,0,255,
                                         0,255,0,255,
                                         255,255,0,255 },cpixel(4,1));
            c.add_shape(stretch_texture(tx,&area_size(cleaf(-500.,y-5),cleaf(1000.,10))));
            let tx = bitmap_texture(
                                vec! { 0,0,255,255,
                                         255,0,0,255,
                                         0,255,0,255,
                                         255,255,0,255 },cpixel(2,2));
            c.add_shape(pin_texture(tx,&cleaf(0.,y-25),&cpixel(10,10)));
            c_odd.add_shape(stretch_rectangle(&area_size(cleaf(-200.,y-20),cleaf(100.,5)),&red));
            c_even.add_shape(stretch_rectangle(&area_size(cleaf(-200.,y-15),cleaf(100.,5)),&green));
            c_odd.add_shape(pin_triangle(&cleaf(-200.,y-15),&[cpixel(0,0),
                                     cpixel(-5,10),
                                     cpixel(5,10)],
                                     &red));
            c_even.add_shape(pin_triangle(&cleaf(-100.,y-15),&[cpixel(0,0),
                                     cpixel(-5,10),
                                     cpixel(5,10)],
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
                        &area_size(cpixel(off,row*5),cpixel(size,4)),
                        &Colour(255,200,100)));
                    if rng.gen_range(0,2) == 1 {
                        parts.push(mark_rectangle(
                            &area_size(cpixel(off,row*5),cpixel(1,4)),
                            &Colour(200,0,0)));
                    }
                    if rng.gen_range(0,2) == 1 {
                        parts.push(mark_rectangle(
                            &area_size(cpixel(off+size-1,row*5),cpixel(1,4)),
                            &Colour(0,0,200)));
                    }
                    off += size;
                }
            }
            let tx = collage(parts,cpixel(1000,40));
            c.add_shape(stretch_texture(tx,&area_size(cleaf(-700.,y-25),cleaf(2000.,40))));
        } else if yidx == middle+2 || yidx == middle+4 {
            let wiggle = wiggly(&mut rng,500,cleaf(-500.,y-5),2.,20);
            c_odd.add_shape(stretch_wiggle(wiggle,2,&green_spot));
        } else {
            for idx in -100..100 {
                let v1 = (idx as f32) * 0.1;
                let v2 = (idx as f32)+10.0*(yidx as f32) * 0.1;
                let dx = len_gen.sample(&mut rng) * 100.;
                let x = v1 * 100. + (yidx as f32).cos() * 100.;
                let colour = Colour(
                    (128.*v2.cos()+128.) as u32,
                    (128.*v2.sin()+128.) as u32,
                    (128.*(v2+1.0).sin()+128.) as u32,
                );
                let h = if thick_gen.sample(&mut rng) == 0 { 1 } else { 5 };
                c.add_shape(stretch_rectangle(&area_size(cleaf(x,y-h),cleaf(dx,2*h)),
                                &ColourSpec::Colour(colour)));
                if idx %5 == 0 {
                    let colour = Colour(colour.2,colour.0,colour.1);
                    c.add_shape(pin_triangle(&cleaf(x,y),
                                   &[cpixel(0,0),
                                     cpixel(-5,10),
                                     cpixel(5,10)],
                                   &ColourSpec::Colour(colour)));
                }
                if showtext_gen.sample(&mut rng) == 0 {
                    let val = bio_daft(&mut rng);
                    let tx = text_texture(&val,&fc_font,&col);
                    c.add_shape(pin_texture(tx, &cleaf(x,y-24), &cpixel(1,1)));
                }
            }
        }
    }
    
    //c.add_shape(fix_rectangle(&rpixel(cpixel(sw/2,0),cpixel(1,sh)),
    //                    &ColourSpec::Colour(Colour(0,0,0))));
    //c.add_shape(fix_rectangle(&rpixel(cpixel(sw/2+5,0),cpixel(3,sh)),
    //                    &red));
    let tx = bitmap_texture(vec! { 0,0,255,255,
                                 255,0,0,255,
                                 0,255,0,255,
                                 255,255,0,255 },cpixel(1,4));
    //c.add_shape(fix_texture(tx, &cpixel(sw/2-5,0),&cpixel(1,sh)));
    g.with_compo(|co| {
        co.add_component(c);
        co.add_component(c_odd);
        co.add_component(c_even);
    });
    g.add_events(vec!{ Event::Zoom(2.5) });
}
