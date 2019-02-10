/* Lexer for tánaiste assembly.
 * 
 * Errors are handled as if errors are tokens. Internally these are 
 * stored as state in the lexer and replace the nominal token on output.
 * Line numbers are also handled as state rather than arguments.
 */

use std::collections::HashMap;
use std::f64;
use std::str::{ CharIndices, FromStr };

use super::escapes::string_unescape;

/* Output tokens */
#[derive(Clone,Debug,PartialEq)]
pub enum Token {
    Code(String),
    Id(String),
    Str(String),
    Reg(usize),
    Chr(char),
    Num(f64),
    Error(String),
    EOF
}

pub struct Lexer<'input> {
    chars: CharIndices<'input>, /* character source */
    extra: Option<char>, /* One character pushback */
    error: Option<String>, /* Has an error occurred in this lex */
    sent_eof: bool, /* Have we ent EOF? */
    start: Option<usize>, /* Start position of current token */
    pos: usize /* Current position */
}

impl<'input> Lexer<'input> {
    pub fn new(input: &'input str) -> Self {
        Lexer {
            error: None,
            chars: input.char_indices(),
            extra: None,
            sent_eof: false,
            start: None,
            pos: 0
        }
    }
    
    /* get next character */
    fn more(&mut self) -> Option<char> {
        /* set start position if none set (first char of token) */
        if self.start.is_none() {
            let d = if self.extra.is_some() { 1 } else { 0 };
            self.start = Some(self.pos-d);
        }
        if self.extra.is_some() {
            /* char in push-back buffer */
            self.extra.take()
        } else {
            /* pull from stream (and update position) */
            let out = self.chars.next();
            if let Some((i,_)) = out { self.pos = i+1; }
            out.map(|s| s.1)
        }
    }

    /* utility method: retrieve all characters satisfying callback */
    fn get_while<F>(&mut self, mut f: F) -> String where F: FnMut(char) -> bool {
        let mut out = String::new();
        loop {
            let next = self.more();
            if let Some(c) = next {
                if f(c) {
                    /* got a good char */
                    out.push(c);
                    continue;
                } else {
                    /* got a bad char */
                    self.extra = Some(c);
                }
            }
            /* bad + no char reach here */
            break;
        }
        out
    }

    /* various things to get using get_while (above) */
    
    fn get_id(&mut self) -> String {
        self.get_while(|c| c.is_alphanumeric())
    }

    fn use_space(&mut self) {
        self.get_while(|c| c.is_whitespace());
    }

    fn use_line(&mut self) {
        self.get_while(|c| c != '\n');
        self.more();
    }

    fn get_number(&mut self, frac: bool) -> Option<f64> {
        let mut dot_ok = frac;
        let v = self.get_while(|c| {
            if c=='.' && dot_ok { dot_ok = false; return true; }            
            c.is_digit(10)
        });
        f64::from_str(&v).ok()
    }

    fn get_string(&mut self) -> String {
        let mut bs = false;
        let out = self.get_while(|c| {
            if c == '"' && !bs { bs = false; return false; }
            if bs { bs = false; }
            else if c == '\\' { bs = true; }
            true
        });
        if self.more().is_none() { /* trailing " */
            self.error = Some("EOF in string".to_string());
        }
        out
    }
    
    /* return the next token (raw, doesn't handle line numbers, errors,
     * etc).
     */
    fn token(&mut self) -> Token {
        /* for each character */
        loop {
            self.use_space();
            let next = self.more();
            /* number? */
            if let Some(v) = next {
                if v.is_digit(10) {
                    self.extra = next;
                    if let Some(v) = self.get_number(true) {                    
                        return Token::Num(v);
                    } else {
                        self.error = Some("Bad number".to_string());
                        return Token::Num(0.);
                    }
                }
            }
            match next {
                /* label */
                Some('.') => {
                    return Token::Id(self.get_id());
                },
                /* string */
                Some('"') => {
                    match string_unescape(&self.get_string()) {
                        Ok(s) => {
                            return Token::Str(s);
                        },
                        Err(s) => {
                            self.error = Some(format!("Bad string: {}",s));
                            return Token::EOF;
                        }
                    }
                },
                /* register */
                Some('#') => {
                    if let Some(v) = self.get_number(false) {
                        return Token::Reg(v as usize);
                    } else {
                        self.error = Some("Bad number".to_string());
                        return Token::Reg(0);
                    }
                },
                /* comment */
                Some(';') => { 
                    self.use_line();
                },
                /* other */
                Some(c) => {
                    if c.is_alphanumeric() {
                        self.extra = Some(c);
                        return Token::Code(self.get_id());
                    } else {
                        return Token::Chr(c);
                    }
                }
                /* eof */
                None => {
                    self.sent_eof = true;
                    return Token::EOF;
                }                
            }
        }
    }
}

impl<'input> Iterator for Lexer<'input> {
    type Item = (usize,Token,usize);

    fn next(&mut self) -> Option<Self::Item> {
        if self.sent_eof { return None; }
        self.use_space();
        self.start = None;
        let mut token = self.token();
        let d = if self.extra.is_some() { 1 } else { 0 };
        let end = self.pos-d;
        self.use_space();
        if let Some(ref text) = self.error {
            token = Token::Error(text.clone());
            self.sent_eof = true;
        }
        return Some((self.start.unwrap(),token,end));
    }
}

const L1 : &str = r#"
.hello:
AA "B \"CC",#6,#7,[4.5,5,6],#8 ; D E F ; G H I
X "Y Z"
"#;

lazy_static! {
    static ref L1T : Vec<(usize,Token,usize)> = vec!{
        (1, Token::Id("hello".to_string()), 7),
        (7, Token::Chr(':'), 8),
        (9, Token::Code("AA".to_string()), 11),
        (12, Token::Str("B \"CC".to_string()), 20),
        (20, Token::Chr(','), 21),
        (21, Token::Reg(6), 23),
        (23, Token::Chr(','), 24),
        (24, Token::Reg(7), 26),
        (26, Token::Chr(','), 27),
        (27, Token::Chr('['), 28),
        (28, Token::Num(4.5), 31),
        (31, Token::Chr(','), 32),
        (32, Token::Num(5.0), 33),
        (33, Token::Chr(','), 34),
        (34, Token::Num(6.0), 35),
        (35, Token::Chr(']'), 36),
        (36, Token::Chr(','), 37),
        (37, Token::Reg(8), 39),
        (40, Token::Code("X".to_string()), 57),
        (58, Token::Str("Y Z".to_string()), 63),
        (64, Token::EOF, 64)
    };
}

#[test]
fn lexer() {
    let x = Lexer::new(L1).into_iter();
    for (i,t) in x.enumerate() {
        assert_eq!(L1T[i],t);
    }
}
