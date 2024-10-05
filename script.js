// Variables
let grid = [];
let code = [];  // Empty array to generate new codes
let currentCodeIndex = 0;
let maxTime = 180;  // Full time (90 seconds)
let timeLeft = maxTime;
let gridColumns = 17;
let gridRows = 6;
let selectedRow = 0;  // Row position of the selected number
let selectedCol = 0;  // Column position of the selected number
let countdown;  // To manage the countdown timer

// Function to generate random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a new random code
function generateCode() {
    code = [];
    for (let i = 0; i < 6; i++) {  // Generate 6 random numbers for the code
        code.push(getRandomNumber(10, 99));  // Random numbers between 10 and 99
    }
}

// Function to generate a new grid with random numbers
function generateGrid() {
    let gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // Clear existing grid
    grid = []; // Reset grid data

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridColumns; col++) {
            let num = getRandomNumber(10, 99);  // Generate a random number between 10 and 99
            grid.push(num);  // Add to grid array

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
        item.classList.remove('selected');  // Remove 'selected' class from all items
        if (parseInt(item.dataset.row) === selectedRow && parseInt(item.dataset.col) === selectedCol) {
            item.classList.add('selected');  // Add 'selected' class to the current selected item
        }
    });
}

// Check if the selected number matches the current code number
function checkSelectedNumber() {
    let selectedNumber = grid[selectedRow * gridColumns + selectedCol];  // Get the number in the grid at the selected position
    if (parseInt(selectedNumber) === code[currentCodeIndex]) {  // Compare as integers
        // Turn the corresponding code number at the top green
        let codeNumbers = document.querySelectorAll('#codeNumbers span');
        if (codeNumbers[currentCodeIndex]) {
            codeNumbers[currentCodeIndex].style.color = 'green';  // Update color directly to green
        }

        currentCodeIndex++;  // Move to the next code number

        // Reset the grid after selecting the correct code number
        generateGrid();

        // Check if the entire code is found
        if (currentCodeIndex === code.length) {
            alert('Code cracked!');
            resetGame();  // Call reset function when code is cracked
        }
    }
}

// Function to reset the game
function resetGame() {
    currentCodeIndex = 0;  // Reset code index
    generateCode();  // Generate a new code
    updateCodeDisplay();  // Update code numbers at the top
    generateGrid();  // Regenerate the grid with the new code
    resetTimer();  // Reset the timer
}

// Function to update the code numbers displayed at the top
function updateCodeDisplay() {
    let codeContainer = document.getElementById('codeNumbers');
    codeContainer.innerHTML = '';  // Clear existing code numbers
    code.forEach((num, index) => {
        let span = document.createElement('span');
        span.innerHTML = `${num} `;
        span.classList.add('code-number');  // Initially grey code numbers
        codeContainer.appendChild(span);
    });
}

// Handle WASD movement for navigation
function handleMovement(event) {
    switch (event.key) {
        case 'w':  // Move up
            if (selectedRow > 0) selectedRow--;
            break;
        case 's':  // Move down
            if (selectedRow < gridRows - 1) selectedRow++;
            break;
        case 'a':  // Move left
            if (selectedCol > 0) selectedCol--;
            break;
        case 'd':  // Move right
            if (selectedCol < gridColumns - 1) selectedCol++;
            break;
        case 'Enter':  // Confirm selected number
            checkSelectedNumber();
            break;
        default:
            return;  // Exit function if it's not WASD or Enter
    }

    highlightSelectedNumber();  // Update the highlight for the selected number
}

// Function to start the countdown timer with a depleting bar
function startTimer() {
    let timerBar = document.getElementById('timer-bar');

    countdown = setInterval(() => {
        timeLeft--;
        let widthPercent = (timeLeft / maxTime) * 100;
        timerBar.style.width = `${widthPercent}%`;

        // Gradually change the color from green to white as time runs out
        if (widthPercent <= 0) {
            clearInterval(countdown);
            alert('Time is up!');
        }
    }, 1000); // Update every second
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
    startTimer();  // Start the 90-second timer with the depleting bar
    updateGridEveryTenSeconds();  // Start grid updating every 10 seconds

    document.addEventListener('keydown', handleMovement);  // Listen for keyboard inputs
}

init();  // Start the game
