# scroll-journey

A scrolling framework that allows you to quickly add animated elements to a page.

## Elements

### scroll-journey

The main scroll journey wrapper. Only add one these to the page.

### scroll-section

These are distinct full-screen views that can animate in and out and contain other child elements.

#### Properties:

**overlap** - How much of the previous section to overlap by in scroll distance

duration - how long (how far the user scrolls) we show the section for

**in** - the animation in type fade, zoom etc..
**out** - the animation out type
**in-duration** - how long the in animation lasts
**out-duration** - how long the out animation lasts

### scroll-element

Animated child elements that live inside a scroll section

####P roperties:

**in** - the animation in type fade, zoom etc..
**out** - the animation out type
**keyframes** - a comma seperated list of 4 keyframes for the element e.g. "10,17,23,25". These represent a percentage value of the duration of the parent scroll-section. The 4 values map to the element animation-in start, animation-in end, animation-out start and animation-out end.
