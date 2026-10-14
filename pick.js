
export function pick(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

export function startPick() {
  const result = pick(["Option 1", "Option 2", "Option 3"]);
  console.log("Picked:", result);
  return result;
}
