# canvas-magic-wand
set a color within an image to be transparent
## Installation and usage
```
npm install canvas-magic-wand
```
Then use it like this...
```javascript
import CanvasMagicWand from 'canvas-magic-wand';

CanvasMagicWand.knockoutColor( {
    // img,
    src: 'image.jpg',
    // targetColor: `#ffffff`,
    // replacementColor: '#ffffff00',
    // tolerance: 10,
    // edgeBlur: 4,
    // edgeBrightness: 2,
    // edgeContrast: 6,
    // debugMode: false,
} ).then( ( img ) => {
    document.body.appendChild( img );
} );

```

or instead of passing in a src attribute pass in an Image...

```javascript
import CanvasMagicWand from 'canvas-magic-wand';

const img = document.querySelector( 'img' );

CanvasMagicWand.knockoutColor( {
    img,
    // src
    // targetColor: `#ffffff`,
    // replacementColor: '#ffffff00',
    // tolerance: 10,
    // edgeBlur: 4,
    // edgeBrightness: 2,
    // edgeContrast: 6,
    // debugMode: false,
} ).then( ( { src } ) => {
    img.src = src );
} );
```

### Config options
Only options 1 or 2 are required.
* `img` - an HTMLImageElement  
* `src` - path to an image file
* `targetColor` - RGB hex value representing the color you wish to remove or replace.
* `replacementColor` - RGBA hex value to use as a replacement. This value defaults to transparent.
* `tolerance` - how much each color in the image can differ from the targetColor and still be selected. Higher values will select more colors.

These final options relate to how the mask is applied to the image. The mask that's applied internally looks like a Photoshop mask where white areas are selected and black areas are not, grey areas are in between. These options control the transition area between selected and unselected.
* `edgeBlur` - how much to blur the selection edge.
* `edgeBrightness` - how much to brighten the edges of the mask.
* `edgeContrast` - how much contrast to apply to the edges of the mask.
* `debugMode` - show the selection mask instead of the image.

### Demo
https://codepen.io/ninjabonsai/pen/PVbppm
