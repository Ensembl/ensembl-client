use serde_json::Value as SerdeValue;
use tánaiste::Value;

use composit::{ Leaf, StickManager };
use controller::global::WindowState;
use model::item::{ DeliveredItemId, DeliveredItem, FocusSpecificity };
use misc_algorithms::marshal::{ json_str, json_array };

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

pub fn parse_delivereditem_internal(window: &mut WindowState, data: &str) -> Result<Vec<DeliveredItem>,()> {
    let data : &SerdeValue = &ok!(serde_json::from_str(data));
    let mut out = Vec::new();
    for resp in json_array(data)? {
        let code_data = json_array(&resp[0])?;
        let product_list = window.get_product_list().clone();
        let product_name = window.get_backend_config().wire_to_name(&json_str(&code_data[0])?).ok_or(())?;
        let stick = unwrap!(window.get_stick_manager().get_stick(&json_str(&code_data[1])?));
        let leaf = Leaf::from_short_spec(&stick,&json_str(&code_data[2])?);
        let focus = match code_data[4].as_bool().unwrap_or(true) {
            false => FocusSpecificity::Agnostic,
            true => FocusSpecificity::Specific(code_data[3].as_str().map(|v| v.to_string()))
        };
        if let Ok(bytecode) = window.get_backend_config().get_bytecode(&json_str(&resp[1])?) {
            if let Some(product) = product_list.get_product(&product_name) {
                //console!("using {:?} for {:?} and data {:?}",json_str(&resp[1]),product, marshal(&resp[2]));
                out.push(DeliveredItem::new(
                    &DeliveredItemId::new(&product,&leaf,&focus),
                    bytecode.clone(),
                    marshal(&resp[2])
                ));
            }
        }
    }
    Ok(out)
}

pub fn parse_delivereditem(window: &mut WindowState, data: &str) -> Vec<DeliveredItem> {
    match parse_delivereditem_internal(window,data) {
        Ok(data) => data,
        Err(_) => vec![]
    }
}