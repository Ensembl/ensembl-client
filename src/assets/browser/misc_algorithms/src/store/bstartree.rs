use std::cell::RefCell;
use std::collections::BTreeMap;
use std::rc::Rc;

use crate::index::Walker;

const B : usize = 16;

#[derive(Debug)]
struct BStarLeaf {
    start: usize,
    values: Vec<usize>,
    next: Option<Rc<RefCell<BStarLeaf>>>,
    valid: bool
}

#[derive(Debug)]
struct BStarTreeImpl {
    internal: BTreeMap<usize,Rc<RefCell<BStarLeaf>>>
}

#[derive(Clone)]
pub struct BStarTree(Rc<RefCell<BStarTreeImpl>>);

#[cfg(test)]
pub struct BStarTreeWalker {
    tree: BStarTree,
    leaf: Rc<RefCell<BStarLeaf>>,
    index: usize,
    value: Option<usize>,
    test_vec: u32
}
#[cfg(not(test))]
pub struct BStarTreeWalker {
    tree: BStarTree,
    leaf: Rc<RefCell<BStarLeaf>>,
    index: usize,
    value: Option<usize>
}

impl BStarTree {
    pub fn new() -> BStarTree {
        let tree = BStarTree(Rc::new(RefCell::new(BStarTreeImpl {
            internal: BTreeMap::new()
        })));
        let leaf = BStarLeaf {
            start: 0,
            values: Vec::new(),
            next: None,
            valid: true
        };
        tree.0.borrow_mut().internal.insert(0,Rc::new(RefCell::new(leaf)));
        tree
    }

    pub fn add(&mut self, value: usize) {
        let internal = &mut self.0.borrow_mut().internal;
        let leaf_ref = internal.range(..value+1).rev().next().unwrap().1.clone();
        let mut leaf = leaf_ref.borrow_mut();
        let mut index = 0;
        for v in leaf.values.iter() {
            if v == &value { return; }
            if v > &value { break; }
            index += 1;
        }
        leaf.values.insert(index,value);
        if leaf.values.len() > 2*B {
            let second_values = leaf.values.split_off(B);
            let second = BStarLeaf {
                start: second_values[0],
                values: second_values,
                next: leaf.next.clone(),
                valid: true
            };
            let split_at = second.values[0];
            let second_ref = Rc::new(RefCell::new(second));
            internal.insert(split_at,second_ref.clone());
            leaf.next = Some(second_ref);
        }
    }

    pub fn remove(&mut self, value: usize) {
        let internal = &mut self.0.borrow_mut().internal;
        let leaf_ref = internal.range(..value+1).rev().next().unwrap().1.clone();
        let mut leaf = leaf_ref.borrow_mut();
        if let Ok(index) = leaf.values.binary_search(&value) {
            leaf.values.remove(index);
        }
        while leaf.values.len() < B && leaf.next.is_some() {
            let second_ref = leaf.next.clone().unwrap();
            let mut second = second_ref.borrow_mut();
            if second.values.len() > 0 {
                leaf.values.append(&mut second.values);
            }
            internal.remove(&second.start);
            leaf.next = second.next.clone();
            second.valid = false;
        }
    }

    #[cfg(test)]
    pub fn walker(&self) -> BStarTreeWalker {
        let internal = &mut self.0.borrow_mut().internal;
        let leaf = internal.get(&0).unwrap();
        BStarTreeWalker {
            tree: self.clone(),
            leaf: leaf.clone(),
            index: 0,
            value: None,
            test_vec: 0
        }
    }

    #[cfg(not(test))]
    pub fn walker(&self) -> BStarTreeWalker {
        let internal = &mut self.0.borrow_mut().internal;
        let leaf = internal.get(&0).unwrap();
        BStarTreeWalker {
            tree: self.clone(),
            leaf: leaf.clone(),
            index: 0,
            value: None
        }
    }
}

