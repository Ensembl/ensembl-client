use super::Walker;

pub struct OrWalker {
    kids: Vec<Box<dyn Walker>>
}

impl OrWalker {
    pub fn new(kids: Vec<Box<dyn Walker>>) -> Box<OrWalker> {
        Box::new(OrWalker {
            kids: kids
        })
    }
}

impl Walker for OrWalker {
    fn after(&mut self, start: usize) -> Option<usize> {
        if self.kids.len() == 0 { return None; }
        let mut pos = None;
        for kid in &mut self.kids {
            if let Some(v) = kid.after(start) {
                if pos.is_none() || pos.unwrap() > v {
                    pos = Some(v);
                }
            }
            
        }
        pos
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use super::super::{
        SimpleIndex,
        WalkerIter,
        OrWalker
    };

    fn index(values: &Vec<usize>) -> Box<dyn Walker> {
        let mut si = SimpleIndex::new();
        for val in values {
            si.add(0,*val);
        }
        si.walker(&0)
    }

    #[test]
    fn orwalker_smoke() {
        let x1 = index(&vec![1,3,4    ,8,9   ,11   ]);
        let x2 = index(&vec![  3,4,5,6,8  ,10,11,12]);
        let and = WalkerIter::new(OrWalker::new(vec![x1,x2]));
        let v : Vec<usize> = and.collect();
        assert_eq!(vec![1,3,4,5,6,8,9,10,11,12],v);
    }
}
