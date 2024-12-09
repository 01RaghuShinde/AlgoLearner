const heapCanvas = document.getElementById("heap-canvas");
const sortCanvas = document.getElementById("sort-canvas");
const heapCtx = heapCanvas.getContext("2d");
const sortCtx = sortCanvas.getContext("2d");
const button = document.getElementById("generate-button");
const inputField = document.getElementById("input-array");

// Utility Functions
const clearCanvas = (ctx) => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

const drawNode = (ctx, x, y, value) => {
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#85e085";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(value, x - 8, y + 6);
};

const drawLine = (ctx, x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#666";
  ctx.stroke();
};

// Heap Functions
const buildHeap = (arr) => {
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, arr.length, i);
  }
};

const heapify = (arr, n, i) => {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
};

const heapSort = async (arr) => {
  buildHeap(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    clearCanvas(sortCtx);
    await drawArrayWithAnimation(sortCtx, arr, i);
    heapify(arr, i, 0);
  }
};

// Visualization Functions
const drawHeap = (ctx, arr, x, y, index, level = 0, gap = 120) => {
  if (index >= arr.length) return;

  drawNode(ctx, x, y, arr[index]);

  const left = 2 * index + 1;
  const right = 2 * index + 2;

  if (left < arr.length) {
    drawLine(ctx, x, y + 20, x - gap / (level + 1), y + 100 - 20);
    drawHeap(ctx, arr, x - gap / (level + 1), y + 100, left, level + 1, gap);
  }

  if (right < arr.length) {
    drawLine(ctx, x, y + 20, x + gap / (level + 1), y + 100 - 20);
    drawHeap(ctx, arr, x + gap / (level + 1), y + 100, right, level + 1, gap);
  }
};

const drawArrayWithAnimation = async (ctx, arr, sortedIndex) => {
  return new Promise((resolve) => {
    let x = 50;
    const y = 50;

    arr.forEach((value, index) => {
      ctx.fillStyle = index >= sortedIndex ? "#85e085" : "#87ceeb";
      ctx.fillRect(x, y, 50, 50);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(x, y, 50, 50);
      ctx.fillStyle = "#000";
      ctx.fillText(value, x + 15, y + 30);
      x += 60;
    });

    setTimeout(resolve, 500);
  });
};

// Main Logic
button.addEventListener("click", async () => {
  const input = inputField.value.trim();
  if (!input) {
    alert("Please enter an array of numbers!");
    return;
  }

  const arr = input.split(",").map(Number);
  if (arr.length > 10) {
    alert("Array size should not exceed 10!");
    return;
  }

  clearCanvas(heapCtx);
  clearCanvas(sortCtx);

  const heapArray = [...arr];
  buildHeap(heapArray);
  drawHeap(heapCtx, heapArray, heapCanvas.width / 2, 50, 0);

  await heapSort(arr);
});
