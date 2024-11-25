// Data for emojis categorized
const emojiData = {
  car: [
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛻'
  ],
  yoga: [
    '🧘', '🧘‍♂️', '🧘‍♀️', '🕉️', '☮️', '🧎', '🧎‍♂️', '🧎‍♀️', '🙏', '🕊️'
  ],
  shopping: [
    '🛒', '🛍️', '💳', '💰', '🏪', '🎁', '🏬', '🎀', '💸', '🛍️'
  ],
  activities: [
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏',
    '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🎿', '🛼', '🚴', '🚵', '🏊', '🤸', '🤾'
  ],
  // Add more categories and emojis as needed
};

// List of category names
let categories = Object.keys(emojiData);
let currentCategoryIndex = 0;

// Variables for drag-and-drop functionality
let draggedEmoji = null;
let draggedEmojiClone = null;
let currentDroppable = null;

// Error Logging Function
function logError(eventType, message, details = {}) {
  console.error(`Error [${eventType}]: ${message}`, details);
}

// Load emojis into the emoji grid
function loadEmojis(category) {
  try {
    const emojiGrid = document.getElementById('emoji-grid');
    emojiGrid.innerHTML = ''; // Clear existing emojis
    const emojis = emojiData[category];

    // Create and append emoji items
    emojis.forEach(emojiChar => {
      const emojiItem = createEmojiItem(emojiChar);
      emojiGrid.appendChild(emojiItem);
    });

    // Update the category name display
    const categoryNameDisplay = document.getElementById('category-name');
    categoryNameDisplay.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  } catch (error) {
    logError('loadEmojis', 'Failed to load emojis for category.', { category, error });
  }
}

// Create an emoji item element
function createEmojiItem(emojiChar) {
  const emojiItem = document.createElement('div');
  emojiItem.classList.add('emoji-item');
  emojiItem.textContent = emojiChar;

  // Make the emoji draggable
  emojiItem.setAttribute('draggable', 'true');

  // Touch event listeners for drag-and-drop
  emojiItem.addEventListener('touchstart', handleDragStart, false);
  emojiItem.addEventListener('touchmove', handleDragMove, false);
  emojiItem.addEventListener('touchend', handleDragEnd, false);

  // Mouse event listeners for desktop
  emojiItem.addEventListener('mousedown', handleMouseDown, false);

  return emojiItem;
}

// Handle navigation between categories
function navigateCategory(direction) {
  try {
    if (direction === 'prev') {
      currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
    } else if (direction === 'next') {
      currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
    }
    const newCategory = categories[currentCategoryIndex];
    loadEmojis(newCategory);
  } catch (error) {
    logError('navigateCategory', 'Failed to navigate categories.', { direction, error });
  }
}

// Event listeners for navigation buttons
document.getElementById('prev-category').addEventListener('click', () => navigateCategory('prev'));
document.getElementById('next-category').addEventListener('click', () => navigateCategory('next'));

// Drag-and-Drop Handlers for Touch Devices
function handleDragStart(e) {
  try {
    e.preventDefault();
    e.stopPropagation();
    draggedEmoji = e.target;
    draggedEmojiClone = draggedEmoji.cloneNode(true);
    draggedEmojiClone.classList.add('dragging-clone');
    document.body.appendChild(draggedEmojiClone);

    // Position the clone at the touch point
    const touch = e.touches[0];
    updateDraggedEmojiPosition(touch);
  } catch (error) {
    logError('handleDragStart', 'Failed during drag start.', { error });
  }
}

function handleDragMove(e) {
  try {
    if (!draggedEmojiClone) return;

    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    updateDraggedEmojiPosition(touch);

    // Get the element under the touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elementBelow) return;

    const droppableBelow = elementBelow.closest('.emoji-placeholder');

    if (currentDroppable !== droppableBelow) {
      if (currentDroppable) {
        currentDroppable.classList.remove('highlight');
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        currentDroppable.classList.add('highlight');
      }
    }
  } catch (error) {
    logError('handleDragMove', 'Failed during drag move.', { error });
  }
}

function handleDragEnd(e) {
  try {
    if (!draggedEmojiClone) return;

    e.preventDefault();
    e.stopPropagation();
    draggedEmojiClone.remove();
    draggedEmojiClone = null;

    if (currentDroppable) {
      // Snap the emoji to the center of the placeholder
      currentDroppable.textContent = draggedEmoji.textContent;
      currentDroppable.classList.remove('highlight');
    }

    draggedEmoji = null;
    currentDroppable = null;
  } catch (error) {
    logError('handleDragEnd', 'Failed during drag end.', { error });
  }
}

// Mouse Event Handlers for Desktop Support
function handleMouseDown(e) {
  try {
    e.preventDefault();
    e.stopPropagation();
    draggedEmoji = e.target;
    draggedEmojiClone = draggedEmoji.cloneNode(true);
    draggedEmojiClone.classList.add('dragging-clone');
    document.body.appendChild(draggedEmojiClone);

    // Position the clone at the mouse point
    updateDraggedEmojiPosition(e);

    // Mouse move and up handlers
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mouseup', handleMouseUp, false);
  } catch (error) {
    logError('handleMouseDown', 'Failed during mouse down.', { error });
  }
}

