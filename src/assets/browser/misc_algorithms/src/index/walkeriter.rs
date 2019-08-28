use super::Walker;

pub struct WalkerIter(Box<dyn Walker>,Option<usize>);

impl WalkerIter {
    pub fn new(mut walker: Box<dyn Walker>) -> WalkerIter {
        let next = walker.after(0);
        WalkerIter(walker,next)
    }
}

impl Iterator for WalkerIter {
    type Item = usize;

    fn next(&mut self) -> Option<Self::Item> {
        let out = self.1;
        if let Some(prev) = self.1 {
            self.1 = self.0.after(prev+1);
        }
        out
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use super::super::{
        SimpleIndex
    };

    #[test]
    fn walkeriter_smoke() {
        let mut si = SimpleIndex::new();
        si.add(0,10);
        si.add(0,11);
        si.add(0,12);
        si.remove(&0,11);
        let mut w = WalkerIter::new(si.walker(&0));
        assert_eq!(Some(10),w.next());
        assert_eq!(Some(12),w.next());
        assert_eq!(None,w.next());
        assert_eq!(None,w.next());
    }
}
