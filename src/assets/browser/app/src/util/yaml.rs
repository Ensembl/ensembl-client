use yaml_rust::yaml::Yaml;
use yaml_rust::YamlLoader;

pub fn to_string(val: &Yaml) -> Option<String> {
    match val {
        Yaml::String(ref v) => {
            return Some(v.clone())
        },
        _ => ()
    }
    None
}

pub fn to_float(val: &Yaml) -> Option<f64> {
    match val {
        Yaml::Integer(ref v) => {
            return Some(*v as f64)
        },
        Yaml::Real(_) => {
            return val.as_f64()
        },
        Yaml::String(_) => {
            return val.as_f64()
        },
        _ => ()
    }
    None
}

pub fn hash_key_yaml<'a>(yaml: &'a Yaml, key: &str) -> Option<&'a Yaml> {
    if let Yaml::Hash(ref d) = yaml {
        d.get(&Yaml::String(key.to_string()))
    } else {
        None
    }
}

pub fn hash_key_string(yaml: &Yaml, key: &str) -> Option<String> {
    if let Yaml::Hash(ref d) = yaml {
        let val = d.get(&Yaml::String(key.to_string()));
        val.and_then(|v| to_string(v))
    } else {
        None
    }
}

pub fn hash_key_float(yaml: &Yaml, key: &str) -> Option<f64> {
    if let Yaml::Hash(ref d) = yaml {
        let val = d.get(&Yaml::String(key.to_string()));
        val.and_then(|v| to_float(v))
    } else {
        None
    }
}

pub fn to_bool(val: &Yaml) -> bool {
    match val {
        Yaml::Integer(v) => *v != 0,
        Yaml::Real(_) => val.as_f64().unwrap() != 0.,
        Yaml::String(v) => v != "",
        Yaml::Boolean(v) => *v,
        _ => false
    }
}

pub fn hash_key_bool(yaml: &Yaml, key: &str) -> bool {
    if let Yaml::Hash(ref d) = yaml {
        let val = d.get(&Yaml::String(key.to_string()));
        val.map(|v| to_bool(v)).unwrap_or(false)
    } else {
        false
    }
}
