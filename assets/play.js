const FREE_SPACE = 12;
const COLORS = {
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

let selectedColor;

// An array of { text: 'stuff', tagIndex: 2 }
var selectedTags = [];

function getCell(num) {
    return document.querySelectorAll('.cell')[num];
}

function resetCells() {
    var cells = document.querySelectorAll('.bingo .cell');
    for (let i = 0; i < cells.length; i++) {
        // Clear all of the text of the existing cells
        if (i !== FREE_SPACE) {
            let p = cells[i].querySelector('p');
            if (p) {
                p.remove();
            }
        }
        // Modify the 'selected' color
        let selectedBackground = cells[i].querySelector('.selected-background');
        if (selectedBackground) {
            selectedBackground.style.background = selectedColor['button'];
        }
    }

    // Iterate over the selected tags
    let tag, cell;
    for (let i = 0; i < selectedTags.length; i++) {
        // If the tag is in the list, then insert it
        tag = selectedTags[i] ?? null;
        if (tag) {
            if (i >= FREE_SPACE) {
                cell = getCell(i + 1);
            } else {
                cell = getCell(i);
            }
            cell.innerHTML += '<p>' + tag['text'] + '</p>';
            cell.setAttribute('index', tag['tagIndex'].toString());
        }
    }
}

function changeTheme(color) {
    // Set the background
    document.querySelector('html').style.backgroundColor = color['background'];
    // Marquee border (TODO: need to make this responsive to the size)
    document.querySelector('.marquee .center').style.border = '20px solid ' + color['border'];
    // Set neon title
    let marqueeTitle = document.querySelector('.marquee .title');
    // -webkit-text-stroke-color
    marqueeTitle.style.webkitTextStrokeColor = color['neon-primary'];
    marqueeTitle.style.textShadow = '0 0 5px ' + color['neon-primary'] + ', -3px 3px 0px ' + color['neon-secondary'] + ', -4px 4px 2px ' + color['neon-secondary'];
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

function bingo(element) {
    // Set off confetti
    const confetti = window.confetti;

    let count = 300;
    let bounding = element.getBoundingClientRect();
    var defaults = {
        origin: { 
            x: (bounding.left + bounding.width / 2) / window.innerWidth,
            y: (bounding.top + bounding.height / 2) / window.innerHeight,
        }
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 60,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
    // Flash alternating
    let oldAnimations = [];
    document.querySelectorAll('.marquee .dot').forEach(dot => {
        let oldAnimation = dot.style.animation;
        oldAnimations.push([dot, oldAnimation, dot.style.animationDelay]);
        
        dot.style.animation = 'none';
        dot.offsetHeight; /* trigger reflow */
        dot.style.animation = 'blink 0.5s infinite';
        if (dot.dataset.index % 2 == 0) {
            dot.style.animationDelay = '0s';
        } else {
            dot.style.animationDelay = '-0.25s';
        }
    });
    // Reset the animations to normal
    setTimeout(() => {
        oldAnimations.forEach(c => {
            c[0].style.animation = c[1];
            c[0].style.animationDelay = c[2];
            c[0].style.animationIterationCount = 7;
        })
    }, 3000);
}

window.onload = () => {
    // If you're displaying an existing bingo board, then load it
    selectedTags = startingTags;
    resetCells();

    // Set up the color selector
    let hasChosen = false;
    const colorHolder = document.querySelector('.colors');
    for (let [colorName, color] of Object.entries(COLORS)) {
        let newColor = document.createElement('div');
        newColor.style.backgroundColor = color['button'];
        newColor.setAttribute('name', colorName);
        // Select the first color
        if (!hasChosen) {
            hasChosen = true;
            newColor.classList.add('selected');
            selectedColor = color;
            changeTheme(color);
        }

        newColor.addEventListener('click', function () {
            // Remove 'selected' from all other colors
            colorHolder.querySelectorAll('div').forEach(function (colorCell) {
                colorCell.classList.remove('selected');
            });
            // Add it to this one
            this.classList.add('selected');
            // Actually set it as the color
            selectedColor = color;
            // Call resetCells to make the cells use the new color
            resetCells();
            // Change themes
            changeTheme(color);
        });

        colorHolder.appendChild(newColor);
    }

    // Handle selecting cells in a formal bingo board
    let cells = document.querySelectorAll('.cell');
    cells.forEach(function (element, index) {
        element.addEventListener('click', function () {
            this.classList.toggle('fulfilled');

            let selectedBackground = element.querySelector('.selected-background');
            if (selectedBackground) {
                selectedBackground.remove();
            } else {
                let div = document.createElement('div');
                div.className = 'selected-background';
                div.style.background = selectedColor['button'];
                element.appendChild(div);

                // Check if it's bingo!
                let row = Math.floor(index / 5);
                let col = index % 5;
                
                // Row
                let isBingo = true;
                for (let c = 0; c < 5; c++) {
                    if (!cells[row * 5 + c].classList.contains('fulfilled')) {
                        isBingo = false;
                    }
                }
                if (isBingo) {
                    bingo(element);
                    return;
                }
                // Column
                isBingo = true;
                for (let r = 0; r < 5; r++) {
                    if (!cells[r * 5 + col].classList.contains('fulfilled')) {
                        isBingo = false;
                    }
                }
                if (isBingo) {
                    bingo(element);
                    return;
                }
                // Check if the square is on a diagonal
                if (row == col) {
                    isBingo = true;
                    for (let i = 0; i < 5; i++) {
                        if (!cells[i * 5 + i].classList.contains('fulfilled')) {
                            isBingo = false;
                        }
                    }
                    if (isBingo) {
                        bingo(element);
                        return;
                    }
                } else if (row + col == 4) {
                    isBingo = true;
                    for (let i = 0; i < 5; i++) {
                        if (!cells[i * 5 + (4 - i)].classList.contains('fulfilled')) {
                            isBingo = false;
                        }
                    }
                    if (isBingo) {
                        bingo(element);
                        return;
                    }
                }
            }
        });
    });

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
};