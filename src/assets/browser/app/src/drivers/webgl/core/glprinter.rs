use std::cell::RefCell;
use hashbrown::HashMap;
use std::rc::Rc;

use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element, INode, IElement };

use super::{ GLProgs, GLCarriage, GLTraveller };
use super::glcamera::GLCamera;
use super::super::program::{ UniformValue, ProgramType };
use model::driver::{ DriverTraveller, Printer };
use model::stage::Screen;
use composit::Compositor;
use model::train::{ CarriageId, Carriage, Train, TravellerId };
use super::super::drawing::{ AllCanvasAllocator };
use dom::domutil;
use types::{ Dot };

use dom::webgl::WebGLRenderingContext as glctx;
use stdweb::web::html_element::{
    CanvasElement
};

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

    fn print_train(&mut self, train: &mut Train, camera: &GLCamera) {
        let mut car_uni : Vec<(CarriageId,Vec<(&'static str,UniformValue)>)> = Vec::new();
        for carriage_id in train.get_carriage_ids() {
            if let Some(carriage) = self.carriages.get_mut(carriage_id) {
                let uniforms = carriage.get_uniforms(camera);
                car_uni.push((carriage_id.clone(),uniforms));
            }
        }
        let types = self.base_progs.each();
        for prog_idx in 0..types.len() {
            for (carriage_id,uniforms) in &car_uni {
                let carriage = unwrap!(self.carriages.get_mut(carriage_id));
                carriage.execute(prog_idx,&uniforms);
            }
        }
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
        let mut window = compo.get_window();
        let train_manager = window.get_train_manager();
        /* get camera states */
        let prop_down = train_manager.get_prop_trans_down();
        let current_camera = train_manager.get_current_train().as_mut().as_mut().map(|train|
            GLCamera::new(prop_down,screen,train.get_position())
        );
        let prop_up = train_manager.get_prop_trans_up();
        let transition_camera = train_manager.get_transition_train().as_mut().as_mut().map(|train|
            GLCamera::new(prop_up,screen,train.get_position())
        );
        /* draw them */
        if let Some(train) = train_manager.get_current_train().as_mut() {
            self.base.borrow_mut().print_train(train,&current_camera.unwrap());
        }
        if let Some(train) = train_manager.get_transition_train().as_mut() {
            self.base.borrow_mut().print_train(train,&transition_camera.unwrap());
        }
        ; /* needed for borrow checker to be happy with window, oddly */
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
