var current = 0;
var dimension = 5;

const FREE_SPACE = 12;

// An array of { text: 'stuff', tagIndex: 2 }
var selectedTags = [];

function getCell(num) {
    return document.querySelectorAll('.cell')[num];
}

function resetCells() {
    // Clear all of the text of the existing cells
    var cells = document.querySelectorAll('.bingo .cell');
    for (let i = 0; i < cells.length; i++) {
        if (i !== FREE_SPACE) {
            let p = cells[i].querySelector('p');
            if (p) {
                p.remove();
            }
        }
    }

    // Iterate over the selected tags
    let tag;
    for (let i = 0; i < selectedTags.length; i++) {
        // Skip over Free Space
        if (i === FREE_SPACE) {
            i += 1;
        }

        tag = selectedTags[i] ?? null;
        if (tag) {
            getCell(i).innerHTML = '<p>' + tag['text'] + '</p>';
            getCell(i).setAttribute('selected', 'false');
            getCell(i).setAttribute('index', tag['tagIndex'].toString());
        }
    }
}

window.onload = () => {

    // Initialize the cell values
    const cellValues = {};
    for (let i = 0; i < 25; i++) {
        cellValues[i] = null;
        // Free Space
        if (i === 13) {
            cellValues[i] = 'Free Space ★';
        }
    }

    const tagList = document.querySelectorAll('.option');

    // Add a click event listener to each tag option
    tagList.forEach(function (tag) {
        tag.addEventListener('click', function () {
            // This function is called whenever an element with 'your-class-name' is clicked
            this.classList.toggle('selected');
            let isSelected = this.classList.contains('selected');
            let tagIndex = parseInt(this.dataset.index);

            if (isSelected) {
                let cell = getCell(current);

                cell.innerHTML = '<p>' + this.innerHTML + '</p>';
                cell.setAttribute('selected', 'false');

                selectedTags.push({
                    text: this.innerHTML,
                    tagIndex: tagIndex,
                });

                current += 1;
                // Skip over Free Space
                if (current === FREE_SPACE) {
                    current += 1;
                }
            } else {
                let newSelectedTags = [];
                for (let i = 0; i < selectedTags.length; i++) {
                    if (selectedTags[i].tagIndex != tagIndex) {
                        newSelectedTags.push(selectedTags[i]);
                    }
                }
                selectedTags = newSelectedTags;
                resetCells();
                current = selectedTags.length;
            }
        });
    });

    // TODO: Remove this temp code
    document.querySelector('.reset').addEventListener('click', resetCells);

    // TODO: At the max, gray out all unselected squares

    document.querySelectorAll('.cell').forEach(function (element) {
        element.addEventListener('click', function () {
            // This function is called whenever an element with 'your-class-name' is clicked
            this.classList.toggle('fulfilled');

            let isSelected = element.getAttribute('selected') === 'true';
            if (isSelected) {
                element.querySelector('.selected-background').remove();
            } else {
                let div = document.createElement('div');
                div.className = 'selected-background';
                element.appendChild(div);
            }
            isSelected = !isSelected;

            element.setAttribute('selected', isSelected ? 'true' : 'false');
        });
    });
};