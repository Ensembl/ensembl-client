use debug::testcards::rulergenerator::RulerGenerator;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use composit::Source;
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, pin_texture, PinRectTypeSpec, RectData, StretchRectTypeSpec };
use types::{ Colour, cleaf, cpixel, A_TOP, area, area_size, AxisSense };

const TARGET: i32 = 10;
const TICK_TARGET: i32 = 50;
const MARK_TARGET: i32 = 200;

pub fn leafcard_source(leaf_marks: bool) -> impl Source {
    let font = FCFont::new(16,"Lato",FontVariety::Normal);
    ClosureSource::new(0.2,move |lc,leaf| {
        let rg = RulerGenerator::new_leaf(leaf);
        let ruler = rg.ruler(MARK_TARGET,TICK_TARGET,TARGET,&[10,15,20,30]);
        
        let prts = PinRectTypeSpec {
            sea_x: None,
            sea_y: None,
            ship_x: (Some(AxisSense::Min),0),
            ship_y: (Some(AxisSense::Min),0),
            under: None,
            spot: false
        };
        
        for (offset,height,text) in ruler {
            if let Some(text) = text {
                let tx = text_texture(&text,&font,&Colour(199,208,213),&Colour(255,255,255));
                closure_add(lc,&pin_texture(tx,&cleaf(offset as f32,1),
                            &cpixel(0,40),&cpixel(1,1).anchor(A_TOP)));
            }
            closure_add(lc,&prts.new_shape(&RectData {
                pos_x: offset,
                pos_y: 10,
                aux_x: 1.,
                aux_y: height,
                colour: Colour(199,208,213)
            }));
        }
        let i = leaf.get_index();
        let (colour,_) = if i % 2 == 0 {
            (Colour(255,0,0),0)
        } else {
            (Colour(0,255,0),10)
        };
        if leaf_marks {
            let srts = StretchRectTypeSpec { spot: false };
            closure_add(lc,&srts.new_shape(&RectData {
                pos_x: 0.,
                pos_y: 70,
                aux_x: 1.,
                aux_y: 10,
                colour
            }));
            closure_done(lc,80);
        } else {
            closure_done(lc,60);
        }
    })  
}
