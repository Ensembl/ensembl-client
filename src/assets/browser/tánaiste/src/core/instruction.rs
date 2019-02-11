use assembly::{ Argument, Signature };
use super::command::Command;

pub trait Instruction {
    fn signature(&self) -> Signature;
    fn build(&self, args: &Vec<Argument>) -> Box<Command>;
}
