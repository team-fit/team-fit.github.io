// Retrieve workout settings from localStorage
const sets = parseInt(localStorage.getItem('sets'));
const reps = parseInt(localStorage.getItem('reps'));
const total_time = parseInt(localStorage.getItem('total_time'));

// Calculate time per set and rest period
const exercise_time_per_set = Math.floor(total_time / sets);
const break_time_per_set = Math.floor(exercise_time_per_set * 0.25);

let currentSet = 1;
let currentRep = 0;
let totalTimeLeft = total_time;
let exerciseTimeLeft = exercise_time_per_set;
let restTimeLeft = 0;
let inRestPeriod = false;

// Update UI elements
const totalTimerDisplay = document.getElementById('total-timer');
const exerciseTimerDisplay = document.getElementById('exercise-timer');
const restTimerDisplay = document.getElementById('rest-timer');
const currentSetDisplay = document.getElementById('current-set');
const currentRepsDisplay = document.getElementById('current-reps');
const totalSetsDisplay = document.getElementById('total-sets');
const totalRepsDisplay = document.getElementById('total-reps');

// Initialize UI
totalSetsDisplay.textContent = sets;
totalRepsDisplay.textContent = reps;

// Timer logic
function startTimer() {
    const interval = setInterval(() => {
        if (totalTimeLeft > 0) {
            if (inRestPeriod) {
                if (restTimeLeft > 0) {
                    restTimeLeft--;
                } else {
                    nextSet();
                }
            } else {
                if (exerciseTimeLeft > 0) {
                    exerciseTimeLeft--;
                    currentRep = Math.floor((exercise_time_per_set - exerciseTimeLeft) / (exercise_time_per_set / reps));
                } else {
                    startRestPeriod();
                }
            }
            totalTimeLeft--;
            updateUI();
        } else {
            clearInterval(interval);
            alert("Workout Complete! Great job!");
        }
    }, 1000);
}

// Start the rest period
function startRestPeriod() {
    inRestPeriod = true;
    restTimeLeft = break_time_per_set;
}

// Move to the next set
function nextSet() {
    if (currentSet < sets) {
        currentSet++;
        exerciseTimeLeft = exercise_time_per_set;
        inRestPeriod = false;
    }
}

// Update the UI
function updateUI() {
    totalTimerDisplay.textContent = formatTime(totalTimeLeft);
    exerciseTimerDisplay.textContent = formatTime(exerciseTimeLeft);
    restTimerDisplay.textContent = formatTime(restTimeLeft);
    currentSetDisplay.textContent = currentSet;
    currentRepsDisplay.textContent = currentRep;
}

// Format time as HH:MM:SS
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Start the workout timer
startTimer();
