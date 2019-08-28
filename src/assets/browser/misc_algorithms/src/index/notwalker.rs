use super::Walker;

pub struct NotWalker {
    prev: Option<usize>,
    kid: Box<dyn Walker>
}

impl NotWalker {
    pub fn new(kid: Box<dyn Walker>) -> Box<NotWalker> {
        Box::new(NotWalker { kid, prev: None })
    }
}

impl Walker for NotWalker {
    fn after(&mut self, mut start: usize) -> Option<usize> {
        if let Some(prev_val) = self.prev {
            if prev_val >= start {
                return Some(prev_val);
            }
        }
        loop {
            let v = self.kid.after(start);
            if v.is_none() || v.unwrap() > start { 
                self.prev = Some(start);
                return Some(start);
            }
            start += 1;
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
    fn notwalker_smoke() {
        let x1 = index(&vec![1,3,4,8,9,11]);
        let x2 = index(&vec![1,2,3,4,5,6,7,8,9,10,11,12]);
        let and = WalkerIter::new(AndWalker::new(vec![NotWalker::new(x1),x2]));
        let v : Vec<usize> = and.collect();
        assert_eq!(vec![2,5,6,7,10,12],v);
    }
}