impl BStarTreeWalker {
    fn slow(&mut self, start: usize) {
        let internal = &mut self.tree.0.borrow_mut().internal;
        let mut leaf_ref = internal.range(..start+1).rev().next().unwrap().1.clone();
        loop {
            for (i,v) in leaf_ref.borrow_mut().values.iter().enumerate() {
                if v >= &start { 
                    self.leaf = leaf_ref.clone();
                    self.index = i;
                    self.value = Some(*v);
                    return;
                }
            }
            if leaf_ref.borrow_mut().next.is_none() {
                self.value = None;
                return;
            }
            leaf_ref = {
                let leaf = leaf_ref.borrow();
                leaf.next.as_ref().unwrap().clone()
            };
            self.leaf = leaf_ref.clone();
            self.index = 0;
        }
    }

    fn fast(&mut self) -> Option<(Rc<RefCell<BStarLeaf>>,usize)> {
        let leaf = self.leaf.borrow_mut();
        if self.index+1 >= leaf.values.len() {
            if let Some(leaf) = leaf.next.as_ref() {
                Some((leaf.clone(),0))
            } else {
                None
            }
        } else {
            Some((self.leaf.clone(),self.index+1))
        }
    }

    #[cfg(not(test))] fn test_vec(&mut self, _: u32) {}
    #[cfg(test)]      fn test_vec(&mut self, v: u32) { self.test_vec |= v; }

    fn validates(&self) -> bool {
        if self.value.is_none() { return false; }
        let leaf = self.leaf.borrow_mut();
        if !leaf.valid || self.index >= leaf.values.len() { return false; }
        leaf.values[self.index] == self.value.unwrap()
    }
}

impl Walker for BStarTreeWalker {
    fn after(&mut self, start: usize) -> Option<usize> {
        if self.validates() {
            let stored = self.value.unwrap();
            if stored >= start {
                self.test_vec(1);
                return Some(stored);
            } else {
                let avail = self.fast();
                if avail.is_none() { return None; }
                let (leaf_ref,mut index) = avail.unwrap();
                let leaf = leaf_ref.borrow();
                self.test_vec(4);
                while index < leaf.values.len() {
                    if leaf.values[index] >= start {
                        self.value = Some(leaf.values[index]);
                        self.leaf = leaf_ref.clone();
                        self.index = index;
                        self.test_vec(2);
                        return self.value;
                    }
                    index += 1;
                }
            }
        }
        self.slow(start);
        self.value
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::index::WalkerIter;

    fn walk(bst: &BStarTree) -> Vec<usize> {
        WalkerIter::new(Box::new(bst.walker())).collect()
    }

    #[test]
    fn bstar_smoke() {
        let mut all : Vec<usize> = Vec::new();
        let mut adds = Vec::new();
        for i in 0..100 { adds.push(i*5); }
        for i in 0..100 { adds.push((100-i)*5+1); }
        for i in 0..100 { adds.push((((100-i)*7)%100)*5+2); }
        all.extend(adds.iter());
        let mut dels = Vec::new();
        for i in 0..1000 { dels.push(i*2); all.remove_item(&(i*2)); }
        all.sort();
        let mut bst = BStarTree::new();
        for x in &adds { bst.add(*x); }
        for x in &dels { bst.remove(*x); }
        assert_eq!(walk(&bst),all);
        /* current */
        let mut w = bst.walker();
        assert_eq!(w.after(0),Some(5));
        assert_eq!(w.after(5),Some(5));
        assert_eq!(1,w.test_vec);
        /* next */
        let mut w = bst.walker();
        assert_eq!(w.after(0),Some(5));
        assert_eq!(w.after(6),Some(7));
        assert_eq!(6,w.test_vec);
        let mut w = bst.walker();
        assert_eq!(w.after(0),Some(5));
        assert_eq!(w.after(87),Some(87));
        assert_eq!(4,w.test_vec);
        let mut w = bst.walker();
        assert_eq!(w.after(0),Some(5));
        assert_eq!(w.after(88),Some(91));
        assert_eq!(4,w.test_vec);
        assert_eq!(w.after(92),Some(95));
        assert_eq!(6,w.test_vec);
    }

    #[test]
    fn bstar_none() {
        let mut bst = BStarTree::new();
        assert_eq!(vec![] as Vec<usize>,walk(&bst));
        bst.add(1);
        assert_eq!(vec![1],walk(&bst));
        bst.add(3);
        assert_eq!(vec![1,3],walk(&bst));
    }
}