const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchBalloonData(hour = "00") {
  try {
    const res = await fetch(`${API_BASE}/balloons/${hour}`);
    return await res.json(); // [[lat, lon, height], ...]
  } catch (err) {
    console.error("fetchBalloonData failed", err);
    return null;
  }
}


export async function fetchBalloonHistory(hours = 24) {
  const results = [];

  for (let i = 0; i < hours; i++) {
    try {
      const res = await fetch(`${API_BASE}/balloons/${String(i).padStart(2, "0")}`);
      const data = await res.json();
      results.push(data);
    } catch (err) {
      console.warn(`Failed to fetch hour ${i}`, err);
    }
  }

  return results; // [ hour0[], hour1[], ... ]
}
