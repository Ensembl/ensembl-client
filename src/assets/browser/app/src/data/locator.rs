use stdweb::web::XmlHttpRequest;
use url::Url;

use serde_json::Value as JSONValue;

use composit::{ Stick, StickManager, CombinedStickManager };
use data::{ HttpManager, HttpResponseConsumer, BackendConfig };

use misc_algorithms::marshal::{ json_str, json_obj_get, json_f64, json_bool };

pub struct LocateConsumer {
    stick_manager: CombinedStickManager,
    id: String,
    consumer: Option<Box<FnOnce(&str,&Stick,f64,f64)>>
}

impl LocateConsumer {
    pub fn new(stick_manager: &CombinedStickManager, id: &str, consumer: Box<FnOnce(&str,&Stick,f64,f64)>) -> LocateConsumer {
        LocateConsumer {
            stick_manager: stick_manager.clone(),
            id: id.to_string(),
            consumer: Some(consumer)
        }
    }

    fn locate(&mut self, req: XmlHttpRequest) -> Result<(),()> {
        let in_ = req.response_text().map_err(|_|())?;
        let data : JSONValue = serde_json::from_str(&unwrap!(in_)).map_err(|_|())?;
        let stick_name = json_str(json_obj_get(&data,"stick")?)?;
        let f : Result<f64,_> = json_str(json_obj_get(&data,"start")?)?.parse();
        let dest_start = json_f64(json_obj_get(&data,"start")?)?;
        let dest_end = json_f64(json_obj_get(&data,"end")?)?;
        let found = json_bool(json_obj_get(&data,"found")?)?;
        if found {
            if let Some(stick) = self.stick_manager.get_stick(&stick_name) {
                let dest_pos = (dest_start+dest_end)/2.;
                let dest_size = dest_end-dest_start;
                (self.consumer.take().unwrap())(&self.id,&stick,dest_pos,dest_size);
            }
        }
        Ok(())
    }
}

impl HttpResponseConsumer for LocateConsumer {
    fn consume(&mut self, req: XmlHttpRequest) {
        self.locate(req);
    }
}

#[derive(Clone)]
pub struct Locator {
    manager: HttpManager,
    stick_manager: CombinedStickManager,
    url: Option<Url>
}

impl Locator {
    pub fn new(bc: &BackendConfig, manager: &HttpManager, stick_manager: &CombinedStickManager, base: &Url) -> Locator {
        let url = bc.get_jumper_url().as_ref().and_then(|v| base.join(v).ok());
        Locator {
            manager: manager.clone(),
            stick_manager: stick_manager.clone(),
            url: url.clone()
        }
    }

    pub fn locate(&self, id: &str, consumer: Box<FnOnce(&str,&Stick,f64,f64)>) -> Result<(),String> {
        let consumer = Box::new(LocateConsumer::new(&self.stick_manager,id,consumer));
        let xhr = XmlHttpRequest::new();
        if let Some(ref url) = self.url {
            let mut url = url.clone();
            {
                let mut path = url.path_segments_mut().map_err(|_| "Cannot parse locale url".to_string())?;
                path.push(id);
            }
            xhr.open("GET",&url.as_str()).map_err(|e| e.to_string());
            self.manager.add_request(xhr,None,consumer);
            console!("jump set to {:?}",id);
            Ok(())
        } else {
            console!("no jumper URL");
            Err("no jumper URL".to_string())
        }
    }
}
