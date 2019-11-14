use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element, INode, IElement };

use super::{ GLProgs, GLCarriage, GLTraveller };
use model::driver::{ DriverTraveller, Printer };
use model::stage::Screen;
use composit::Compositor;
use model::train::{ CarriageId, Train, TravellerId };
use super::super::drawing::{ AllCanvasAllocator };
use dom::domutil;
use types::{ Dot };

use dom::webgl::WebGLRenderingContext as glctx;
use stdweb::web::html_element::{
    CanvasElement
};

pub struct WebGLTrainPrinter{}

impl WebGLTrainPrinter {
    pub fn new() -> WebGLTrainPrinter {
        WebGLTrainPrinter {}
    }
    
    fn execute(&mut self, printer: &mut GLPrinterBase, carriage_ids: &Vec<CarriageId>) {
        for pt in &printer.base_progs.order {
            for carriage_id in carriage_ids.iter() {
                if let Some(ref mut carriage) = printer.carriages.get_mut(carriage_id) {
                    carriage.execute(&pt);
                }
            }
        }
    }
    
    fn contextualize(&mut self, printer: &mut GLPrinterBase, screen: &Screen,
                     train: &mut Train, opacity: f32) {
        for carriage_id in train.get_carriage_ids() {
            if let Some(ref mut carriage) = printer.carriages.get_mut(carriage_id) {
                carriage.set_context(screen,train.get_position(),opacity);
            }
        }
    }
}

pub struct GLPrinterBase {
    canv_el: HtmlElement,
    ctx: Rc<glctx>,
    base_progs: GLProgs,
    acm: AllCanvasAllocator,
    carriages: HashMap<CarriageId,GLCarriage>,
    new_size: Option<Dot<f64,f64>>,
    settled_size: Option<Dot<f64,f64>>,
    round_size: bool,
}

impl GLPrinterBase {
    pub fn new(canv_el: &HtmlElement) -> GLPrinterBase {
        let canvas = canv_el.clone().try_into().unwrap();
        let ctx: glctx = domutil::get_context(&canvas);
        ctx.clear_color(1.0,1.0,1.0,1.0);
        ctx.clear(glctx::COLOR_BUFFER_BIT  | glctx::DEPTH_BUFFER_BIT);
        let ctx_rc = Rc::new(ctx);
        let progs = GLProgs::new(&ctx_rc);
        let acm = AllCanvasAllocator::new(".bpane-container .managedcanvasholder");
        GLPrinterBase {
            canv_el: canv_el.clone(),
            acm, ctx: ctx_rc,
            base_progs: progs,
            carriages: HashMap::new(),
            new_size: None,
            settled_size: None,
            round_size: true,
        }
    }

    pub fn redraw_carriage(&mut self, carriage_id: &CarriageId) {
        if let Some(carriage) = &mut self.carriages.get_mut(&carriage_id) {
            carriage.redraw(&mut self.acm);
        }
    }

    pub fn add_carriage(&mut self, carriage_id: &CarriageId) {
        let leaf = carriage_id.get_leaf();
        let gcp = GLCarriage::new(&leaf,&self.base_progs,&self.ctx);
        self.carriages.insert(carriage_id.clone(),gcp);
    }
    
    pub fn remove_carriage(&mut self, carriage_id: &CarriageId) {
        if let Some(mut carriage) = self.carriages.remove(carriage_id) {
            carriage.destroy(&mut self.acm);
        }
    }
    
    fn prepare_all(&mut self) {
        if let Some(new_size) = self.new_size.take() {
            self.set_size(new_size);
        }
        self.ctx.enable(glctx::DEPTH_TEST);
        self.ctx.enable(glctx::BLEND);
        self.ctx.blend_func_separate(
            glctx::SRC_ALPHA,
            glctx::ONE_MINUS_SRC_ALPHA,
            glctx::ONE,
            glctx::ONE_MINUS_SRC_ALPHA);        
        self.ctx.depth_mask(false);
        self.ctx.clear(glctx::COLOR_BUFFER_BIT | glctx::DEPTH_BUFFER_BIT);
    }
    
