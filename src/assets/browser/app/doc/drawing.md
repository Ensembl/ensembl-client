A Compositor manages a set of components.

A Component is a persistent object which is independently 
switch-on-and-off-able. It contains Shapes and ShapeContexts.

A Shape is a persistent primitive object which can be drawn to the
canvas.

A ShapeContext contains the values of uniforms for spot colours, etc.

A redraw begins with a call to into_objects of the Compositor. If a
redraw is required it then:

  1. calls clear_objects on ArenaPrograms to reset the data in the 
     programs. 
     
  2. calls apply_contexts to populate the program data with the uniforms
     (across runs).
     
  3. If a major redraw is needed, redraw_drwaings is called to create
     new canvases.
     
  4. redraw_objects is called to populate the objects with data.
  
  5. finalize_objects is called to finalize data in the programs.
  
# Redrawing drawings

A redraw takes place in the context of a DrawingSession. A
DrawingSession is preserved in a Compositor between redraws but is
rebuilt during a redraw_drawings.

During redraw_drawings, a DrawingSession is created and then 
redraw_component called for each Component. This calls draw_drawings on
the Component.

A DrawingSession creates and contains a OneCanvasMan which manages
allocating drawing on a single canvas.

Within draw_drawings in Component, each shape is iterated through and
get_artist called which optionally returns an Artist. These drawings
are added to the OneCanvasMan, stored in a vector and returned to the
DrawingSession. The DrawingSession stores the Shape->Option<Artist>
mapping as well.

# Redrawing objects

To redraw objects, the compositors iterate through the Components
calling into_objects on each. One argument passed is the drawing mapping
from the current DrawingSession.

Within the Component, each shape is iterated through. When a drawing is
available for that shape according to the drawings vector, it is used to
construct an Artwork for that shape and passed to it.
