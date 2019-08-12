use super::Walker;

pub struct AndWalker {
    kids: Vec<Box<dyn Walker>>
}

impl AndWalker {
    pub fn new(kids: Vec<Box<dyn Walker>>) -> Box<AndWalker> {
        Box::new(AndWalker {
            kids: kids
        })
    }
}

impl Walker for AndWalker {
    fn after(&mut self, mut start: usize) -> Option<usize> {
        if self.kids.len() == 0 { return None; }
        loop {
            let mut common = self.kids[0].after(start);
            let mut next : Option<usize> = None;
            for kid in &mut self.kids {
                let v = kid.after(start);
                if v.is_none() { return None; }
                if common != v { common = None; }
                if next.is_none() || v.unwrap() > next.unwrap() {
                    next = v;
                }
            }
            if let Some(common) = common {
                return Some(common);
            }
            start = next.unwrap();
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use super::super::{
        SimpleIndex,
        WalkerIter,
        AndWalker
    };

    fn index(values: &Vec<usize>) -> Box<dyn Walker> {
        let mut si = SimpleIndex::new();
        for val in values {
            si.add(0,*val);
        }
        si.walker(&0)
    }

    #[test]
    fn andwalker_smoke() {
        let x1 = index(&vec![1,3,4    ,8,9   ,11   ]);
        let x2 = index(&vec![  3,4,5,6,8  ,10,11,12]);
        let and = WalkerIter::new(AndWalker::new(vec![x1,x2]));
        let v : Vec<usize> = and.collect();
        assert_eq!(vec![3,4,8,11],v);
    }
}
