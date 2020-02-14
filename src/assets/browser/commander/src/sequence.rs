use std::sync::{ Arc, Mutex };

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
            static ref $ident : crate::sequence::Sequence = crate::sequence::Sequence::new();
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
