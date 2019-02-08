use std::sync::{ Arc, Mutex };

use stdweb::web::HtmlElement;

use controller::global::App;

pub trait Bling {
    fn apply_bling(&self, el: &HtmlElement) -> HtmlElement;
    fn activate(&mut self, _ar: &Arc<Mutex<App>>, _el: &HtmlElement) {}
    fn key(&mut self, _app: &Arc<Mutex<App>>, _key: &str) {}
}
