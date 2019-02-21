/* When specifying a shape type, the metadata is structured as follows:
 * [broad-type,colour-type,...]
 * 
 * Broad-type is one of:
 *   0 = stretch rectangle;
 *   1 = non-stretch rectangle;
 *   2 = underlay non-stretch rectangle (temporary).
 * 
 * colour-type is one of colour = 0; spot = 1; texture = 2.
 * 
 * For broad-type stretch this is all the metadata. The aux axes are
 * the deltas between the sea-end of the two anchors. The ship-ends of
 * anchors for stretch types are fixed.
 * 
 * For non-stretch types there follows two values specifying the sea-end
 * of each axis of its anchor. These can have three values for each axis
 * for its co-ordinate basis:
 * 
 * 0 = page (x=genomic, y=track)
 * 1 = minimum (left/top of screen)
 * 2 = maximum (right/bottom of screen)
 * 
 * The shape code distinguishes genomic- from screen-anchored, so 
 * whether the above is zero/non-zero for each axis determines the 
 * actual API call:
 * 
 * (0,0) = pin; (1,0) = tape; (0,1) = page; (1,1) = fix.
 * 
 * Textured rectangles, both stretch and non-stretch (and, in future
 * non-rectangle types) then have an offset to the ship-end of the
 * anchor in pixels, (x,y) and two sea-end anchor axis specifiers with
 * the values:
 * 
 * 0 = middle
 * 1 = min (left/top)
 * 2 = max (right/bot)
 * 
 * Texture types then have two bytes specifying texture scale.
 * 
 * Examples:
 * 
 * [0,0] : stretch_rectangle([x,y],ColourSpec::Colour(c))
 * [0,1] : stretch_rectangle([x,y],ColourSpec::Spot(c))
 * [0,2] : stretch_texture(tx,[x,y])
 * [1,1,0,0] : pin_rectangle([x,y],ColourSpec::Spot(c))
 * [1,2,0,0,A,B,0,0,1,1] :
 *             pin_texture(tx,[x,y],[A,B],[1,1].MIDDLE)
 */

use program::PTGeom;
use shape::RectSpec;

pub struct RectBuilder {
    pt: PTGeom
}

pub enum ShapeMeta {
    Rectangle(RectBuilder)
}

fn new_geom(sea_ax_x: i32, sea_ax_y: i32) -> PTGeom {
    match (sea_ax_x != 0,sea_ax_y != 0) {
        (false,false) => PTGeom::Pin,
        (false,true) => PTGeom::Page,
        (true,false) => PTGeom::Tape,
        (true,true) => PTGeom::Fix
    }
}

fn new_rectangle(broad_type: i32, colour_type:i32, 
                 meta_iter: &mut Iterator<Item=&f64>) -> Option<RectSpec> {
    let sea_ax_x = *meta_iter.next().unwrap() as i32;
    let sea_ax_y = *meta_iter.next().unwrap() as i32;
                     
    let geom = new_geom(sea_ax_x,sea_ax_y);
    None
}

impl ShapeMeta {
    pub fn new(meta: &Vec<f64>) -> Option<ShapeMeta> {
        let mut meta_iter = meta.iter();
        let broad_type = *meta_iter.next().unwrap() as i32;
        let colour_type = *meta_iter.next().unwrap() as i32;
        if colour_type == 0 || colour_type == 1 {
            new_rectangle(broad_type,colour_type,&mut meta_iter)
                .map(|x| ShapeMeta::Rectangle(x))
        } else {
            None
        }
    }
}
