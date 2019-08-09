use serde_json::Value as SerdeValue;
use tánaiste::Value;

use composit::{ Leaf, StickManager };
use controller::global::WindowState;
use data::BackendConfig;
use model::supply::{ ProductList, PurchaseOrder };

pub struct JSONXferResponse {
    pub codename: String,
    pub purchase_order: PurchaseOrder,
    pub values: Vec<Value>
}

fn marshal(data: &SerdeValue) -> Vec<Value> {
    let mut out = Vec::<Value>::new();
    for val in unwrap!(data.as_array()) {
        let mut row = Vec::<f64>::new();
        if val.is_array() {
            for cell in unwrap!(val.as_array()) {
                if cell.is_f64() {
                    row.push(unwrap!(cell.as_f64()));
                } else if cell.is_i64() {
                    row.push(unwrap!(cell.as_i64()) as f64);
                } else if cell.is_boolean() {
                    row.push(if unwrap!(cell.as_bool()) { 1. } else { 0. } );
                }
            }
            out.push(Value::new_from_float(row));
        } else if val.is_object() {
            if let Some(string) = unwrap!(val.as_object()).get("string") {
                let values : Vec<String> = 
                        unwrap!(string.as_array()).iter()
                        .map(|x| unwrap!(x.as_str()).to_string())
                        .collect();
                out.push(Value::new_from_string(values));
            }
        }
    }
    out
}

pub fn parse_jsonxferresponse(window: &mut WindowState, data: &SerdeValue) -> Vec<JSONXferResponse> {
    let mut out = Vec::new();
    for resp in unwrap!(data.as_array()) {
        let code_data = unwrap!(resp[0].as_array());
        let product_list = window.get_product_list().clone();
        let product = window.get_backend_config().wire_to_name(unwrap!(code_data[0].as_str()))
                        .as_ref().and_then(|name| product_list.get_product(name));
        let stick = unwrap!(window.get_stick_manager().get_stick(unwrap!(code_data[1].as_str())));
        let leaf = Leaf::from_short_spec(&stick,unwrap!(code_data[2].as_str()));
        if let Some(product) = product {
            let purchase_order = PurchaseOrder::new(&product,&leaf,&code_data[3].as_str().map(|v| v.to_string()));
            out.push(JSONXferResponse {
                codename: unwrap!(resp[2].as_str()).to_string(),
                purchase_order,
                values: marshal(&resp[3])
            });
        }
    }
    out
}

pub fn parse_jsonxferresponse_str(window: &mut WindowState, data: &str) -> Vec<JSONXferResponse> {
    parse_jsonxferresponse(window,&ok!(serde_json::from_str(data)))
}
