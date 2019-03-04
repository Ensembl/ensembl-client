use composit::Source;
use debug::support::closuresource::{ ClosureSource, closure_add, closure_add_opt, closure_done };
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, Facade, PinRectTypeSpec, TextureTypeSpec, TypeToShape, ShapeInstanceData, ShapeShortInstanceData };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT };

pub fn text_source() -> impl Source {
    let font = FCFont::new(120,"Lato",FontVariety::Normal);
    ClosureSource::new(0.,move |lc,leaf| {
        let tx = text_texture("hello",&font,&Colour(199,208,213),&Colour(0,0,0));

        let prts = PinRectTypeSpec {
            sea_x: None,
            sea_y: Some((AxisSense::Max,AxisSense::Max)),
            ship_x: (Some(AxisSense::Min),-50),
            ship_y: (Some(AxisSense::Min),0),
            under: None,
            spot: true
        };
        closure_add_opt(lc,&prts.new_short_shape(&ShapeShortInstanceData {
            pos_x: 0.,
            pos_y: 0,
            aux_x: 400.,
            aux_y: 400,
            facade: Facade::Colour(Colour(150,0,0))
        }));
        
        let tts = TextureTypeSpec {
            sea_x: None,
            sea_y: Some(AxisSense::Max),
            ship_x: (Some(AxisSense::Max),0),
            ship_y: (Some(AxisSense::Max),0),
            scale_x: 1., scale_y: 1.,
            under: None,
        };
        closure_add_opt(lc,&tts.new_short_shape(&ShapeShortInstanceData {
            pos_x: 0.,
            pos_y: 100,
            aux_x: 0.,
            aux_y: 0,
            facade: Facade::Drawing(tx)
        }));
        closure_done(lc,200);
    })
}
