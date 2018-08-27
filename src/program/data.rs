use std::collections::HashMap;
use std::collections::hash_map::Entry;
use std::collections::hash_map::Keys;

#[derive(Clone,Copy)]
pub struct DataGroup(u32);

#[derive(Clone,Copy)]
pub struct DataBatch(u32);

impl DataBatch {
    pub fn id(&self) -> u32 { self.0 }
}

pub struct BatchIter<'a>(Keys<'a,u32,u16>);

impl<'a> BatchIter<'a> {
    fn new(bm: &'a BatchManager) -> BatchIter<'a> {
        BatchIter(bm.batch_size.keys())
    }
}

impl<'a> Iterator for BatchIter<'a> {
    type Item = DataBatch;
    
    fn next(&mut self) -> Option<DataBatch> {
        if let Some(v) = self.0.next() {
            Some(DataBatch(*v))
        } else {
            None
        }
    }
}

pub struct BatchManager {
    max_group: u32,
    max_batch: u32,
    batch_size: HashMap<u32,u16>,
    group_batch: HashMap<u32,u32>
}

const BATCH_LIMIT : u32 = 65535;

impl BatchManager {
    pub fn new() -> BatchManager {
        BatchManager {
            max_group: 0,
            max_batch: 0,
            batch_size: HashMap::<u32,u16>::new(),
            group_batch: HashMap::<u32,u32>::new()
        }
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
                *e.insert(self.max_batch)
            }
        };        
        /* Get current batch size */
        let mut size = *self.batch_size.entry(batch).or_insert(0);
        /* Create a new, if full */
        if (size as u32) + (points as u32) > BATCH_LIMIT {
            self.max_batch += 1;
            let batch = self.max_batch;
            self.group_batch.insert(g.0,batch);
            size = 0;
        }
        /* Add in new points */
        self.batch_size.insert(batch,size+points);
        DataBatch(batch)
    }
}
