// Custom function to shuffle the array randomly (Fisher-Yates algorithm)
function randomizeArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]; // Swap items
    }
}

// Fetch the JSON data
fetch('/data/data.json')
    .then(response => {
        console.log('Data fetched successfully:', response);
        return response.json();
    })
    .then(data => {
        console.log('Data retrieved:', data);

        // Combine colors and numbers into a unified collection
        const gameItems = [...data.colors, ...data.numbers];
        console.log('Combined items:', gameItems);

        // Shuffle the items so they're in random order
        randomizeArray(gameItems);

        // Find the container where we’ll place the items
        const itemsContainer = document.getElementById('all-items');

        // Iterate through each item and display it
        gameItems.forEach(item => {
            const itemElement = createItemElement(item);
            itemElement.setAttribute('draggable', true);
            itemElement.dataset.category = item.category.toLowerCase();
            itemElement.addEventListener('dragstart', onItemDragStart);
            itemsContainer.appendChild(itemElement);
        });

        // Initialize drop zones for colors and numbers
        initializeDropZone('color-dropzone', 'colors');
        initializeDropZone('number-dropzone', 'numbers');
    })
    .catch(error => console.error('Error while fetching data:', error));

// Function to create a visual representation of each item
function createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'game-item';
    itemDiv.textContent = item.name;
    return itemDiv;
}

// Handle the drag start event for each item
function onItemDragStart(event) {
    console.log('Item being dragged:', event.target.textContent);
    event.dataTransfer.setData('text/plain', event.target.textContent);
    event.dataTransfer.setData('category', event.target.dataset.category);
    event.target.style.opacity = '0.5'; // Make the item semi-transparent while dragging
}

// Set up the drop zones with logic for valid and invalid drops
function initializeDropZone(zoneId, category) {
    const dropZone = document.getElementById(zoneId);

    dropZone.addEventListener('dragover', event => {
        event.preventDefault();
        dropZone.style.border = '2px solid #888'; // Show border while dragging over
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.border = '1px solid #ccc'; // Reset border when leaving drop zone
    });

    dropZone.addEventListener('drop', event => {
        event.preventDefault();
        const draggedItem = event.dataTransfer.getData('text');
        const draggedCategory = event.dataTransfer.getData('category');

        console.log(`Item dropped: ${draggedItem}, Expected category: ${category}`);

        // Check if the dropped item belongs to the correct category
        if (draggedCategory === category) {
            const droppedItemElement = document.createElement('div');
            droppedItemElement.textContent = draggedItem;
            dropZone.appendChild(droppedItemElement); // Append valid item to the drop zone
        } else {
            // Highlight the incorrect item in red
            event.target.style.color = 'red';
            setTimeout(() => {
                event.target.style.color = ''; // Reset color after a brief moment
            }, 500);
        }
    });
}
