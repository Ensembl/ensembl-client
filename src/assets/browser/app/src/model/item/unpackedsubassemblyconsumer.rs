use super::UnpackedSubassembly;

pub trait UnpackedSubassemblyConsumer {
    fn consume(&mut self, ui: UnpackedSubassembly);
}
