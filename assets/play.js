const FREE_SPACE = 12;
const COLORS = {
    'red': '#AC1212',
    'orange': '#F37310',
    'yellow': '#EBC621',
    'green': '#4E9A26',
    'blue': '#1A5AB6',
    'teal': '#329A97',
    'purple': '#722B92',
    'pink': '#EA64A3',
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
            selectedBackground.style.background = selectedColor;
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

window.onload = () => {
    // If you're displaying an existing bingo board, then load it
    selectedTags = startingTags;
    resetCells();

    // Set up the color selector
    let hasChosen = false;
    const colorHolder = document.querySelector('.colors');
    for (let [colorName, color] of Object.entries(COLORS)) {
        let newColor = document.createElement('div');
        newColor.style.backgroundColor = color;
        newColor.setAttribute('name', colorName);
        // Select the first color
        if (!hasChosen) {
            hasChosen = true;
            newColor.classList.add('selected');
            selectedColor = color;
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
        });

        colorHolder.appendChild(newColor);
    }

    // Handle selecting cells in a formal bingo board
    document.querySelectorAll('.cell').forEach(function (element) {
        element.addEventListener('click', function () {
            this.classList.toggle('fulfilled');

            let selectedBackground = element.querySelector('.selected-background');
            if (selectedBackground) {
                selectedBackground.remove();
            } else {
                let div = document.createElement('div');
                div.className = 'selected-background';
                div.style.background = selectedColor;
                element.appendChild(div);
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
    let loopDuration = 0.4;

    var marqueeCenter = document.querySelector('.marquee .center');
    marqueeCenter.style.width = (size * width + margin * (width + 1)) - 4 * size + 'px';
    marqueeCenter.style.height = (size * height + margin * (height + 1)) - 4 * size + 'px';
    marqueeCenter.style.border = size * 2 + 'px solid #0d253b'; 

    function createDot(c) {
        let newDot = document.createElement('div');
        newDot.classList.add('dot');
        newDot.style.width = size + 'px';
        newDot.style.height = size + 'px';
        newDot.style.animation = 'blink ' + loopDuration + 's infinite';
        newDot.style.animationDelay = ((c % loopSize) * loopDuration / loopSize) - 2 + 's';
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