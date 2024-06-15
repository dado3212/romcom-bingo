var current = 0;
var dimension = 5;
var isDisabled = true;
var nextTagNumber = -1;

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

function tagClick(tag) {
    if (tag.classList.contains('disabled')) {
        return;
    }
    // Handle adding a new tag
    if (tag.classList.contains('add')) {
        document.querySelector('#newTag').style.display = 'block';

        let tagText = document.querySelector('#tagText');
        tagText.value = '';
        tagText.focus();
    } else {
        // Add in the class for CSS styling
        tag.classList.toggle('selected');
        let isSelected = tag.classList.contains('selected');
        let tagIndex = parseInt(tag.dataset.index);

        // Add it directly, and append it to the 'selectedTags' list
        // which is used when unselecting an option, and when 
        // creating a formal bingo board that can be shared
        if (isSelected) {
            let cell = getCell(current);

            cell.innerHTML = '<p>' + tag.innerHTML + '</p>';

            selectedTags.push({
                text: tag.innerHTML,
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
        tag.addEventListener('click', () => tagClick(tag));
    });

    const createButton = document.querySelector('#create');
    if (createButton) {
        createButton.addEventListener('click', function () {
            document.querySelector('#newBingo').style.display = 'block';

             // display the naming screen
             document.querySelector('#error').style.display = 'none';
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
    document.querySelectorAll('.close').forEach(function (closePopup) {
        closePopup.addEventListener('click', function() {
            closePopup.closest('.popup').style.display = 'none';
        });
    });
    
    document.querySelector('#submitBingo').addEventListener('click', function() {
        let movieName = document.querySelector('#movieName').value;
        // document.getElementById('popupForm').style.display = 'none';
        // TODO: Show the share screen
                    
        const tagString = JSON.stringify(selectedTags.map(tag => tag.tagIndex));
        const newTags = JSON.stringify(selectedTags.filter(tag => tag.tagIndex < 0).map(tag => tag.text));

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/create.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this.disabled = true;
        let errorDiv = document.querySelector('#error');
        errorDiv.style.display = 'none';
        xhr.onreadystatechange = function (data) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                document.querySelector('#submitBingo').disabled = false;
                if (data.target.status !== 200) {
                    try {
                        errorDiv.innerHTML = JSON.parse(data.target.response)['message'];
                    } catch {
                        // If it's malformed it's because I'm echoing something, just dump it all
                        errorDiv.innerHTML = data.target.response;
                    }
                    errorDiv.style.display = 'block';
                } else {
                    try {
                        const bingoIndex = JSON.parse(data.target.response)['index'];

                        // display the share screen
                        document.querySelector('.popup-content label').style.display = 'none';
                        document.querySelector('.popup-content input').style.display = 'none';
                        document.querySelector('.popup-content button').style.display = 'none';
                        document.querySelector('#create').disabled = false;
                        
                        document.querySelector('.shareLink').style.display = 'block';
                        document.querySelector('.shareLink').href = 'https://alexbeals.com/projects/bingo/board/' + bingoIndex;
                    } catch {
                        // If it's malformed it's because I'm echoing something, just dump it all
                        errorDiv.innerHTML = data.target.response;
                        errorDiv.style.display = 'block';
                    }
                }
            }
        }
        xhr.send('movieName=' + movieName + '&tags=' + tagString + '&newTags=' + newTags);
    });

    document.querySelector('#submitTag').addEventListener('click', function() {
        let tagText = document.querySelector('#tagText').value;
                    
        // Create the new tag
        let newOption = document.createElement('div');
        newOption.classList.add('option');
        newOption.classList.add('selected');
        newOption.dataset.index = nextTagNumber;
        newOption.addEventListener('click', () => tagClick(newOption));

        newOption.innerHTML = tagText;
        // Append the option to the UI
        let lastOption = Array.from(document.querySelectorAll('.option:not(.add)')).pop();
        lastOption.after(newOption);

        // Add it to a cell, and append it to the 'selectedTags' list
        // which is used when unselecting an option, and when 
        // creating a formal bingo board that can be shared
        let cell = getCell(current);

        cell.innerHTML = '<p>' + tagText + '</p>';

        selectedTags.push({
            text: tagText,
            tagIndex: nextTagNumber,
        });
        nextTagNumber -= 1;

        current += 1;
        // Skip over Free Space
        if (current === FREE_SPACE) {
            current += 1;
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
        }

        // Close the popup
        this.closest('.popup').style.display = 'none';
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

    // Set up the marquee
    const topLights = document.querySelector('.marquee .top-lights');
    const leftLights = document.querySelector('.marquee .left-lights');
    const bottomLights = document.querySelector('.marquee .bottom-lights');
    const rightLights = document.querySelector('.marquee .right-lights');
    let counter = 0;
    // Top row
    for (let i = 0; i < 15; i++) {
        let newDot = document.createElement('div');
        newDot.classList.add('dot');
        newDot.style.animationDelay = (counter * 0.03) + 's';
        topLights.append(newDot);
        counter++;
    }
    // Right row
    for (let i = 0; i < 6; i++) {
        let newDot = document.createElement('div');
        newDot.classList.add('dot');
        newDot.style.animationDelay = (counter * 0.03) + 's';
        rightLights.append(newDot);
        counter++;
    }
    // Bottom row
    for (let i = 15; i > 0; i--) {
        let newDot = document.createElement('div');
        newDot.classList.add('dot');
        newDot.style.animationDelay = ((counter + i) * 0.03) + 's';
        bottomLights.append(newDot);
    }
    counter += 15;
    // Left row
    for (let i = 6; i > 0; i--) {
        let newDot = document.createElement('div');
        newDot.classList.add('dot');
        newDot.style.animationDelay = ((counter + i) * 0.03) + 's';
        leftLights.append(newDot);
    }
};

// Close any popups if the user clicks outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('popup')) {
        event.target.style.display = 'none';
    }
};