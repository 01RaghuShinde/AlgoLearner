let array = []; 
let sortingIndex = 0; 
let isSorting = false; 

function drawArrayOnCanvas(canvasId, highlightIndices = []) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); 

  const boxWidth = 50;
  const boxHeight = 50;
  const boxSpacing = 10;
  const startX = 20;
  const startY = 50;

  array.forEach((num, index) => {
    const x = startX + index * (boxWidth + boxSpacing);

    ctx.fillStyle = highlightIndices.includes(index) ? '#ffcccb' : '#e6f4e8'; 

    ctx.fillRect(x, startY, boxWidth, boxHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, startY, boxWidth, boxHeight);

    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(num, x + boxWidth / 2, startY + boxHeight / 2);

    ctx.fillText(index, x + boxWidth / 2, startY + boxHeight + 20);
  });
}

function swapAndAnimate(pos1, pos2, callback) {
  const canvas = document.getElementById('sortingCanvas');
  const ctx = canvas.getContext('2d');

  const boxWidth = 50;
  const boxSpacing = 10;
  const startX = 20;
  const startY = 50;
  const x1 = startX + pos1 * (boxWidth + boxSpacing);
  const x2 = startX + pos2 * (boxWidth + boxSpacing);

  let progress = 0;

  function animateSwap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawArrayOnCanvas('sortingCanvas', [pos1, pos2]); 

    const easedProgress = 1 - Math.pow(1 - progress, 3); 
    const newX1 = x1 + (x2 - x1) * easedProgress;
    const newX2 = x2 - (x2 - x1) * easedProgress;

    drawBox(ctx, newX1, startY, array[pos1]);
    drawBox(ctx, newX2, startY, array[pos2]);

    progress += 0.03; 
    if (progress < 1) {
      requestAnimationFrame(animateSwap); 
    } else {
      
      const temp = array[pos1];
      array[pos1] = array[pos2];
      array[pos2] = temp;

      drawArrayOnCanvas('sortingCanvas'); 
      if (callback) callback();
    }
  }

  requestAnimationFrame(animateSwap);
}

function drawBox(ctx, x, y, num) {
  const boxWidth = 50;
  const boxHeight = 50;

  ctx.fillStyle = '#e6f4e8';
  ctx.fillRect(x, y, boxWidth, boxHeight);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x, y, boxWidth, boxHeight);

  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num, x + boxWidth / 2, y + boxHeight / 2);
}

function startSelectionSort() {
  const input = document.getElementById('input-array').value;
  if (!input.match(/^(\s*\d+\s*,)*\s*\d+\s*$/)) {
    alert('Please enter a valid array of numbers, separated by commas.');
    return;
  }

  array = input.split(',').map(Number);
  drawArrayOnCanvas('unsortedCanvas');

  sortingIndex = 0; 
  isSorting = true; 
  selectionSortStep();
}

function selectionSortStep() {
  if (!isSorting) return;

  if (sortingIndex >= array.length - 1) {
    alert('Sorting complete!');
    drawArrayOnCanvas('sortingCanvas');
    isSorting = false;
    return;
  }

  let minIndex = sortingIndex;

  for (let j = sortingIndex + 1; j < array.length; j++) {
    if (array[j] < array[minIndex]) {
      minIndex = j;
    }
  }

  const highlightIndices = [sortingIndex, minIndex];
  if (minIndex !== sortingIndex) {
    swapAndAnimate(sortingIndex, minIndex, () => {
      sortingIndex++; 
      selectionSortStep(); 
    });
  } else {
    sortingIndex++;
    selectionSortStep();
  }
}
