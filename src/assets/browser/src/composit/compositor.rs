use composit::{
    ActiveSource, Leaf, Train, ComponentManager, Stick, TrainManager
};
use controller::global::AppRunner;
use types::DOWN;

const MS_PER_UPDATE : f64 = 250.;

pub struct Compositor {
    train_manager: TrainManager,
    bp_per_screen: f64,
    updated: bool,
    last_updated: Option<f64>,
    components: ComponentManager
}

impl Compositor {
    pub fn new() -> Compositor {
        let mut out = Compositor {
            train_manager: TrainManager::new(),
            components: ComponentManager::new(),
            bp_per_screen: 1.,
            updated: true,
            last_updated: None
        };
        out.set_zoom(1.); // XXX
        out
    }

    pub fn get_prop_trans(&self) -> f32 { self.train_manager.get_prop_trans() }

    pub fn tick(&mut self, t: f64) {
        /* Kick off requests */
        self.components.tick(t);
        /* Move into future */
        self.train_manager.tick(t,&mut self.components);
        /* Manage useful leafs */
        if self.updated {
            if let Some(prev_t) = self.last_updated {
                if t-prev_t < MS_PER_UPDATE { return; }
            }
            let comps = &mut self.components;
            self.train_manager.each_train(|sc| sc.manage_leafs(comps));            
            self.updated = false;
            self.last_updated = Some(t);
        }
    }

    pub fn set_stick(&mut self, st: &Stick) {
        self.train_manager.set_stick(st,self.bp_per_screen);
        self.updated = true;
    }

    pub fn set_position(&mut self, position_bp: f64) {
        self.train_manager.set_position(position_bp);
        self.updated = true;
    }
    
    pub fn set_zoom(&mut self, bp_per_screen: f64) {
        self.bp_per_screen = bp_per_screen;
        self.train_manager.set_zoom(&mut self.components, bp_per_screen);
        self.updated = true;
    }

    pub fn get_current_train(&mut self) -> Option<&mut Train> {
        self.train_manager.get_current_train()
    }

    pub fn get_transition_train(&mut self) -> Option<&mut Train> {
        self.train_manager.get_transition_train()
    }
    
    pub fn add_component(&mut self, c: ActiveSource) {
        {
            let cc = &mut self.components;
            self.train_manager.each_train(|sc|
                sc.add_component(cc,&c)
            );
        }
        self.components.add(c);
    }

    fn get_max_y(&self) -> i32 { self.train_manager.get_max_y() }

    pub fn remove(&mut self, name: &str) {
        self.components.remove(name);
    }
    
    pub fn all_printing_leafs(&self) -> Vec<Leaf> {
        self.train_manager.all_printing_leafs()
    }
}

pub fn register_compositor_ticks(ar: &mut AppRunner) {
    ar.add_timer(|cs,t| {
        let max_y = cs.with_compo(|co| {
            co.tick(t);
            co.get_max_y()
        });
        cs.with_stage(|s| s.set_limit(&DOWN,max_y as f64));
    },None);
}
