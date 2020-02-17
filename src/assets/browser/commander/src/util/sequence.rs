use std::sync::{ Arc, Mutex };

/* A common pattern in this crate is a globally unique source of a sequence of integers,
 * mainly for unique IDs. This file provides this through the sequence! and hashable!
 * macros. lazy_static is used to create a Sequence object.
 */

pub(crate) struct Sequence(Arc<Mutex<u64>>);

impl Sequence {
    pub(crate) fn new() -> Sequence {
        Sequence(Arc::new(Mutex::new(0)))
    }

    pub(crate) fn next(&self) -> u64 {
        let mut state = self.0.lock().unwrap();
        let out = *state;
        *state += 1;
        out
    }
}

macro_rules! sequence {
    ($ident: ident) => {
        lazy_static! {
            static ref $ident : crate::util::sequence::Sequence = crate::util::sequence::Sequence::new();
        }    
    };
}

macro_rules! hashable {
    ($sequence: ident,$type: ident, $field: ident) => {
        impl PartialEq for $type {
            fn eq(&self, other: &Self) -> bool {
                self.$field == other.$field
            }
        }

        impl std::hash::Hash for $type {
            fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
                self.$field.hash(state);
            }
        }

        impl Eq for $type {}
    };
}
