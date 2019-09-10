#[derive(Debug)]
pub enum AdLib {
    Never,
    AsRequired,
    Always
}

impl AdLib {
    pub fn go(&self, required: bool) -> bool {
        match self {
            AdLib::Never => false,
            AdLib::AsRequired => required,
            AdLib::Always => true
        }
    }
}

pub enum AsyncValue<T> {
    Unknown,
    Pending,
    Known(T)
}

impl<T> AsyncValue<T> {
    pub fn new(value: Option<T>) -> AsyncValue<T> {
        if let Some(value) = value {
            AsyncValue::Known(value)
        } else {
            AsyncValue::Unknown
        }
    }

    pub fn get(&self) -> Option<&T> {
        match self {
            AsyncValue::Known(value) => Some(value),
            _ => None
        }
    }

    pub fn invalidate(&mut self) {
        *self = AsyncValue::Unknown;
    }

    pub fn investigate(&mut self) -> bool {
        if let AsyncValue::Unknown = self {
            *self = AsyncValue::Pending;
            true
        } else {
            false
        }
    }

    pub fn set(&mut self, value: T) {
        *self = AsyncValue::Known(value)
    }
}

pub enum Awaiting<K,V> where K: PartialEq {
    No,
    Awaiting(K),
    Yes(K,V)
}

impl<K,V> Awaiting<K,V> where K: PartialEq {
    pub fn new() -> Awaiting<K,V> {
        Awaiting::No
    }

    pub fn await(&mut self, key: K) {
        if let Awaiting::Yes(k,_) = self {
            if k == &key { return; }
        }
        *self = Awaiting::Awaiting(key);
    }

    pub fn notify(&mut self, key: K, value: V) {
        if let Awaiting::Awaiting(k) = self {
            if k == &key {
                *self = Awaiting::Yes(key,value);
            }
        }
    }

    pub fn get(&self) -> Option<&V> {
        if let Awaiting::Yes(_,v) = self {
            Some(v)
        } else {
            None
        }
    }
}
