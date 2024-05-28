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
            cell.innerHTML = '<p>' + tag['text'] + '</p>';
            cell.setAttribute('selected', 'false');
            cell.setAttribute('index', tag['tagIndex'].toString());
        }
    }
}

window.onload = () => {
    // Add a click event listener to each tag option
    document.querySelectorAll('.option').forEach(function (tag) {
        tag.addEventListener('click', function () {
            // Add in the class for CSS styling
            this.classList.toggle('selected');
            let isSelected = this.classList.contains('selected');
            let tagIndex = parseInt(this.dataset.index);

            // Add it directly, and append it to the 'selectedTags' list
            // which is used when unselecting an option, and when 
            // creating a formal bingo board that can be shared
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
                // Find the selected tag that matches and remove it
                let newSelectedTags = [];
                for (let i = 0; i < selectedTags.length; i++) {
                    if (selectedTags[i].tagIndex != tagIndex) {
                        newSelectedTags.push(selectedTags[i]);
                    }
                }
                selectedTags = newSelectedTags;

                // Rewrite the cells (easier than trying to fix them
                // for tags that are in the middle of the list)
                resetCells();
                current = selectedTags.length;
                // Skip over Free Space
                if (current >= FREE_SPACE) {
                    current += 1;
                }
            }
        });
    });

    // TODO: At the max, gray out all unselected squares

    // Handle selecting cells in a formal bingo board
    document.querySelectorAll('.cell').forEach(function (element) {
        element.addEventListener('click', function () {
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