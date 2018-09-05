pub const STAGE : &str = r##"
<div id="console">hello</div>
<div id="managedcanvasholder"></div>
<canvas id="glcanvas"></canvas>
"##;

pub const STAGE_CSS : &str = r##"
html, body, canvas {
    margin: 0px;
    padding: 0px;
    height: 100%;
}
#managedcanvasholder {
    display: none;
}
#managedcanvasholder.debug {
    display: block;
}
#managedcanvasholder.debug canvas {
    border: 2px solid red;
    display: inline-block;
}
#glcanvas.debug {
    border: 2px solid green;
    width: auto;
    height: auto;
}
#glcanvas {
    width: 100%;
    height: 100%;
}
#console {
    border: 2px solid blue;
}
@import url('https://fonts.googleapis.com/css?family=Roboto');
"##;
