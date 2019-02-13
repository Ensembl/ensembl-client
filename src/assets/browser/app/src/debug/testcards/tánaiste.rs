use composit::Source;
use debug::testcards::common::prop;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, tape_rectangle, tape_texture, stretch_rectangle };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT };

pub fn tá_source() -> impl Source {
    ClosureSource::new(0.,move |lc,leaf| {
        let prop_start = prop(leaf,10000);
        let prop_end = prop(leaf,20000);

        if prop_end > 0. && prop_start < 1. {
            closure_add(lc,&stretch_rectangle(
                &area_size(cleaf(prop_start,1),cleaf(prop_end,400)),
                &ColourSpec::Colour(Colour(255,120,0))));
        }
        closure_done(lc,200);
    })
}
