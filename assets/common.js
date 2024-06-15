export const FREE_SPACE = 12;
export const COLORS = {
    'red': {
        'button': '#AC1212',
        'background': '#4A0D0D',
        'border': '#330707',
        'neon-primary': '#FF6F6F',
        'neon-secondary': '#CC4949'
    },
    'orange': {
        'button': '#F37310',
        'background': '#4A2600',
        'border': '#331A00',
        'neon-primary': '#FFA14A',
        'neon-secondary': '#CC7A33'
    },
    'yellow': {
        'button': '#EBC621',
        'background': '#4A4300',
        'border': '#332E00',
        'neon-primary': '#FFEB75',
        'neon-secondary': '#CCB552'
    },
    'green': {
        'button': '#4E9A26',
        'background': '#143300',
        'border': '#0D2600',
        'neon-primary': '#85E085',
        'neon-secondary': '#66B266'
    },
    'blue': {
        'button': '#1A5AB6',
        'background': '#0D2A52',
        'border': '#081C36',
        'neon-primary': '#4DA3FF',
        'neon-secondary': '#357ACC'
    },
    'teal': {
        'button': '#329A97',
        'background': '#143347',
        'border': '#0d253b',
        'neon-primary': '#abfafe',
        'neon-secondary': '#3d8ec2'
    },
    'purple': {
        'button': '#722B92',
        'background': '#2F0D33',
        'border': '#200926',
        'neon-primary': '#C583D6',
        'neon-secondary': '#9E67AC'
    },
    'pink': {
        'button': '#EA64A3',
        'background': '#4A0D26',
        'border': '#33071A',
        'neon-primary': '#FF9CCF',
        'neon-secondary': '#CC769F'
    },
};

export let selectedColor;

export function setSelectedColor(color) {
    selectedColor = color;
}

export function changeTheme(color) {
    var ua = window.navigator.userAgent;
    var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

    // Set the background
    document.querySelector('html').style.backgroundColor = color['background'];
    // And theme color
    document.querySelector('meta[name="theme-color"]').setAttribute('content', color['background']);
    // Submit button
    document.querySelector('#create').style.backgroundColor = color['neon-primary'];
    // Marquee border (TODO: need to make this responsive to the size)
    document.querySelector('.marquee .center').style.border = '20px solid ' + color['border'];
    // Set neon title
    let marqueeTitle = document.querySelector('.marquee .title');
    marqueeTitle.style.webkitTextStrokeColor = color['neon-primary'];
    marqueeTitle.style.textShadow = 
        '0 0 5px ' + color['neon-primary'] + (iOSSafari ? 'A3' : 'FF') + ', ' + 
        '-3px 3px 0px ' + color['neon-secondary']+ (iOSSafari ? 'A3' : 'FF') + ', ' + 
        '-4px 4px 2px ' + color['neon-secondary'] + (iOSSafari ? 'A3' : 'FF');
    // Dots
    document.querySelectorAll('.marquee .dot').forEach(dot => {
        dot.style.backgroundColor = color['neon-primary'];
        dot.style.boxShadow = '0 0 10px ' + color['neon-primary'] + ', 0 0 20px ' + color['neon-primary'] + ', 0 0 30px ' + color['neon-primary'];

        // Do a few rotations
        dot.style.animationIterationCount = 3;
        let tempAnimation = dot.style.animation;
        dot.style.animation = 'none';
        dot.offsetHeight; /* trigger reflow */
        dot.style.animation = tempAnimation;
    });
}

export function setupMarquee() {
    // Constants
    let size = 10;
    let margin = 5;
    // Marquee dimensions in # of dots
    let width = 20;
    let height = 8;
    // Number of concurrent loops that should be going on
    let loopSize = 4; // width * 2 + height * 2 - 4 must be divisible by this
    let loopDuration = 0.5;

    var marqueeCenter = document.querySelector('.marquee .center');
    marqueeCenter.style.width = (size * width + margin * (width + 1)) - 4 * size + 'px';
    marqueeCenter.style.height = (size * height + margin * (height + 1)) - 4 * size + 'px';
    marqueeCenter.style.border = size * 2 + 'px solid ' + selectedColor['border']; 

    function createDot(c) {
        let newDot = document.createElement('div');
        newDot.classList.add('dot');
        newDot.style.width = size + 'px';
        newDot.style.height = size + 'px';
        newDot.style.backgroundColor = selectedColor['neon-primary'];
        newDot.style.boxShadow = '0 0 10px ' + selectedColor['neon-primary'] + ', 0 0 20px ' + selectedColor['neon-primary'] + ', 0 0 30px ' + selectedColor['neon-primary'];
        newDot.style.animation = 'blink ' + loopDuration + 's';
        newDot.style.animationIterationCount = 12;
        newDot.style.animationDelay = ((c % loopSize) * loopDuration / loopSize) - loopDuration + 's';
        newDot.dataset.index = c;
        return newDot;
    }

    // Set up the marquee
    let counter = 0;
    // Top row
    for (let i = 0; i < width; i++) {
        let newDot = createDot(counter);
        newDot.style.top = '-15px';
        newDot.style.left = -15 + counter * (size + margin) + 'px';
        marqueeCenter.append(newDot);
        counter++;
    }
    // Right row
    for (let i = 1; i < height; i++) {
        let newDot = createDot(counter);
        newDot.style.right = '-15px';
        newDot.style.top = -15 + i * (size + margin) + 'px';
        marqueeCenter.append(newDot);
        counter++;
    }
    // Bottom row
    for (let i = width - 1; i > 0; i--) {
        let newDot = createDot(counter + i - 1);
        newDot.style.bottom = '-15px';
        newDot.style.right = -15 + i * (size + margin) + 'px';
        marqueeCenter.append(newDot);
    }
    counter += width;
    // Left row
    for (let i = height - 2; i > 0; i--) {
        let newDot = createDot(counter + i - 2);
        newDot.style.left = '-15px';
        newDot.style.bottom = -15 + i * (size + margin) + 'px';
        marqueeCenter.append(newDot);
    }
}