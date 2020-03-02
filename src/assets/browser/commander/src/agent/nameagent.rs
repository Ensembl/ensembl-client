use hashbrown::HashSet;
use crate::corefutures::namedfuture::NamedWait;

/* NameAgent is the Agent mixin responsible for naming the task */

pub(crate) struct NameAgent {
    name: String,
    named_waits: HashSet<NamedWait>
}

impl NameAgent {
    pub(super) fn new(name: &str) -> NameAgent {
        NameAgent {
            name: name.to_string(),
            named_waits: HashSet::new(),
        }
    }

    pub(crate) fn get_name(&self) -> String {
        self.name.to_string()
    }

    pub(super) fn set_name(&mut self, name: &str) {
        self.name = name.to_string();
    }

    pub(crate) fn push_wait(&mut self, wait: &NamedWait) {
        self.named_waits.insert(wait.clone());
    }

    pub(crate) fn pop_wait(&mut self, wait: &NamedWait) {
        self.named_waits.remove(wait);
    }

    pub(crate) fn get_waits(&self) -> Vec<String> {
        self.named_waits.iter().map(|x| x.get_name().to_string()).collect()
    }
}
