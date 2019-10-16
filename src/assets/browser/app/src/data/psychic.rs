use std::collections::{ HashSet, HashMap };

use composit::{ Leaf, Scale, Stick };

pub struct PsychicPosition {
    min_leaf_index: i64,
    max_leaf_index: i64,
    stick: Stick,
    scale: Scale,
    leafs: HashSet<Leaf>
}

const PANE: i64 = 2;
const MINSCALE: i32 = -12;
const MAXSCALE: i32 = 7;

impl PsychicPosition {
    fn new(stick: &Stick, min: f64, max: f64, scale: Scale) -> PsychicPosition {
        let mut out = PsychicPosition {
            min_leaf_index: Leaf::containing(stick,min,&scale).get_index(),
            max_leaf_index: Leaf::containing(stick,max,&scale).get_index(),
            scale, stick: stick.clone(),
            leafs: HashSet::<Leaf>::new()
        };
        for leaf_index in out.min_leaf_index..(out.max_leaf_index+1) {
            out.build_out(leaf_index,&scale.clone());
            out.build_in(leaf_index,&scale.clone(),1,true);
        }
        for leaf_index in out.min_leaf_index-PANE..(out.max_leaf_index+PANE+1) {
            let leaf = Leaf::new(&out.stick,leaf_index,&scale);
            out.leafs.insert(leaf);
        }
        out
    }
    
    /* TODO max outer scale proper */
    fn build_out(&mut self, hindex: i64, scale: &Scale) {
        let leaf = Leaf::new(&self.stick,hindex,scale);
        if self.leafs.contains(&leaf) { return; }
        self.leafs.insert(leaf.clone());
        if scale.get_index() <= MINSCALE { return; }
        let new_scale = scale.next_scale(-1);
        let (old_start,old_end) = (leaf.get_start(),leaf.get_end());
        let min_new = Leaf::containing(&self.stick,leaf.get_start(),&new_scale);
        let max_new = Leaf::containing(&self.stick,leaf.get_end(),&new_scale);
        for leaf_index in min_new.get_index()..(max_new.get_index()+1) {
            self.build_out(leaf_index,&new_scale);
        }
    }
    
    fn build_in(&mut self, hindex: i64, scale: &Scale, width: i64, first: bool) {
        let leaf = Leaf::new(&self.stick,hindex,scale);
        if self.leafs.contains(&leaf) && !first { return; }
        self.leafs.insert(leaf.clone());
        if scale.get_index() >= MAXSCALE { return; }
        let new_scale = scale.next_scale(1);
        let min_new = Leaf::containing(&self.stick,leaf.get_start(),&new_scale);
        let max_new = Leaf::containing(&self.stick,leaf.get_end(),&new_scale);
        let avg_new = (max_new.get_index()-min_new.get_index()+1)/2;
        for leaf_index in (avg_new-width)..(avg_new+width+1) {
            self.build_in(leaf_index,&new_scale,(width-1).max(0),false);
        }
    }
    
    pub fn get_leafs(&self) -> &HashSet<Leaf> {
        &self.leafs
    }
}

pub struct PsychicPacer {
    separation: f64,
    sent_at: HashMap<Leaf,f64>
}

impl PsychicPacer {
    pub fn new(separation: f64) -> PsychicPacer {
        PsychicPacer {
            separation,
            sent_at: HashMap::<Leaf,f64>::new()
        }
    }
    
    pub fn filter_leafs(&mut self, leafs: &HashSet<Leaf>, t: f64) -> HashSet<Leaf> {
        let mut out = HashSet::<Leaf>::new();
        for leaf in leafs.iter() {
            if self.sent_at.get(&leaf)
                                .map(|x| t-x > self.separation)
                                .unwrap_or(true) {
                out.insert(leaf.clone());
                self.sent_at.insert(leaf.clone(),t);
            }
        }
        out
    }
}

pub struct Psychic {
    stick: Option<Stick>,
    middle: Option<f64>,
    scale: Option<Scale>,
    width: Option<f64>,
    pos: Option<PsychicPosition>
}

impl Psychic {
    pub fn new() -> Psychic {
        Psychic {
            stick:None, middle: None, scale: None, width: None, pos: None
        }
    }
    
    fn resolve(&mut self) {
        if let (Some(stick),Some(middle),Some(width),Some(scale)) = 
                (&self.stick,self.middle,self.width,self.scale) {
            let flank = width / scale.total_bp();
            self.pos = Some(PsychicPosition::new(
                stick,
                middle-flank,
                middle+flank,
                scale
            ));
        }
    }
    
    pub fn set_stick(&mut self, stick: &Stick) {
        self.stick = Some(stick.clone());
        self.resolve();
    }
    
    pub fn set_middle(&mut self, middle: i64) {
        self.middle = Some(middle as f64);
        self.resolve();
    }
    
    pub fn set_width(&mut self, width: i32) {
        self.width = Some(width as f64);
        self.resolve();
    }
    
    pub fn set_scale(&mut self, scale: &Scale) {
        self.scale = Some(scale.clone());
        self.resolve();
    }
    
    pub fn get_leafs(&self) -> Option<&HashSet<Leaf>> {
        if let Some(ref pos) = self.pos {
            Some(pos.get_leafs())
        } else {
            None
        }
    }
}
