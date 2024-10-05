// Variables
let grid = [];
let code = [];
let currentCodeIndex = 0;
let maxTime = 180;  // Default time for B Tier
let timeLeft = maxTime;
let gridColumns = 17;
let gridRows = 6;
let selectedRow = 0;
let selectedCol = 0;
let countdown;

// Tier Selector Functionality
const tierSelector = document.getElementById('tiers');
tierSelector.addEventListener('change', function () {
    const selectedTier = tierSelector.value;
    if (selectedTier === 'B') {
        maxTime = 180;
    } else if (selectedTier === 'A') {
        maxTime = 150;
    } else if (selectedTier === 'S') {
        maxTime = 120;
    }
    resetGame();  // Reset game to apply new tier
});

// Prevent "Enter" from interacting with the tier selector
tierSelector.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent default behavior of Enter in the dropdown
    }
});

// Function to generate random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a new random code
function generateCode() {
    code = [];
    for (let i = 0; i < 6; i++) {
        code.push(getRandomNumber(10, 99));
    }
}

// Function to generate a new grid with random numbers
function generateGrid() {
    let gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // Clear existing grid
    grid = []; // Reset grid data

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridColumns; col++) {
            let num = getRandomNumber(10, 99);
            grid.push(num);

            // Create and add a number element in the grid
            let gridItem = document.createElement('div');
            gridItem.className = 'grid-number';
            gridItem.innerHTML = num;
            gridItem.dataset.row = row;
            gridItem.dataset.col = col;
            gridContainer.appendChild(gridItem);
        }
    }

    // Ensure the code number is in the grid
    placeCodeNumberInGrid();
    highlightSelectedNumber();  // Highlight the starting selected number
}

// Ensure the code number is always in the grid
function placeCodeNumberInGrid() {
    let index = getRandomNumber(0, grid.length - 1);
    grid[index] = code[currentCodeIndex];

    // Update the displayed number in the grid
    let gridItems = document.getElementsByClassName('grid-number');
    gridItems[index].innerHTML = code[currentCodeIndex];
}

// Highlight the selected number in the grid
function highlightSelectedNumber() {
    let gridItems = document.getElementsByClassName('grid-number');
    Array.from(gridItems).forEach(item => {
        item.classList.remove('selected');
        if (parseInt(item.dataset.row) === selectedRow && parseInt(item.dataset.col) === selectedCol) {
            item.classList.add('selected');
        }
    });
}

// Check if the selected number matches the current code number
function checkSelectedNumber() {
    let selectedNumber = grid[selectedRow * gridColumns + selectedCol];
    if (parseInt(selectedNumber) === code[currentCodeIndex]) {
        let codeNumbers = document.querySelectorAll('#codeNumbers span');
        if (codeNumbers[currentCodeIndex]) {
            codeNumbers[currentCodeIndex].style.color = 'green';
        }

        currentCodeIndex++;

        generateGrid();

        if (currentCodeIndex === code.length) {
            alert('Code cracked!');
            resetGame();
        }
    }
}

// Function to reset the game
function resetGame() {
    currentCodeIndex = 0;
    generateCode();
    updateCodeDisplay();
    generateGrid();
    resetTimer();
}

// Function to update the code numbers displayed at the top
function updateCodeDisplay() {
    let codeContainer = document.getElementById('codeNumbers');
    codeContainer.innerHTML = '';
    code.forEach((num, index) => {
        let span = document.createElement('span');
        span.innerHTML = `${num} `;
        span.classList.add('code-number');
        codeContainer.appendChild(span);
    });
}

// Handle WASD movement for navigation
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'w': if (selectedRow > 0) selectedRow--; break;
        case 's': if (selectedRow < gridRows - 1) selectedRow++; break;
        case 'a': if (selectedCol > 0) selectedCol--; break;
        case 'd': if (selectedCol < gridColumns - 1) selectedCol++; break;
        case 'Enter': checkSelectedNumber(); break;
    }
    highlightSelectedNumber();
});

// Function to start the countdown timer
function startTimer() {
    let timerBar = document.getElementById('timer-bar');

    countdown = setInterval(() => {
        timeLeft--;
        let widthPercent = (timeLeft / maxTime) * 100;
        timerBar.style.width = `${widthPercent}%`;

        if (widthPercent <= 0) {
            clearInterval(countdown);
            alert('Time is up!');
        }
    }, 1000);
}

// Function to reset the timer
function resetTimer() {
    clearInterval(countdown);  // Clear the current timer
    timeLeft = maxTime;  // Reset time to full duration
    startTimer();  // Restart the timer
}

// Function to update the grid every 10 seconds
function updateGridEveryTenSeconds() {
    setInterval(() => {
        if (timeLeft > 0) {
            generateGrid();  // Regenerate the grid with new numbers
        }
    }, 10000); // Update every 10 seconds
}

// Initialize the grid and start the game
function init() {
    generateCode();  // Generate the initial code
    updateCodeDisplay();  // Display the initial code numbers
    generateGrid();  // Generate initial grid
    startTimer();  // Start the timer
    updateGridEveryTenSeconds();  // Start grid updating every 10 seconds
}

init();  // Start the game
