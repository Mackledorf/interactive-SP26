// Function to update clock hands
function updateClock() {
    const now = new Date();
    
    // Get current time
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    
    // Calculate degrees for each hand
    // Hour hand: moves 30° per hour (360°/12) plus additional rotation based on minutes
    const hourDeg = (hours * 30) + (minutes * 0.5);
    
    // Minute hand: moves 6° per minute (360°/60) plus additional rotation based on seconds
    const minuteDeg = (minutes * 6) + (seconds * 0.1);
    
    // Second hand: moves 6° per second (360°/60) with smooth millisecond transition
    const secondDeg = (seconds * 6) + (milliseconds * 0.006);
    
    // Apply rotation to hands
    document.getElementById('hour').style.transform = `rotate(${hourDeg}deg)`;
    document.getElementById('minute').style.transform = `rotate(${minuteDeg}deg)`;
    document.getElementById('second').style.transform = `rotate(${secondDeg}deg)`;
}

// Update clock immediately on load
updateClock();

// Update clock every 50ms for smooth second hand movement
setInterval(updateClock, 50);
