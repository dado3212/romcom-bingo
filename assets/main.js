var current = 0;
var dimension = 5;
var isDisabled = true;

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
    // TODO: Split this into multiple JS files maybe?
    if (typeof startingTags !== 'undefined') {
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
    }

    // Add a click event listener to each tag option
    document.querySelectorAll('.option').forEach(function (tag) {
        tag.addEventListener('click', function () {
            if (tag.classList.contains('disabled')) {
                return;
            }
            // Handle adding a new tag
            if (tag.classList.contains('add')) {
                // TODO: actually do this
            } else {
                // Add in the class for CSS styling
                this.classList.toggle('selected');
                let isSelected = this.classList.contains('selected');
                let tagIndex = parseInt(this.dataset.index);
            }

            // Add it directly, and append it to the 'selectedTags' list
            // which is used when unselecting an option, and when 
            // creating a formal bingo board that can be shared
            if (isSelected) {
                let cell = getCell(current);

                cell.innerHTML = '<p>' + this.innerHTML + '</p>';

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

            // Handle what happens when you hit the maximum number
            if (selectedTags.length === 24) {
                isDisabled = true;
                // Enable the create button
                document.querySelector('#create').disabled = false;
                // Disable all non-selected options
                document.querySelectorAll('.option:not(.selected)').forEach(function (tag) {
                    tag.classList.add('disabled');
                });
            } else if (isDisabled) {
                isDisabled = false;
                // Disable the create button
                document.querySelector('#create').disabled = true;
                // Enable all options
                document.querySelectorAll('.option.disabled').forEach(function (tag) {
                    tag.classList.remove('disabled');
                });
            }
        });
    });

    const createButton = document.querySelector('#create');
    if (createButton) {
        createButton.addEventListener('click', function () {
            document.querySelector('#popupForm').style.display = 'block';

             // display the naming screen
             document.querySelector('.popup-content label').style.display = 'block';
             document.querySelector('.popup-content input').style.display = 'block';
             document.querySelector('.popup-content button').style.display = 'block';
             
             document.querySelector('.popup-content .shareLink').style.display = 'none';
        });
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

    // Popup listeners    
    document.querySelector('#closePopup').addEventListener('click', function() {
        document.querySelector('#popupForm').style.display = 'none';
    });
    
    document.querySelector('#submitInfo').addEventListener('click', function() {
        let movieName = document.querySelector('#movieName').value;
        // document.getElementById('popupForm').style.display = 'none';
        // TODO: Show the share screen
                    
        const tagString = JSON.stringify(selectedTags.map(tag => tag.tagIndex));

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/create.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this.disabled = true;
        xhr.onreadystatechange = function (data) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (data.target.status !== 200) {
                    // TODO: handle the error message, display it in some way.
                    console.log(JSON.parse(data.target.response)['message']);
                } else {
                    const bingoIndex = JSON.parse(data.target.response)['index'];

                    // display the share screen
                    document.querySelector('.popup-content label').style.display = 'none';
                    document.querySelector('.popup-content input').style.display = 'none';
                    document.querySelector('.popup-content button').style.display = 'none';
                    
                    document.querySelector('.shareLink').style.display = 'block';
                    document.querySelector('.shareLink').href = 'https://alexbeals.com/projects/bingo/?b=' + bingoIndex;
                }
            }
        }
        xhr.send('movieName=' + movieName + '&tags=' + tagString);
    });

    // Share screen listener
    document.querySelector('.shareLink').addEventListener('click', function (e) {
        if (navigator.share) {
            e.preventDefault();
            navigator.share({
                url: this.href,
            });
        }
    });
};

// Close the popup if the user clicks anywhere outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('popupForm')) {
        document.getElementById('popupForm').style.display = 'none';
    }
};