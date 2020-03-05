/*!

A simple crate to create global identity numbers for controlling equivalence of types as ersatz pointers.

You can also use `IdentityNumber` directly to generate non-global identity numbers for you. But that's probably using
a sledgehammer to crack a nut in most cases.

You can assume that you will always get a different number and that these numbers will be reasonably compact (in some
vague sense) compared to the number of allocated numbers. You may _not_ assume that the numbers strictly increase or
have no gaps or start at some value.

Not intended for use in anything other than equivalence control. For example, not intended for use as a key.

In future, other useful things related to equivalence control via identity numbers may be added to this crate, whatever
they might be.

```rust
use identitynumber::IdentityNumber;
let gen = IdentityNumber::new();
let a = gen.next();
let b = gen.next();
assert_ne!(a,b);
```

```rust

#[macro_use]
extern crate identitynumber;

identitynumber!(ids);
fn main() {
    let a = ids.next();
    let b = ids.next();
    assert_ne!(a,b);
}
```

```rust
#[macro_use]
extern crate identitynumber;

identitynumber!(IDS);

struct MyType {
    id: u64,
    more: u32
}

hashable!(MyType,id);

fn main() {
    let a = MyType { id: IDS.next(), more: 42 };
    let b = MyType { id: IDS.next(), more: 23 };
    assert!(a!=b);
}

```
*/

pub extern crate lazy_static;
#[doc(hidden)]
pub use lazy_static::*;

use std::sync::{ Arc, Mutex };

/// A generator of identity numbers.
pub struct IdentityNumber(Arc<Mutex<u64>>);

impl IdentityNumber {
    /// Create new generator of identity numbers.
    pub fn new() -> IdentityNumber {
        IdentityNumber(Arc::new(Mutex::new(0)))
    }

    /// Get next identity number.
    pub fn next(&self) -> u64 {
        let mut state = self.0.lock().unwrap();
        let out = *state;
        *state += 1;
        out
    }
}

/// Get unique identity unumber.
#[macro_export]
macro_rules! identitynumber {
    ($ident: ident) => {
        lazy_static! {
            static ref $ident : $crate::IdentityNumber = $crate::IdentityNumber::new();
        }    
    };
}

/// Implements `PartialEq`, `Eq`, and `Hash` for you on a field in your type.
#[macro_export]
macro_rules! hashable {
    ($type: ident, $field: ident) => {
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
