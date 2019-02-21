use composit::Source;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, tape_texture, PinRectTypeSpec, RectData };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT };

pub fn text_source() -> impl Source {
    let font = FCFont::new(120,"Lato",FontVariety::Normal);
    ClosureSource::new(0.,move |lc,_leaf| {
        let tx = text_texture("hello",&font,&Colour(199,208,213),&Colour(0,0,0));

        let prts = PinRectTypeSpec {
            sea_x: None,
            sea_y: Some((AxisSense::Max,AxisSense::Max)),
            ship_x: (Some(AxisSense::Min),-50),
            ship_y: (Some(AxisSense::Min),0),
            under: None,
            spot: true
        };
        closure_add(lc,&prts.new_shape(&RectData {
            pos_x: 0.,
            pos_y: 0,
            aux_x: 400.,
            aux_y: 400,
            colour: Colour(150,0,0)

        }));
        closure_add(lc,&tape_texture(tx,&cleaf(0.,100).y_edge(AxisSense::Max),
                    &cpixel(0,0),&cpixel(1,1).anchor(A_TOPLEFT)));
        closure_done(lc,200);
    })
}
