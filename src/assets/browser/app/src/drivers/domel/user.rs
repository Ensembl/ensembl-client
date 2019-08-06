use std::sync::{ Arc, Mutex };
use dom::domutil;
use dom::event::{ EventListener, EventType, EventData, EventControl, Target };
use stdweb::web::{ Element, HtmlElement, IHtmlElement };
use stdweb::traits::IEvent;

use controller::global::{ App, AppRunner };
use controller::input::{ actions_run, Action };
use controller::animate::{ MousePhysics, Optical };
use types::{ Dot, CPixel };

pub struct UserEventListener {
    canv_el: HtmlElement,
    app: Arc<Mutex<App>>,
    position: Arc<Mutex<MousePhysics>>,
    zoom: Arc<Mutex<Optical>>
}

impl UserEventListener {
    pub fn new(app: &Arc<Mutex<App>>,
               canv_el: &HtmlElement,
               position: &Arc<Mutex<MousePhysics>>,
               zoom: &Arc<Mutex<Optical>>) -> UserEventListener {
        UserEventListener {
            app: app.clone(),
            position: position.clone(),
            canv_el: canv_el.clone(),
            zoom: zoom.clone()
        }
    }
    
    fn mouse_rel_box(&self, cp: &CPixel) -> CPixel {
        let pos = domutil::position(&self.canv_el);
        let offset = pos.offset();
        let offset = Dot(offset.0 as i32,offset.1 as i32);
        *cp - offset
    }
    
    fn wheel(&mut self, amt: f64) {
        let app = &mut self.app.lock().unwrap();
        let (y,pos_bp,pos_prop) = app.with_stage(|s|
            (s.get_pos_middle().1,
             s.get_mouse_pos_bp(),
             s.get_mouse_pos_prop())
        );

        let pos = Dot(pos_bp,y);
        self.zoom.lock().unwrap().move_by(amt,pos,pos_prop);
    }
    
    fn zmenu_click_check(&mut self, pos: &CPixel) {
        let mut app = &mut self.app.lock().unwrap();
        app.run_actions(&vec![
            Action::ZMenuClickCheck(*pos)
        ],None); 
    }
}

impl EventListener<()> for UserEventListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::MouseEvent(EventType::MouseWheelEvent,_,e) => {
                self.wheel(-e.wheel_delta() as f64/1000.);
                e.stop_propagation();
                e.prevent_default();
            },
            EventData::MouseEvent(EventType::MouseDownEvent,_,e) => {
                self.canv_el.focus();
                domutil::clear_selection();
                e.stop_propagation();
                self.position.lock().unwrap().down(self.mouse_rel_box(&e.at()));
            },
            EventData::MouseEvent(EventType::MouseMoveEvent,_,e) => {
                let box_mouse = self.mouse_rel_box(&e.at());
                self.position.lock().unwrap().move_to(box_mouse);
                self.app.lock().unwrap().with_stage(|s| 
                    s.set_mouse_pos(&box_mouse)
                );
            },
            EventData::MouseEvent(EventType::MouseClickEvent,_,e) => {
                self.zmenu_click_check(&self.mouse_rel_box(&e.at()));
                e.stop_propagation();
            },
            EventData::MouseEvent(EventType::MouseDblClickEvent,_,e) => {
                if e.shift_key() {
                    self.wheel(-0.5);
                } else {
                    self.wheel(0.5);
                }
                e.stop_propagation();
            },
            EventData::GenericEvent(EventType::ContextMenuEvent,e) => {
                e.stop_propagation();
                e.prevent_default();
            }
            _ => ()
        };
    }
}

pub struct UserEventListenerBody {
    app_runner: AppRunner,
    position: Arc<Mutex<MousePhysics>>,
}

impl UserEventListenerBody {
    pub fn new(app_runner: &AppRunner, position: &Arc<Mutex<MousePhysics>>) -> UserEventListenerBody {
        UserEventListenerBody {
            position: position.clone(),
            app_runner: app_runner.clone(),
        }
    }
}

impl EventListener<()> for UserEventListenerBody {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::MouseEvent(EventType::MouseUpEvent,_,_) => {
                self.position.lock().unwrap().up();
            },
            EventData::KeyboardEvent(EventType::KeyPressEvent,_,e) => {
                self.app_runner.bling_key(&e.key_char());
            },
            _ => ()
        }
    }
}

pub fn register_user_events(gc: &mut AppRunner, el: &HtmlElement) {
    let mp = Arc::new(Mutex::new(MousePhysics::new(gc)));
    let op = Arc::new(Mutex::new(Optical::new(gc)));
    let uel = UserEventListener::new(&gc.state(),el,&mp,&op);
    let mut ec_canv = EventControl::new(Box::new(uel),());
    ec_canv.add_event(EventType::MouseClickEvent);
    ec_canv.add_event(EventType::MouseDblClickEvent);
    ec_canv.add_event(EventType::MouseDownEvent);
    ec_canv.add_event(EventType::MouseMoveEvent);
    ec_canv.add_event(EventType::MouseWheelEvent);
    ec_canv.add_event(EventType::ContextMenuEvent);
    let elel: Element = el.clone().into();
    ec_canv.add_element(&elel,());
    let uel_body = UserEventListenerBody::new(gc,&mp);
    let mut ec_body = EventControl::new(Box::new(uel_body),());
    ec_body.add_event(EventType::MouseUpEvent);
    ec_body.add_event(EventType::KeyPressEvent);
    ec_body.add_element(&domutil::query_select("body"),());        
    gc.add_control(Box::new(ec_canv));
    gc.add_control(Box::new(ec_body));
}
