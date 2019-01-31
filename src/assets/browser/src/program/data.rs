use std::collections::HashMap;
use std::collections::hash_map::Entry;
use program::ObjectAttrib;

pub trait Input {
    fn to_f32(&self, _dest: &mut Vec<f32>) {}
}

#[derive(Clone,Copy,Debug)]
pub struct DataGroup(u32);

#[derive(Clone,Copy,Debug)]
pub struct DataBatch(u32,u32);

impl DataBatch {
    pub fn group(&self) -> DataGroup { DataGroup(self.0) }
    pub fn id(&self) -> u32 { self.1 }
}

impl DataGroup {
    pub fn id(&self) -> u32 { self.0 }
}    

pub struct BatchIter(Vec<DataBatch>,usize);

impl BatchIter {
    fn new(bm: &BatchManager) -> BatchIter {
        let mut out = Vec::<DataBatch>::new();
        for k in bm.batch_size.keys() {
            out.push(DataBatch(bm.batch_group[k],*k));
        }
        BatchIter(out,0)
    }
}

impl Iterator for BatchIter {
    type Item = DataBatch;
    
    fn next(&mut self) -> Option<DataBatch> {
        if self.1 < self.0.len() {
            self.1 += 1;
            Some(self.0[self.1-1])
        } else {
            None
        }
    }
}

/* BatchManager manages the running of multiple instances of a WebGL
 * program due to data-volume or different values for uniforms.
 * 
 * A DataGroup represents a set of runs with particular parameter
 * settings. A DataBatch is an indivdual run within a DataGroup.
 * 
 * A property with particular requirements for a uniform creates a new
 * DataGroup at the time it is set up. A DataBatch is created, or an
 * existing one returned. Whether data is partitioned according to
 * batch (ie whether batches are used) is left to the individual program
 * objects. However both ObjectAttrib and ObjectUniform do implelement
 * them so, in parctice their use can be relied upon.
 * 
 * Properties which use groups implement ShapeContext which ensures they
 * are run prior to adding shapes. They create groups and populate
 * objects with the values of their uniforms before any shape is 
 * created. If no data goes into these groups, they are unused. Some,
 * such as spot values, have values known as part of the composition.
 * 
 * Program::draw is called just once per program. This iterates through
 * the batches and calls Object::execute on each.
 */

pub struct BatchManager {
    max_group: u32,
    max_batch: u32,
    batch_size: HashMap<u32,u16>,
    batch_group: HashMap<u32,u32>,
    group_batch: HashMap<u32,u32>
}

const BATCH_LIMIT : u32 = 65535;

impl BatchManager {
    pub fn new() -> BatchManager {
        BatchManager {
            max_group: 0,
            max_batch: 0,
            batch_size: HashMap::<u32,u16>::new(),
            group_batch: HashMap::<u32,u32>::new(),
            batch_group: HashMap::<u32,u32>::new()
        }
    }
    
    pub fn reset(&mut self) {
        self.max_group = 0;
        self.max_batch = 0;
        self.batch_size.clear();
        self.batch_group.clear();
        self.group_batch.clear();
    }
    
    pub fn iter(&self) -> BatchIter {
        BatchIter::new(self)
    }
        
    pub fn new_group(&mut self) -> DataGroup {
        self.max_group += 1;
        DataGroup(self.max_group)
    }
    
    pub fn get_batch(&mut self, g: DataGroup, points: u16) -> DataBatch {
        /* Get current batch for group (or create it) */
        let batch = match self.group_batch.entry(g.0) {
            Entry::Occupied(e) => *e.get(),
            Entry::Vacant(e) => {
                self.max_batch += 1;
                self.batch_group.insert(self.max_batch,g.0);
                *e.insert(self.max_batch)
            }
        };
        /* Get current batch size */
        let mut size = *self.batch_size.entry(batch).or_insert(0);
        /* Create a new, if full */
        if (size as u32) + (points as u32) > BATCH_LIMIT {
            self.max_batch += 1;
            self.batch_group.insert(self.max_batch,g.0);
            let batch = self.max_batch;
            self.group_batch.insert(g.0,batch);
            size = 0;
        }
        /* Add in new points */
        self.batch_size.insert(batch,size+points);
        DataBatch(g.0,batch)
    }
}