    fn set_size(&mut self, s: Dot<f64,f64>) {
        /* Rendering can go fuzzy if available size not multiple of 4 */
        let vp_sz = Dot(s.0.round() as i32,s.1.round() as i32);
        let mut css = "width: 100%; height: 100%".to_string();
        if self.round_size {
            css = format!("width: {}px; height: {}px",vp_sz.0,vp_sz.1);
        }
        self.round_size = false;
        let elel: Element =  self.canv_el.clone().into();
        let elc : CanvasElement = elel.clone().try_into().unwrap();
        elc.set_width(vp_sz.0 as u32);
        elc.set_height(vp_sz.1 as u32);
        self.ctx.viewport(0,0,vp_sz.0 as i32,vp_sz.1 as i32);
        elel.set_attribute("style",&css).ok();
    }
    
    fn get_available_size(&self) -> Dot<f64,f64> {
        let ws = domutil::window_space(&self.canv_el.parent_node().unwrap().try_into().unwrap());
        let mut size = domutil::size(&self.canv_el.parent_node().unwrap().try_into().unwrap());
        // TODO left/top/right
        let rb = ws.far_offset();
        if rb.1 < 0. {
            // off the bottom, fix
            size.1 += rb.1
        }
        size
    }

    fn settle(&mut self) {
        self.round_size = true;
        self.set_size(self.get_available_size());
    }

    fn destroy(&mut self) {
        for carriage in self.carriages.values_mut() {
            carriage.destroy(&mut self.acm);
        }
        self.acm.finish();
        let gl : Option<glctx> = ok!(
            js! { return @{self.canv_el.as_ref()}.getContext("webgl"); }.try_into()
        );
        if let Some(gl) = gl {
            js! {
                var x = @{gl.as_ref()}.getExtension("WEBGL_lose_context");
                if(x) x.loseContext();
            }
        }
    }    

    fn make_driver_traveller(&mut self, pref: &GLPrinter, traveller_id: &TravellerId) -> Box<dyn DriverTraveller> {
        let sr = GLTraveller::new(pref,traveller_id);
        if let Some(carriage) = self.carriages.get_mut(&traveller_id.get_carriage_id()) {
            carriage.new_sr(&sr);
        }
        Box::new(sr)
    }    
}

#[derive(Clone)]
pub struct GLPrinter {
    base: Rc<RefCell<GLPrinterBase>>
}

impl GLPrinter {
    pub fn new(canv_el: &HtmlElement) -> GLPrinter {
        GLPrinter {
            base: Rc::new(RefCell::new(GLPrinterBase::new(canv_el)))
        }
    }    
}

impl Printer for GLPrinter {
    fn print(&mut self, screen: &Screen, compo: &mut Compositor) {
        compo.redraw_where_needed(self);
        let prop_up = compo.get_prop_trans_up();
        let prop_down = compo.get_prop_trans_down();
        compo.with_current_train(|train| {
            let mut tp = WebGLTrainPrinter::new();
            tp.contextualize(&mut self.base.borrow_mut(),screen,train,prop_down);
        });
        compo.with_transition_train(|train| {
            let mut tp = WebGLTrainPrinter::new();
            tp.contextualize(&mut self.base.borrow_mut(),screen,train,prop_up);
        });
        self.base.borrow_mut().prepare_all();
        compo.with_current_train(|train| {
            let mut tp = WebGLTrainPrinter::new();
            tp.execute(&mut self.base.borrow_mut(),&train.get_carriage_ids().cloned().collect());
        });
        compo.with_transition_train(|train| {
            let mut tp = WebGLTrainPrinter::new();
            tp.execute(&mut self.base.borrow_mut(),&train.get_carriage_ids().cloned().collect());
        });
    }

    fn destroy(&mut self) {
        self.base.borrow_mut().destroy();
    }

    fn redraw_carriage(&mut self, carriage_id: &CarriageId) {
        self.base.borrow_mut().redraw_carriage(carriage_id);
    }

    fn set_size(&mut self, s: Dot<f64,f64>) {
        self.base.borrow_mut().new_size = Some(s);
        self.base.borrow_mut().settled_size = Some(s);
    }
    
    fn settle(&mut self) {
        self.base.borrow_mut().settle();
    }
    
    fn get_available_size(&self) -> Dot<f64,f64> {
        self.base.borrow().get_available_size()
    }

    fn add_carriage(&mut self, carriage_id: &CarriageId) {
        self.base.borrow_mut().add_carriage(carriage_id);
    }
    
    fn remove_carriage(&mut self, carriage_id: &CarriageId) {
        self.base.borrow_mut().remove_carriage(carriage_id);
    }
        
    fn make_driver_traveller(&mut self, traveller_id: &TravellerId) -> Box<dyn DriverTraveller> {
        let twin = self.clone();
        self.base.borrow_mut().make_driver_traveller(&twin,traveller_id)
    }      
}
