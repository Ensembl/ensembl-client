use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use composit::SourceResponse;
use drawing::{ DrawingSpec, FCFont, FontVariety, text_texture };
use tácode::{ TáContext, TáTask };
use types::{ Colour };

fn text(txx: &mut Vec<DrawingSpec>, string: &String) -> usize {
    let font = FCFont::new(12,"Lato",FontVariety::Bold);
    let tx = text_texture(string,&font,&Colour(192,192,192),&Colour(255,255,255));
    txx.push(tx);
    txx.len()-1
}

fn texts(tx: &mut Vec<DrawingSpec>, strings: &String, lens: &Vec<f64>) -> Vec<f64> {
    let mut out = Vec::<f64>::new();
    let chars : Vec<char> = strings.chars().collect();
    let mut start = 0;
    for len in lens {
        let len = *len as usize;
        let s = chars[start..start+len].iter().collect();
        start += len;
        out.push(text(tx,&s) as f64);
    }
    out
}

// text #target #texts #sizes
pub struct Text(TáContext,usize,usize,usize);

impl Command for Text {
    #[allow(irrefutable_let_patterns)]
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(_,_,ref mut tx) = task {
                let regs = rt.registers();
                regs.get(self.2).as_string(|strings| {                
                    regs.get(self.3).as_floats(|lens| {
                        regs.set(self.1,Value::new_from_float(texts(tx,strings,lens)));
                    });
                });
            }
        });
        return 1;
    }
}

pub struct TextI(pub TáContext);

impl Instruction for TextI {
    fn signature(&self) -> Signature { Signature::new("text","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Text(self.0.clone(),args[0].reg(),args[1].reg(),
                      args[2].reg()))
    }
}
