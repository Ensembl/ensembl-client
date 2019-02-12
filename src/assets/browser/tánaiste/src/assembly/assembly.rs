use std::collections::HashMap;

use std::thread;
use std::time;

use core::{
    BinaryCode, Instruction, instruction_bundle_core, InstructionSet,
    instruction_bundle_test
};
use commands::{ ConstantI, DPrintI, HaltI };
use super::codegen::codegen;
use super::parser::parse_source;

pub fn assemble(is: &InstructionSet, code: &str) -> Result<BinaryCode,Vec<String>> {
    match parse_source(code) {
        Ok(src) => codegen(is,&src),
        Err(e) => Err(vec! { e })
    }
}

#[cfg(test)]
mod test {
    use std::collections::HashMap;

    use regex::Regex;
    use std::thread;
    use std::time;

    use core::{
        BinaryCode, Instruction, instruction_bundle_core, InstructionSet,
        instruction_bundle_test
    };
    use commands::{ ConstantI, DPrintI, HaltI };
    use runtime::PROCESS_CONFIG_DEFAULT;
    use test::TEST_CODE;
    use super::super::codegen::codegen;
    use super::super::parser::parse_source;
    use super::assemble;
    
    fn test_assemble(name: &str) -> Result<BinaryCode,Vec<String>> {
        let is = InstructionSet::new(vec! {
            instruction_bundle_core(),
            instruction_bundle_test()
        });
        assemble(&is,&TEST_CODE[name])
    }

    #[test]
    fn smoke() {
        let bin = test_assemble("smoke").ok().unwrap();
        let mut proc = bin.exec(Some("start"),None,&PROCESS_CONFIG_DEFAULT).ok().unwrap();
        proc.run();
        while !proc.halted() {
            proc.run();
            thread::sleep(time::Duration::from_millis(100));
        }
        assert_eq!(proc.get_reg(1),"\"hello, tánaiste!\"");
    }

    #[test]
    fn parse_error_1() {
        let e = test_assemble("parse-error-1").err().unwrap();
        assert_eq!("Bad string: bad utf8: invalid utf-8 sequence of 1 bytes from index 7 at line 1",e.join("\n"));
    }

    #[test]
    fn parse_error_2() {
        let e = test_assemble("parse-error-2").err().unwrap();
        assert_eq!("Bad instruction Chr(\':\') at line 2",e.join("\n"));
    }

    #[test]
    fn inst_error_1() {
        let e = test_assemble("inst-error-1").err().unwrap();
        assert_eq!("Unknown command \'unknown\'",e.join("\n"));
    }

    #[test]
    fn inst_error_2() {
        let e = test_assemble("inst-error-2").err().unwrap();
        assert_eq!("Incorrect arguments [Str(\"hello\")] vs [Reg]",e.join("\n"));
    }
}
