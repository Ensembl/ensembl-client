use arena::{ ArenaData, Stage };
use program::objects::Object;

#[derive(Clone,Copy)]
pub struct DataBatch(u32);

impl DataBatch {
    pub fn new(id: u32) -> DataBatch {
        DataBatch(id)
    }
    
    pub fn id(&self) -> u32 { self.0 }
}

const BATCH_LIMIT : u32 = 65535;

pub struct DataGroupImpl {
    batches: Vec<DataBatch>,    
    batch_size: u32,
}

impl DataGroupImpl {
    pub fn new() -> DataGroupImpl {
        let mut out = DataGroupImpl {
            batches: Vec::<DataBatch>::new(),
            batch_size: 0,
        };
        out.new_batch();
        out
    }
    
    pub fn new_batch(&mut self) {
        let idx = self.batches.len() as u32;
        self.batches.push(DataBatch::new(idx));
        self.batch_size = 0;
    }

    pub fn batch_for(&mut self, more: u16) -> &DataBatch {
        if self.batch_size + more as u32 > BATCH_LIMIT {
            self.new_batch();
        }
        self.batch_size += more as u32;
        self.batches.last().unwrap()
    }
    
    pub fn draw(&mut self, adata: &ArenaData, stage:&Stage, objs: &Vec<Box<Object>>) {
        for b in self.batches.iter() {
            let mut main = None;
            for a in objs {
                if a.is_main() {
                    main = Some(a);
                } else {
                    a.execute(adata,b,stage,&adata.dims);
                }
            }
            if let Some(a) = main {
                a.execute(adata,b,stage,&adata.dims);
            }
        }
    }

    pub fn to_gl(&mut self, adata: &ArenaData, objs: &mut Vec<Box<Object>>) {
        for b in self.batches.iter_mut() {
            for a in &mut objs.iter_mut() {
                a.to_gl(b,adata);
            }
        }
    }
}

