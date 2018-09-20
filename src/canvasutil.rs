use stdweb::web::{
    IHtmlElement,
    INode,
    TextBaseline,
    CanvasRenderingContext2d,
    document,
    Element
};

use stdweb::web::html_element::{
    CanvasElement
};

use stdweb::web::TypedArray;
use stdweb::unstable::TryInto;
use types::{
    Colour, CPixel, RPixel, cpixel, Dot
};

use dom::domutil;

// Prepare a canvas ready for WebGL
pub fn prepare_canvas(canvasel: &Element) -> CanvasElement {
    // get canvas
    let canvas: CanvasElement = canvasel.clone().try_into().unwrap();

    // force CSS onto attributes of canvas tag
    let width = canvas.offset_width() as u32;
    let height = canvas.offset_height() as u32;
    let width = width - width % 2;
    let height = height - height % 2;
    canvas.set_width(width);
    canvas.set_height(height);
    // update CSS in px, as %'s are dodgy on canvas tags
    domutil::add_style(&canvasel,"width",&format!("{}px",width));
    domutil::add_style(&canvasel,"height",&format!("{}px",height));
    //window().add_event_listener(enclose!( (canvas) move |_:ResizeEvent| {
    //    canvas.set_width(canvas.offset_width() as u32);
    //    canvas.set_height(canvas.offset_height() as u32);
    //}));
    canvas
}

#[derive(Clone,Eq,PartialEq,Hash)]
pub struct FCFont {
    spec: String,
    height: i32,
    xpad: i32,
    ypadtop: i32,
    ypadbot: i32
}

impl FCFont {
    pub fn new(size : i32,family: &str) -> FCFont {
        FCFont { spec: format!("{}px {}",size,family),
                 height: size, ypadtop: 0, ypadbot: 5, xpad: 0 }
    }
    
    fn setup(&self, canvas : &CanvasRenderingContext2d) {
        canvas.set_font(&self.spec);
    }
}

pub struct FlatCanvas {
    canvas: CanvasElement,
    context : CanvasRenderingContext2d,
    width: i32,
    height: i32,
}

impl FlatCanvas {        
    pub fn reset() {
        let ch = domutil::query_select("#managedcanvasholder");
        domutil::inner_html(&ch,"");        
    }
        
    pub fn create(width: i32,height: i32) -> FlatCanvas {
        let canvas_holder = domutil::query_select("#managedcanvasholder");
        let canvas : CanvasElement = document().create_element("canvas").ok().unwrap().try_into().unwrap();
        canvas_holder.append_child(&canvas);
        canvas.set_width(width as u32);
        canvas.set_height(height as u32);
        let context : CanvasRenderingContext2d = canvas.get_context().unwrap();
        context.set_fill_style_color("white");
        context.fill_rect(0.,0.,width as f64,height as f64);
        context.set_fill_style_color("black");
        FlatCanvas { canvas, context, height, width }
    }
    
    pub fn text(&self,text : &str, pos: CPixel, font: &FCFont, col: &Colour) -> (i32,i32) {
        font.setup(&self.context);
        self.context.set_text_baseline(TextBaseline::Top);
        self.context.set_fill_style_color(&col.to_css()[..]);
        self.context.set_stroke_style_color(&col.to_css()[..]);
        self.context.fill_text(text,(pos.0+font.xpad).into(),(pos.1+font.ypadtop).into(),None);
        let m = self.context.measure_text(text);
        let width_px = m.unwrap().get_width().ceil() as i32;
        let height_px = font.height;
        (width_px+2*font.xpad,height_px+font.ypadtop+font.ypadbot)
    }
    
    pub fn bitmap(&self, data: &Vec<u8>, coords: RPixel) {
        let pixels: TypedArray<u8> = data[..].into();
        let Dot(x,y) = coords.offset();
        let Dot(w,h) = coords.area();
        js! {
            var id = @{&self.context}.createImageData(@{w},@{h});
            id.data.set(@{pixels});
            @{&self.context}.putImageData(id,@{x},@{y});
        };
    }
    
    pub fn rectangle(&self, coords: RPixel, col: &Colour) {
        let Dot(x,y) = coords.offset();
        let Dot(w,h) = coords.area();
        self.context.set_fill_style_color(&col.to_css()[..]);
        self.context.fill_rect(x as f64,y as f64,w as f64,h as f64);
    }

    pub fn measure(&self,text : &str, font: &FCFont) -> CPixel {
        font.setup(&self.context);
        let m = self.context.measure_text(text);
        let width_px = m.unwrap().get_width().ceil() as i32;
        let height_px = font.height;
        cpixel(width_px+2*font.xpad,height_px+font.ypadtop+font.ypadbot)
    }
    
    pub fn element(&self) -> &CanvasElement {
        &self.canvas
    }
    
    pub fn size(&self) -> CPixel {
        cpixel(self.width,self.height)
    }    
}
