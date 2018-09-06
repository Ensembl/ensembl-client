use domutil;

const STAGE : &str = r##"
<div id="bpane-container">
    <div id="bpane-canv">
        <canvas id="glcanvas"></canvas>
    </div>
    <div id="bpane-right">
        <div id="console">hello</div>
        <div id="managedcanvasholder"></div>
    </div>
</div>
"##;

const STAGE_CSS : &str = r##"
html, body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
#bpane-container {
    display: flex;
    height: 100%;
}
#bpane-right {
    width: 20%;
}

#managedcanvasholder {
    display: block;
    border: 2px solid red;
    display: inline-block;
    overflow: scroll;
    width: 100%;
}

#bpane-canv canvas {
    height: 100%;
    width: 100%;
}

#bpane-canv {
    width: 80%;
    height: 100%;
}

#bpane-canv canvas {
    width: 100%;
    height: 100%;
}

#stage {
    height: 100%;
}

#console {
    border: 2px solid blue;
}
@import url('https://fonts.googleapis.com/css?family=Roboto');
"##;

pub fn setup_stage_debug() {
    domutil::inner_html(&domutil::query_select("#stage"),STAGE);
    let el = domutil::append_element(&domutil::query_select("head"),"style");
    domutil::inner_html(&el,STAGE_CSS);
}
