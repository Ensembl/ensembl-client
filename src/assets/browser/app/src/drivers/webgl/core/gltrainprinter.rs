use model::stage::Screen;
use model::train::Train;
use model::zmenu::ZMenuLeafSet;
use super::glcamera::GLCamera;
use super::glprinter::GLPrinter;

pub(super) struct GLTrainPrinter<'a> {
    train: &'a Option<Train>,
    camera: Option<GLCamera>
}

impl <'a> GLTrainPrinter<'a> {
    pub(super) fn new(train: &'a Option<Train>, prop: f32, screen: &Screen) -> GLTrainPrinter<'a> {
        let camera = train.as_ref().map(|train| GLCamera::new(prop,screen,train.get_position()));
        GLTrainPrinter { train, camera }
    }

    pub(super) fn camera(&self, screen: &Screen) -> &Option<GLCamera> { &self.camera }

    pub(super) fn maybe_redraw(&self, printer: &mut GLPrinter, zmls: &mut ZMenuLeafSet) {
        self.train.as_ref().map(|train|
            train.redraw_where_needed(printer,zmls)
        );
    }

    pub(super) fn print(&self, printer: &mut GLPrinter) {
        self.train.as_ref().map(|train|
            printer.print_train(train,&self.camera.as_ref().unwrap())
        );
    }
}
