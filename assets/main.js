var current = 0;
var size = 5;

function getCell(num) {
    return document.querySelectorAll('.cell')[num];
}

function resetCells(dedicated) {
    
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

    const elements = document.querySelectorAll('.option');

    // Add a click event listener to each element
    elements.forEach(function (element) {
        element.addEventListener('click', function () {
            // This function is called whenever an element with 'your-class-name' is clicked
            this.classList.toggle('selected');

            getCell(current).innerHTML = '<p>' + this.innerHTML + '</p>';
            getCell(current).setAttribute('selected', 'false');
            current += 1;
            // Skip over Free Space
            if (current === 12) {
                current += 1;
            }
        });
    });
    // TODO: At the max, gray out all unselected squares
    // TODO: Handle unselecting

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