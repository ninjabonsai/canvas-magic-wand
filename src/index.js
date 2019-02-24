function setImageData( imageData, targetColor, newColorSelected, newColorUnselected, tolerance ) {
    const currentPixelColor = { r: null, g: null, b: null };
    const pixels = imageData.data;
    
    const isMask = (
        Math.abs( newColorSelected.r - newColorUnselected.r ) +
        Math.abs( newColorSelected.g - newColorUnselected.g ) +
        Math.abs( newColorSelected.b - newColorUnselected.b )
    ) / 3 === 255;
    
    // loop through imageData
    for ( let i = 0, n = imageData.data.length; i < n; i += 4 ) {
        currentPixelColor.r = imageData.data[ i ];
        currentPixelColor.g = imageData.data[ i + 1 ];
        currentPixelColor.b = imageData.data[ i + 2 ];
        
        const diff = (
            Math.abs( currentPixelColor.r - targetColor.r ) +
            Math.abs( currentPixelColor.g - targetColor.g ) +
            Math.abs( currentPixelColor.b - targetColor.b )
        ) / 3;

        if ( diff > tolerance ) {
            pixels[ i ] = newColorUnselected.r;
            pixels[ i + 1 ] = newColorUnselected.g;
            pixels[ i + 2 ] = newColorUnselected.b;
            pixels[ i + 3 ] = newColorSelected.a === 0 && isMask ? diff : newColorUnselected.a;
        } else {
            pixels[ i ] = newColorSelected.r;
            pixels[ i + 1 ] = newColorSelected.g;
            pixels[ i + 2 ] = newColorSelected.b;
            pixels[ i + 3 ] = newColorSelected.a;
        }
    }
}

// the following is from https://stackoverflow.com/a/5624139/2630316
function hexToRgb( hex ) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace( shorthandRegex, function( m, r, g, b ) {
        return r + r + g + g + b + b;
    } );

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
    return result ? {
        r: parseInt( result[1], 16 ),
        g: parseInt( result[2], 16 ),
        b: parseInt( result[3], 16 )
    } : null;
}

function loadImage ( url ) {
    return new Promise( ( resolve, reject ) => {
        const img = new Image();
        img.src = url;
        img.addEventListener( 'load', () => resolve( img ) );
        img.addEventListener( 'error', () => {
            reject( new Error( `Failed to load image ${ url }` ) );
        } );
    } );
}

const CanvasMagicWand = {
    async knockoutColor ( config = {} ) {
        let {
            img = null,
        } = config;
        
        const {
            src = null,
            targetColor = '#fff',
            replacementColor = '#ffffff00',
            tolerance = 10,
            edgeBlur = 4,
            edgeBrightness = 2,
            edgeContrast = 6,
            debugMode = false,
        } = config;
        
        if ( src !== null || ( img !== null && img.naturalWidth === 0 ) ) {
            if ( img === null && typeof src !== 'string' ) {
                throw Error( 'src must be a string' );
            }
            
            try {
                img = await loadImage( src || img.src );
            } catch ( err ) {
                console.error( err );
            }
        } else if ( !( img instanceof Image ) ) {
            throw Error( 'must provide a HTMLImageElement or a String representing the image\'s src attribute' );
        }
        
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        
        const newColorSelected = { r: 255, g: 255, b: 255, a: 255 };
        const newColorUnselected = { r: 0, g: 0, b: 0, a: 255 };

        const canvas1 = document.createElement( 'canvas' );
        canvas1.width = w;
        canvas1.height = h;

        let ctx = canvas1.getContext( '2d' );
        ctx.drawImage( img, 0, 0 );

        let imageData = ctx.getImageData( 0, 0, w, h );

        setImageData( imageData, hexToRgb( targetColor ), newColorSelected, newColorUnselected, tolerance );
        ctx.putImageData( imageData, 0, 0 );

        const canvas2 = document.createElement( 'canvas' );
        canvas2.width = canvas1.width;
        canvas2.height = canvas1.height;
        ctx = canvas2.getContext( '2d' );
        ctx.filter = `blur( ${ edgeBlur }px ) brightness( ${ edgeBrightness } ) contrast( ${ edgeContrast } )`;
        ctx.drawImage( canvas1, 0, 0 );
        
        const canvas3 = document.createElement( 'canvas' );
        canvas3.width = canvas1.width;
        canvas3.height = canvas1.height;
        ctx = canvas3.getContext( '2d' );
        ctx.drawImage( canvas2, 0, 0 );
        imageData = ctx.getImageData( 0, 0, w, h );
        setImageData( imageData, { r:255, g:255, b:255 }, { ...newColorSelected, a: 0 }, newColorUnselected, 10 );
        ctx.putImageData( imageData, 0, 0 );

        const canvasDisplay = document.createElement( 'canvas' );
        canvasDisplay.width = w;
        canvasDisplay.height = h;
        ctx = canvasDisplay.getContext( '2d' );
        ctx.drawImage( canvas3, 0, 0 );
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage( img, 0, 0 );
        
        const canvasReplacementColor = document.createElement( 'canvas' );
        canvasReplacementColor.width = w;
        canvasReplacementColor.height = h;
        ctx = canvasReplacementColor.getContext( '2d' );
        ctx.fillStyle = debugMode ? '#fff' : replacementColor;
        ctx.fillRect( 0, 0, w, h );
        ctx.drawImage( debugMode ? canvas2 : canvasDisplay, 0, 0 );
        
        img = new Image();
        img.src = canvasReplacementColor.toDataURL();
        
        return img;
    },
};

export default CanvasMagicWand;