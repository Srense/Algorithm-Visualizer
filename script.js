let array = [];
let canvas;
let arraySize = 50;
let speed = 50; // Current speed, will be adjusted
let sorting = false;
let paused = false; // New flag to track pause state
let description = '';
let currentBarIndex = -1; // Track the current bar index

document.addEventListener('DOMContentLoaded', () => {
    const algorithmSelect = document.getElementById('algorithm');
    const arraySizeInput = document.getElementById('arraySize');
    const speedInput = document.getElementById('speed');
    const shuffleButton = document.getElementById('shuffleArray');
    const startButton = document.getElementById('startSorting');
    const pauseButton = document.getElementById('pauseSorting');

    arraySizeInput.addEventListener('input', () => {
        arraySize = parseInt(arraySizeInput.value);
        generateArray();
    });

    speedInput.addEventListener('input', () => {
        speed = parseInt(speedInput.value);
    });

    shuffleButton.addEventListener('click', generateArray);

    startButton.addEventListener('click', () => {
        if (sorting) return;
        sorting = true;
        paused = false; // Ensure paused state is reset
        const algorithm = algorithmSelect.value;
        switch (algorithm) {
            case 'bubbleSort':
                bubbleSort();
                break;
            case 'quickSort':
                quickSort(0, array.length - 1);
                break;
            case 'mergeSort':
                mergeSort(0, array.length - 1);
                break;
        }
    });

    pauseButton.addEventListener('click', () => {
        paused = !paused; // Toggle pause state
        pauseButton.textContent = paused ? 'Resume' : 'Pause';
    });

    function generateArray() {
        array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * canvas.height));
        redrawArray();
    }

    function setup() {
        canvas = createCanvas(windowWidth - 20, 500);
        canvas.parent('canvas-container');
        generateArray();
    }

    function draw() {
        if (!sorting) {
            background(220);
            redrawArray();
            textSize(16);
            fill(0);
            text(description, 10, height - 20);
        }
    }

    function redrawArray() {
        background(220);
        let barWidth = width / array.length;
        for (let i = 0; i < array.length; i++) {
            if (i === currentBarIndex) {
                fill(255, 0, 0); // Red color for the current bar
            } else {
                fill(100, 150, 255); // Default color for other bars
            }
            rect(i * barWidth, height - array[i], barWidth, array[i]);
            fill(0);
            textSize(12);
            textAlign(CENTER, CENTER);
            text(array[i], i * barWidth + barWidth / 2, height - array[i] - 10); // Display array element on the bar
        }
    }

    async function bubbleSort() {
        description = 'Bubble Sort: Start sorting.';
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (paused) { // Check for pause
                    while (paused) {
                        await new Promise(resolve => setTimeout(resolve, 100)); // Wait until resumed
                    }
                }
                currentBarIndex = j; // Set the current bar index
                description = `Comparing ${array[j]} and ${array[j + 1]}.`;
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    description = `Swapping ${array[j]} and ${array[j + 1]}.`;
                }
                redrawArray();
                await new Promise(resolve => setTimeout(resolve, (100 - speed) * 2)); // Slowed down speed
            }
        }
        description = 'Bubble Sort Complete: Array is sorted.';
        sorting = false;
        currentBarIndex = -1; // Reset current bar index
        redrawArray(); // Final redraw to remove red color
    }

    async function quickSort(left, right) {
        if (paused) { // Check for pause
            while (paused) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait until resumed
            }
        }
        if (left < right) {
            description = `Quick Sort: Sorting subarray [${array.slice(left, right + 1)}].`;
            let pivotIndex = await partition(left, right);
            await quickSort(left, pivotIndex - 1);
            await quickSort(pivotIndex + 1, right);
        }
        if (left === 0 && right === array.length - 1) {
            description = 'Quick Sort Complete: Array is sorted.';
            sorting = false;
        }
    }

    async function partition(left, right) {
        let pivot = array[right];
        let i = left;
        for (let j = left; j < right; j++) {
            if (paused) { // Check for pause
                while (paused) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Wait until resumed
                }
            }
            currentBarIndex = j; // Set the current bar index
            description = `Comparing ${array[j]} with pivot ${pivot}.`;
            if (array[j] < pivot) {
                [array[i], array[j]] = [array[j], array[i]];
                description = `Swapping ${array[i]} and ${array[j]}.`;
                i++;
                redrawArray();
                await new Promise(resolve => setTimeout(resolve, (100 - speed) * 2)); // Slowed down speed
            }
        }
        [array[i], array[right]] = [array[right], array[i]];
        description = `Placing pivot ${pivot} at correct position.`;
        redrawArray();
        await new Promise(resolve => setTimeout(resolve, (100 - speed) * 2)); // Slowed down speed
        currentBarIndex = -1; // Reset current bar index
        return i;
    }

    async function mergeSort(left, right) {
        if (paused) { // Check for pause
            while (paused) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait until resumed
            }
        }
        if (left < right) {
            let middle = Math.floor((left + right) / 2);
            description = `Merge Sort: Dividing array into [${array.slice(left, middle + 1)}] and [${array.slice(middle + 1, right + 1)}].`;
            await mergeSort(left, middle);
            await mergeSort(middle + 1, right);
            await merge(left, middle, right);
        }
        if (left === 0 && right === array.length - 1) {
            description = 'Merge Sort Complete: Array is sorted.';
            sorting = false;
        }
    }

    async function merge(left, middle, right) {
        let leftArray = array.slice(left, middle + 1);
        let rightArray = array.slice(middle + 1, right + 1);
        let leftIndex = 0, rightIndex = 0, arrayIndex = left;

        while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
            if (paused) { // Check for pause
                while (paused) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Wait until resumed
                }
            }
            currentBarIndex = arrayIndex; // Set the current bar index
            description = `Merging elements: left array [${leftArray.slice(leftIndex).join(', ')}], right array [${rightArray.slice(rightIndex).join(', ')}].`;
            if (leftArray[leftIndex] < rightArray[rightIndex]) {
                array[arrayIndex++] = leftArray[leftIndex++];
            } else {
                array[arrayIndex++] = rightArray[rightIndex++];
            }
            redrawArray();
            await new Promise(resolve => setTimeout(resolve, (100 - speed) * 2)); // Slowed down speed
        }

        while (leftIndex < leftArray.length) {
            array[arrayIndex++] = leftArray[leftIndex++];
            redrawArray();
            await new Promise(resolve => setTimeout(resolve, (100 - speed) * 2)); // Slowed down speed
        }

        while (rightIndex < rightArray.length) {
            array[arrayIndex++] = rightArray[rightIndex++];
            redrawArray();
            await new Promise(resolve => setTimeout(resolve, (100 - speed) * 2)); // Slowed down speed
        }
        currentBarIndex = -1; // Reset current bar index
    }

    window.setup = setup;
    window.draw = draw;
});
