// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the loading screen
    const loadingScreen = document.getElementById('loadingScreen');

    // Create logo
    const logo = document.createElement('img');
    logo.src = 'favicon.png';
    logo.alt = 'FitnessTotal Logo';
    logo.style.width = '120px';  // Adjust the size as needed
    logo.style.height = '120px';
    logo.style.marginBottom = '20px';

    // Create title
    const title = document.createElement('h1');
    title.innerText = 'FitnessTotal';
    title.style.fontSize = '2rem';
    title.style.marginBottom = '15px';
    title.style.color = '#333';
    title.style.letterSpacing = '1.5px';

    // Create the timer
    const timer = document.createElement('div');
    timer.id = 'timer';
    timer.style.fontSize = '2.5rem';
    timer.style.color = '#FF6347';  // A strong color to draw attention
    timer.style.marginBottom = '10px';
    timer.innerText = 'Loading...';

    // Append elements to loading screen
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.flexDirection = 'column';
    loadingScreen.style.height = '100vh';
    loadingScreen.style.backgroundColor = '#f5f5f5';
    loadingScreen.appendChild(logo);
    loadingScreen.appendChild(title);
    loadingScreen.appendChild(timer);

    // Countdown timer to a specific date
    const countdownDate = new Date("October 20, 2024 14:30:00").getTime();  // Set the target date here

    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = countdownDate - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Update the timer element with the remaining time
        timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // When the countdown reaches zero, hide the loading screen and show main content
        if (timeLeft < 0) {
            clearInterval(countdown);
            document.getElementById('loadingScreen').style.display = 'none';  // Hide the loading screen
            document.getElementById('mainContent').style.display = 'block';  // Show the main content
        }
    }, 1000);
});
