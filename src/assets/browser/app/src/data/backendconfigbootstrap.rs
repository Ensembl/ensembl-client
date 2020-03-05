use commander::Agent;
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::{XmlHttpRequest, XhrResponseType, HtmlElement };
use url::Url;
use crate::util::API_VERSION;
use crate::controller::global::{ Booting, Global };

use super::{ BackendConfig, HttpManager, HttpResponseConsumer };

#[derive(Clone)]
pub struct BackendConfigBootstrap();

impl BackendConfigBootstrap {
    pub async fn new(agent: &Agent, mut global: Global, http_manager: &HttpManager, base: &Url, el: &HtmlElement, key: &str, debug: bool) {
        let mut config_url = base.clone();
        ok!(config_url.path_segments_mut()).push(&API_VERSION.to_string());
        let result = http_manager.go_get_json(&config_url).await;
        if let Ok(text) = result {
            match BackendConfig::from_json(text) {
                Ok(backend) => {
                    Booting::new(&mut global,http_manager,&base,&el,&key,debug).boot(&backend,agent);
                },
                Err(e) => {
                    console!("Abandoned starting genome browser due to nonsense config from backend: {}. Game Over.",e);
                }
            }
        } else {
            console!("Abandoned starting genome browser due to unavialability of config from backend. Game Over.");
        }        
    }
}
