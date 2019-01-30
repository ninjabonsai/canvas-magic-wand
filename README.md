# canvas-magic-wand
set a color within an image to be transparent
## Installation and usage
```
npm install canvas-magic-wand
```
Then use it like this...
```javascript
import CanvasMagicWand from './canvas-magic-wand';

const img = document.body.querySelector( 'img' );
img.addEventListener( 'load', () => {
    // CanvasMagicWand.knockoutColor(
    //     img,
    //     targetColor = { r: 255, g: 255, b: 255 },
    //     tolerance = 10,
    //     edgeBlur = 4,
    //     edgeBrightness = 2,
    //     edgeContrast = 6
    // )
    img.src = CanvasMagicWand.knockoutColor( img, { r: 255, g: 255, b: 255 }, 10, 4, 2, 6 ).toDataURL();
}, { once: true } );
```
### Demo
https://codepen.io/ninjabonsai/pen/PVbppm
