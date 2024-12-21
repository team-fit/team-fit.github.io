const quoteBox = document.getElementById('quoteBox');
const getQuoteBtn = document.getElementById('getQuoteBtn');
const loadingIndicator = document.getElementById('loading');
const twitterShare = document.getElementById('twitterShare');

// Function to fetch a random quote from ZenQuotes API via a CORS proxy
const fetchQuote = async () => {
  try {
    // Show loading indicator
    loadingIndicator.classList.remove('hidden');
    
    // Use CORS proxy to bypass CORS restrictions
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const targetUrl = 'https://zenquotes.io/api/random';

    // Make an API request to get a random quote
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl) + `?timestamp=${new Date().getTime()}`); // Add a timestamp to avoid caching

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    const quote = data[0].q;  // Quote text
    const author = data[0].a; // Author name

    // Display the quote and author in the textarea
    quoteBox.value = `"${quote}"\n\n- ${author}`;

    // Hide loading indicator
    loadingIndicator.classList.add('hidden');
  } catch (error) {
    // Handle error and display a message in the quote box
    console.error("Error fetching quote:", error);
    quoteBox.value = "Oops! Could not fetch a new quote. Please try again later.";
    loadingIndicator.classList.add('hidden');
  }
};

// Event listener for the button click
getQuoteBtn.addEventListener('click', () => {
  fetchQuote();

  // Teleport the button to a random position on the screen
  teleportButton();
});

// Function to teleport the button to a random position
function teleportButton() {
  // Random x and y positions within the window dimensions
  const randomX = Math.random() * (window.innerWidth - getQuoteBtn.offsetWidth); // Random X position
  const randomY = Math.random() * (window.innerHeight - getQuoteBtn.offsetHeight); // Random Y position

  // Set new position for the button
  getQuoteBtn.style.left = `${randomX}px`;
  getQuoteBtn.style.top = `${randomY}px`;
}

// Fetch a new quote when the page loads for the first time
window.onload = fetchQuote;  // Automatically triggers the fetchQuote function on page load
