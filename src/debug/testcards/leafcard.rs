use debug::testcards::rulergenerator::RulerGenerator;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use composit::Source;
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, pin_texture, stretch_rectangle, pin_rectangle };
use types::{ Colour, cleaf, cpixel, A_TOP, area, area_size };

const TARGET: i32 = 10;
const TICK_TARGET: i32 = 50;
const MARK_TARGET: i32 = 200;

pub fn leafcard_source(leaf_marks: bool) -> impl Source {
    let font = FCFont::new(16,"Lato",FontVariety::Normal);
    ClosureSource::new(0.2,move |lc,leaf| {
        let rg = RulerGenerator::new_leaf(leaf);
        let ruler = rg.ruler(MARK_TARGET,TICK_TARGET,TARGET,&[10,15,20,30]);
        for (offset,height,text) in ruler {
            if let Some(text) = text {
                let tx = text_texture(&text,&font,&Colour(199,208,213),&Colour(255,255,255));
                closure_add(lc,&pin_texture(tx,&cleaf(offset as f32,1),
                            &cpixel(0,40),&cpixel(1,1).anchor(A_TOP)));
            }
            closure_add(lc,&pin_rectangle(&cleaf(offset as f32,10),
                                          &area_size(cpixel(0,0),cpixel(1,height)),
                                          &ColourSpec::Colour(Colour(199,208,213))));
        }
        let i = leaf.get_index();
        let (colour,_) = if i % 2 == 0 {
            (ColourSpec::Colour(Colour(255,0,0)),0)
        } else {
            (ColourSpec::Colour(Colour(0,255,0)),10)
        };
        if leaf_marks {
            closure_add(lc,&stretch_rectangle(&area(
                            cleaf(0.,70),
                            cleaf(1.,80),
                         ),&colour));
            closure_done(lc,80);
        } else {
            closure_done(lc,60);
        }
    })  
}
