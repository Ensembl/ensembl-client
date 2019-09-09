use std::collections::HashSet;

use composit::{ Stick, Scale, ComponentSet, StateManager };
use model::driver::{ Printer };
use model::stage::{ Screen };
use model::supply::{ Product };
use model::train::{ Train, TravellerCreator };
use model::zmenu::{ ZMenuRegistry, ZMenuLeafSet, ZMenuIntersection };

use controller::global::{ AppRunner, WindowState };
use controller::output::Report;
use data::{ Psychic, PsychicPacer, XferCache };
use types::Dot;

const MS_PER_UPDATE : f64 = 100.;
const MS_PRIME_DELAY: f64 = 2000.;

pub struct Compositor {
    window: WindowState,
    traveller_creator: TravellerCreator,
    zmr: ZMenuRegistry,
    bp_per_screen: f64,
    updated: bool,
    prime_delay: Option<f64>,
    last_updated: Option<f64>,
    wanted_componentset: ComponentSet,
    current_componentset: ComponentSet,
    psychic: Psychic,
    pacer: PsychicPacer,
    xfercache: XferCache
}

impl Compositor {
    pub fn new(window: &WindowState, traveller_creator: &TravellerCreator, xfercache: &XferCache) -> Compositor {
        Compositor {
            traveller_creator: traveller_creator.clone(),
            window: window.clone(),
            zmr: ZMenuRegistry::new(),
            bp_per_screen: 1.,
            updated: true,
            last_updated: None,
            wanted_componentset: ComponentSet::new(),
            current_componentset: ComponentSet::new(),
            psychic: Psychic::new(),
            prime_delay: None,
            pacer: PsychicPacer::new(30000.),
            xfercache: xfercache.clone()
        }
    }

    pub fn get_zmr(&self) -> &ZMenuRegistry { &self.zmr }

    pub fn get_prop_trans(&mut self) -> f32 { self.window.get_train_manager().get_prop_trans() }

    fn prime_cache(&mut self, t: f64) {
        if self.prime_delay.is_none() {
            self.prime_delay = Some(t);
        }
        if t - self.prime_delay.unwrap() > MS_PRIME_DELAY {
            if let Some(leafs) = self.psychic.get_leafs() {
                let leafs = self.pacer.filter_leafs(leafs,t);
                for leaf in leafs.iter() {
                    for prod in self.wanted_componentset.get_products() {
                        self.xfercache.prime(self.window.get_http_clerk(),prod,&leaf);
                    }
                }
            }
        }
    }

    pub fn tick(&mut self, t: f64) {
        /* Manage components */
        for added in self.wanted_componentset.not_in(&self.current_componentset).iter() {
            self.add_product(added.clone());
        }
        for removed in self.current_componentset.not_in(&self.wanted_componentset).iter() {
            self.traveller_creator.remove_source(removed.clone().get_product_name());
        }
        self.current_componentset = self.wanted_componentset.clone();
        /* Warm up xfercache */
        self.prime_cache(t);
        /* Move into future */
        self.window.get_train_manager().tick(t);
        /* Manage useful leafs */
        if self.updated {
            if let Some(prev_t) = self.last_updated {
                if t-prev_t < MS_PER_UPDATE { return; }
            }
            self.window.get_train_manager().manage_carriages();        
            self.updated = false;
            self.last_updated = Some(t);
        }
    }

    pub fn update_report(&mut self, report: &Report) {
        self.window.get_train_manager().update_report(report);
    }

    pub fn set_stick(&mut self, st: &Stick) -> bool {
        if self.window.get_train_manager().set_desired_stick(st) {
            self.prime_delay = None; // Force priming delay as screen is completely invalid
            self.psychic.set_stick(st);
            self.updated = true;
            true
        } else {
            false
        }
    }

    pub fn set_position(&mut self, middle: Dot<f64,f64>) {
        self.window.get_train_manager().set_middle(middle);
        self.psychic.set_middle(middle.0 as i64);
        self.updated = true;
    }
    
    pub fn set_bp_per_screen(&mut self, bp_per_screen: f64) {
        self.bp_per_screen = bp_per_screen;
        self.window.get_train_manager().set_bp_per_screen(bp_per_screen);
        self.psychic.set_scale(&Scale::best_for_screen(bp_per_screen));
        self.psychic.set_width(bp_per_screen as i32);
        self.updated = true;
    }

    pub fn with_current_train<F>(&mut self, mut cb: F) where F: FnMut(&mut Train) {
        self.window.get_train_manager().with_current_train(cb)
    }

    pub fn with_transition_train<F>(&mut self, mut cb: F) where F: FnMut(&mut Train) {
        self.window.get_train_manager().with_transition_train(cb)
    }
    
    pub fn get_component_set(&mut self) -> &mut ComponentSet {
        &mut self.wanted_componentset
    }
    
    pub fn redraw_where_needed(&mut self, printer: &mut dyn Printer) {
        let mut zmls = ZMenuLeafSet::new();
        self.with_current_train(|train| train.redraw_where_needed(printer,&mut zmls));
        self.with_transition_train(|train| train.redraw_where_needed(printer,&mut zmls));
        self.zmr.add_leafset(zmls);
    }

    fn add_product(&mut self, mut c: Product) {
        self.window.get_train_manager().add_component(&mut c);
        self.traveller_creator.add_source(c);
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.window.get_train_manager().update_state(oom);
    }
    
    pub fn intersects(&mut self, screen: &Screen, pos: Dot<i32,i32>) -> HashSet<ZMenuIntersection> {
        let mut zmr = self.zmr.clone();
        self.window.get_train_manager().intersects(screen,pos,&mut zmr)
    }
}

pub fn register_compositor_ticks(ar: &mut AppRunner) {
    ar.add_timer("compositor",|app,t,_| {
        app.with_compo(|co| co.tick(t) );
        let max_y = app.get_window().get_all_landscapes().get_low_watermark();
        app.get_window().get_train_manager().set_bottom(max_y as f64);
        app.update_position();
        vec!{}
    },2);
}
