import { setupMarquee, changeTheme, FREE_SPACE, COLORS, selectedColor, setSelectedColor  } from './common.js';

// An array of { text: 'stuff', tagIndex: 2 }
let selectedTags = [];

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
            setSelectedColor(color);
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
            setSelectedColor(color);
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

    setupMarquee();
};