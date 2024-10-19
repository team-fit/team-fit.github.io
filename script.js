document.addEventListener("DOMContentLoaded", () => {
    // Variable declarations and element selections
    const exerciseContainer = document.getElementById('exerciseContainer');
    const popup = document.getElementById('popup');
    const popupDescription = document.getElementById('popupDescription');
    const closeBtn = document.querySelector('.close');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let isPopupOpen = false;
    let isTransitioning = false;
    let animationInterval = null;
    let currentExercise = null;
    let exercises = [];

    // Auxiliary elements
    const popupBackground = document.createElement('div');
    popupBackground.classList.add('popup-background');

    // Event listeners
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filterExercises(searchTerm, getActiveCategory());
    });

    searchInput.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            filterExercises(searchTerm, getActiveCategory());
            scrollToFirstResult();
            searchInput.blur(); // Remove keyboard focus
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            filterExercises(category === 'all' ? '' : searchInput.value.toLowerCase(), category);
            
            // Clear search input if category is 'all'
            if (category === 'all') {
                searchInput.value = '';
            }
        });
    });
    

    searchInput.addEventListener('touchstart', event => {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            touchStartY = touch.clientY;
        }
    });

    searchInput.addEventListener('touchmove', event => {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const deltaY = Math.abs(touch.clientY - touchStartY);
            if (deltaY > 10) {
                event.preventDefault();
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        closePopup();
    });

    popupBackground.addEventListener('click', () => {
        closePopup();
    });

    // Fetching exercises from JSON file
    fetch('exercises.json')
        .then(response => response.json())
        .then(data => {
            exercises = data;
            displayExercises(exercises);
        })
        .catch(error => console.error('Error fetching exercises:', error));

    // Function declarations
    function displayExercises(exercises) {
        exerciseContainer.innerHTML = '';
        exercises.forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.classList.add('exercise-item');
            exerciseItem.setAttribute('data-category', exercise.equipment.join(' '));

            const titleElement = document.createElement('h3');
            titleElement.textContent = exercise.title;

            const img1 = new Image();
            img1.src = exercise.svg[0];
            img1.alt = exercise.title;

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.primer;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'View Exercise';

            viewButton.addEventListener('click', () => {
                if (!isPopupOpen && !isTransitioning) {
                    showPopup(exercise);
                }
            });

            exerciseItem.appendChild(titleElement);
            exerciseItem.appendChild(img1);
            exerciseItem.appendChild(descriptionElement);
            exerciseItem.appendChild(viewButton);
            exerciseContainer.appendChild(exerciseItem);
        });
    }

    function filterExercises(searchTerm, category) {
        let filteredExercises = exercises;

        if (category !== 'all') {
            if (category === 'ball') {
                filteredExercises = filteredExercises.filter(exercise =>
                    exercise.equipment.some(eq => eq.toLowerCase().includes('ball'))
                );
            } else if (category === 'band') {
                filteredExercises = filteredExercises.filter(exercise =>
                    exercise.equipment.some(eq => eq.toLowerCase().includes('band'))
                );
            } else {
                filteredExercises = filteredExercises.filter(exercise =>
                    exercise.equipment.some(eq => eq.toLowerCase().includes(category))
                );
            }
        }

        if (searchTerm) {
            filteredExercises = filteredExercises.filter(exercise =>
                exercise.title.toLowerCase().includes(searchTerm) ||
                exercise.primer.toLowerCase().includes(searchTerm) ||
                exercise.steps.some(step => step.toLowerCase().includes(searchTerm)) ||
                (exercise.tips && exercise.tips.some(tip => tip.toLowerCase().includes(searchTerm)))
            );
        }

        displayExercises(filteredExercises);
    }

    function getActiveCategory() {
        const activeButton = document.querySelector('.filter-btn.active');
        return activeButton ? activeButton.dataset.category : 'all';
    }

    function showPopup(exercise) {
        currentExercise = exercise;
        isTransitioning = true;
        popup.style.height = 'auto';
        popupDescription.innerHTML = '';

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        exercise.svg.forEach((svgFile, index) => {
            const svgObject = new Image();
            svgObject.src = svgFile;
            svgObject.classList.add('popup-svg');
            svgObject.style.borderRadius = '20px';
            svgObject.style.opacity = index === 0 ? '1' : '0';
            imageContainer.appendChild(svgObject);
        });

        const textContent = document.createElement('div');
        textContent.classList.add('text-content');
        textContent.innerHTML = `<h3>${exercise.title}</h3>
                                 <p>${exercise.primer}</p>
                                 <h4>Exercise Steps:</h4>
                                 <ul>${exercise.steps.map(step => `<li>${step}</li>`).join('')}</ul>
                                 ${exercise.tips.length > 0 ? `<h4>Tips:</h4><ul>${exercise.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>` : ''}`;

        popupDescription.appendChild(imageContainer);
        popupDescription.appendChild(textContent);

        popup.classList.add('show');
        document.body.classList.add('popup-open');
        document.body.appendChild(popupBackground);
        setTimeout(() => {
            popupBackground.style.opacity = '1';
        }, 10);
        startAnimation(exercise);
        isPopupOpen = true;
        isTransitioning = false;

        adjustPopupSize();
    }

    function startAnimation(exercise) {
        let index = 0;
        if (animationInterval) {
            clearInterval(animationInterval);
        }
        animationInterval = setInterval(() => {
            if (isPopupOpen) {
                index = (index === 0) ? 1 : 0;
                const svgObjects = document.querySelectorAll('.image-container .popup-svg');
                svgObjects.forEach((svgObject, idx) => {
                    svgObject.style.opacity = idx === index ? '1' : '0';
                });
            }
        }, 1000);
    }

    function closePopup() {
        popup.classList.remove('show');
        document.body.classList.remove('popup-open');
        popupBackground.style.opacity = '0';
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        setTimeout(() => {
            popupDescription.innerHTML = '';
            popupBackground.remove();
            isPopupOpen = false;
        }, 300);
    }

    function adjustPopupSize() {
        const popupContent = popup.querySelector('.popup-content');
        const windowHeight = window.innerHeight;

        const popupDescriptionHeight = popupDescription.offsetHeight;
        const totalHeight = popupDescriptionHeight;

        if (totalHeight > windowHeight) {
            popupDescription.style.maxHeight = `${windowHeight - 60}px`;
            popupDescription.style.overflowY = 'auto';
        } else {
            popupDescription.style.maxHeight = 'none';
            popupDescription.style.overflowY = 'visible';
        }

        popupContent.style.maxHeight = `${windowHeight - 40}px`;
        popupContent.style.overflowY = 'auto';
    }

    function scrollToFirstResult() {
        const firstResult = document.querySelector('.exercise-item');
        if (firstResult) {
            firstResult.scrollIntoView({ block: 'start' });
        }
    }
});
