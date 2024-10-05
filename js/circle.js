// script.js
const container = document.querySelector('.animation-container');

for (let i = 0; i < 5; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    
    // Randomize the vertical position and animation delay
    circle.style.top = `${Math.random() * 100}px`; 
    circle.style.animationDelay = `${i * 0.5}s`; // Stagger the animation

    // Append circle to the container
    container.appendChild(circle);
}