function handleMouseMove(e) {
  try {
    if (!draggedEmojiClone) return;

    e.preventDefault();
    e.stopPropagation();
    updateDraggedEmojiPosition(e);

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementBelow) return;

    const droppableBelow = elementBelow.closest('.emoji-placeholder');

    if (currentDroppable !== droppableBelow) {
      if (currentDroppable) {
        currentDroppable.classList.remove('highlight');
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        currentDroppable.classList.add('highlight');
      }
    }
  } catch (error) {
    logError('handleMouseMove', 'Failed during mouse move.', { error });
  }
}

function handleMouseUp(e) {
  try {
    if (!draggedEmojiClone) return;

    e.preventDefault();
    e.stopPropagation();
    draggedEmojiClone.remove();
    draggedEmojiClone = null;

    if (currentDroppable) {
      // Snap the emoji to the center of the placeholder
      currentDroppable.textContent = draggedEmoji.textContent;
      currentDroppable.classList.remove('highlight');
    }

    draggedEmoji = null;
    currentDroppable = null;

    document.removeEventListener('mousemove', handleMouseMove, false);
    document.removeEventListener('mouseup', handleMouseUp, false);
  } catch (error) {
    logError('handleMouseUp', 'Failed during mouse up.', { error });
  }
}

// Update the position of the dragged emoji clone
function updateDraggedEmojiPosition(event) {
  try {
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Position the clone under the cursor/finger
    draggedEmojiClone.style.left = `${x + scrollLeft}px`;
    draggedEmojiClone.style.top = `${y + scrollTop}px`;
    draggedEmojiClone.style.position = 'absolute';
    draggedEmojiClone.style.zIndex = 1000;
  } catch (error) {
    logError('updateDraggedEmojiPosition', 'Failed to update dragged emoji position.', { error });
  }
}

// Huiswerk Button Toggle Functionality
const huiswerkButtons = document.querySelectorAll('.huiswerk-button');
huiswerkButtons.forEach(button => {
  button.addEventListener('click', () => {
    try {
      button.classList.toggle('active');

      if (button.classList.contains('active')) {
        // Add thumbs-up animation
        const thumbSpan = document.createElement('span');
        thumbSpan.textContent = '👍';
        thumbSpan.classList.add('thumb-animation');
        button.appendChild(thumbSpan);

        setTimeout(() => {
          thumbSpan.remove();
        }, 2000); // Remove after 2 seconds
      }
    } catch (error) {
      logError('huiswerkButton', 'Failed to toggle Huiswerk button.', { error });
    }
  });
});

// Update live time display
function updateLiveTime() {
  try {
    const liveTimeElement = document.getElementById('live-time');
    const now = new Date();
    liveTimeElement.textContent = now.toLocaleTimeString();
  } catch (error) {
    logError('updateLiveTime', 'Failed to update live time.', { error });
  }
}

// Reset Button Functionality
document.getElementById('reset-button').addEventListener('click', () => {
  try {
    // Clear emojis from placeholders
    const placeholders = document.querySelectorAll('.emoji-placeholder');
    placeholders.forEach(placeholder => {
      placeholder.textContent = '';
    });

    // Reset Huiswerk buttons
    huiswerkButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Reset day rating
    ratingButtons.forEach(button => {
      button.classList.remove('selected');
      button.style.display = 'none';
    });
    ratingCircle.style.display = 'flex';

    // Clear text inputs
    const textInputs = document.querySelectorAll('.custom-text-inputs input');
    textInputs.forEach(input => {
      input.value = '';
    });
  } catch (error) {
    logError('resetButton', 'Failed to reset planner.', { error });
  }
});

// Day Rating System
const ratingCircle = document.getElementById('rating-circle');
const ratingButtons = document.getElementById('rating-buttons').querySelectorAll('.rating-button');

ratingCircle.addEventListener('click', () => {
  try {
    ratingCircle.style.display = 'none';
    ratingButtons.forEach(button => {
      button.style.display = 'block';
    });
  } catch (error) {
    logError('ratingCircle', 'Failed to display rating buttons.', { error });
  }
});

ratingButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    try {
      ratingButtons.forEach((btn, idx) => {
        if (idx <= index) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    } catch (error) {
      logError('ratingButton', 'Failed to select rating.', { button, index, error });
    }
  });
});

// Initialize the application
function init() {
  try {
    // Load the default emoji category
    loadEmojis(categories[currentCategoryIndex]);

    // Update live time every second
    updateLiveTime();
    setInterval(updateLiveTime, 1000);
  } catch (error) {
    logError('init', 'Failed to initialize the application.', { error });
  }
}

init();
