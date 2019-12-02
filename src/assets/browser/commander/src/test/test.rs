use std::sync::{ Arc, Mutex };
use crate::Commander;
use crate::test::testintegration::TestIntegration;

#[test]
pub fn test_testintegration() {
    let mut itgn = Arc::new(Mutex::new(TestIntegration::new()));
    let cmdr1 = Commander::new(itgn.clone());
    let cmdr2 = Commander::new(itgn.clone());
    
}
