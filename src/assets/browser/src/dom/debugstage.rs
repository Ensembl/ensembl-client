pub const DEBUGSTAGE : &str = r##"
<div class="bpane-container">
    <div class="bpane-canv">
        <h1>Debug Mode</h1>
    </div>
    <div class="bpane-right">
        <div class="console">
            <select class="testcard">
                <option value="">- testcards -</option>
                <option value="polar">Polar Testcard</option>
                <option value="draw">Jank Testcard</option>
                <option value="onoff">On/Off Testcard</option>
                <option value="button">Button Testcard</option>
                <option value="text">Text Testcard</option>
                <option value="ruler">Ruler Testcard</option>
                <option value="leaf">Leaf Testcard</option>
            </select>
            <select class="folder"></select>
            <button class="mark">mark!</button>
            <button class="start">start</button>
            <pre class="content console2"></pre>
        </div>
        <div class="buttons"></div>
        <div class="managedcanvasholder"></div>
    </div>
</div>
"##;

pub const PLAINSTAGE : &str = r##"
<div class="bpane-container">
    <div class="bpane-canv">
    </div>
    <div class="managedcanvasholder"></div>
</div>
"##;

pub const DEBUGSTAGE_CSS : &str = r##"
html, body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.bpane-container {
    display: flex;
    height: 100%;
    width: 100%;
}
.bpane-container .bpane-right {
    width: 20%;
}

.bpane-container .console .content {
    height: 85%;
    overflow: scroll;
    border: 1px solid #ccc;
}

.bpane-container .managedcanvasholder {
    display: block;
    border: 2px solid red;
    display: inline-block;
    overflow: scroll;
    width: 100%;
}

.bpane-container, .bpane-container .bpane-canv canvas {
    height: 100%;
    width: 100%;
}

.bpane-container .bpane-canv {
    width: 80%;
    height: 100%;
}

.bpane-container .bpane-canv canvas {
    width: 100%;
    height: 100%;
}

#stage {
    height: 100%;
}

.bpane-container .console {
    height: 50%;
}
@import url('https://fonts.googleapis.com/css?family=Lato');
"##;

pub const PLAINSTAGE_CSS : &str = r##"
.bpane-container {
    overflow: hidden;
}

.bpane-container .managedcanvasholder {
    display: none;
}

.bpane-canv canvas {
  margin: 0;
  display:block;
}

.bpane-container, .bpane-container .bpane-canv {
    height: 100%;
    width: 100%;
}

@import url('https://fonts.googleapis.com/css?family=Lato');
"##;
