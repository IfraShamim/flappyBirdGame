let moveSpeed = 3;
let gravity = 0.5; 
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let soundPoint = new Audio("sounds effect/point.mp3");
let soundDie = new Audio("sounds effect/die.mp3");
let message = document.getElementById("message");
let scoreValue = document.getElementById("scoreValue");
let scoreTitle = document.getElementById("scoreTitle");

// Getting Bird Element Properties
let birdProps = bird.getBoundingClientRect();
let background = document.getElementById("background").getBoundingClientRect();

let gameState = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

// Start game when Enter key is pressed
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && gameState !== "Play") {
        startGame();
    }
});

// Start game when virtual Enter button is clicked
const enterButton = document.getElementById("enterButton");
enterButton.addEventListener("click", startGame);

function startGame() {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
        e.remove();
    });
    img.style.display = "block";
    bird.style.top = "40vh";
    gameState = "Play";
    message.innerHTML = "";
    scoreTitle.innerHTML = "Score : "; 
    scoreValue.innerHTML = "0"; // Reset score value
    message.classList.remove("messageStyle");
    play(); 
}

function play() {
    move(); 

    function move() {
        if (gameState !== "Play") return;

        let pipeSprites = document.querySelectorAll(".pipe_sprite");
        pipeSprites.forEach((element) => {
            let pipeSpriteProps = element.getBoundingClientRect();
            birdProps = bird.getBoundingClientRect(); // Recalculate bird properties

            if (pipeSpriteProps.right <= 0) {
                element.remove(); // Remove pipe if off screen
            } else {
                // Check for collision
                if (
                    birdProps.left < pipeSpriteProps.left + pipeSpriteProps.width &&
                    birdProps.left + birdProps.width > pipeSpriteProps.left &&
                    birdProps.top < pipeSpriteProps.top + pipeSpriteProps.height &&
                    birdProps.top + birdProps.height > pipeSpriteProps.top
                ) {
                    gameState = "End"; // End the game on collision
                    message.innerHTML =
                        "Game Over".fontcolor("red") + "<br>Press Enter To Restart";
                    message.classList.add("messageStyle");
                    img.style.display = "none";
                    soundDie.play();
                    return;
                } else {
                    // Increment score logic
                    if (
                        pipeSpriteProps.right < birdProps.left &&
                        pipeSpriteProps.right + moveSpeed >= birdProps.left &&
                        element.increase_score == "1"
                    ) {
                        scoreValue.innerHTML = parseInt(scoreValue.innerHTML) + 1; // Increment score correctly
                        soundPoint.play();
                    }
                    // Move the pipe left
                    element.style.left = pipeSpriteProps.left - moveSpeed + "px";
                }
            }
        });

        requestAnimationFrame(move); // Request next frame for moving
    }

    // Gravity function defined
    let birdDy = 0;
    applyGravity(); 

    function applyGravity() {
        if (gameState != "Play") return;

        birdDy += gravity; // Update bird's vertical speed

        document.addEventListener("keydown", (e) => {
            if (e.key == "ArrowUp" || e.key == " ") {
                img.src = "images/Bird-2.png";
                birdDy = -7.6; // Flap the bird
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key == "ArrowUp" || e.key == " ") {
                img.src = "images/Bird.png";
            }
        });

        // Check if bird hits the top or bottom of the screen
        if (birdProps.top <= 0 || birdProps.bottom >= background.bottom) {
            gameState = "End"; // End the game if the bird is out of bounds
            message.style.left = "28vw"; // Center message
            window.location.reload(); // Reload the game
            message.classList.remove("messageStyle");
            return;
        }

        bird.style.top = birdProps.top + birdDy + "px"; // Update bird's position
        birdProps = bird.getBoundingClientRect(); // Recalculate bird properties
        requestAnimationFrame(applyGravity); // Request next frame for gravity
    }

    let pipeSeparation = 0;
    let pipeGap = 35;

    function createPipe() {
        if (gameState != "Play") return;

        if (pipeSeparation > 115) {
            pipeSeparation = 0;

            let pipePosi = Math.floor(Math.random() * 43) + 8;
            let pipeSpriteInv = document.createElement("div");
            pipeSpriteInv.className = "pipe_sprite";
            pipeSpriteInv.style.top = pipePosi - 70 + "vh";
            pipeSpriteInv.style.left = "100vw";

            document.body.appendChild(pipeSpriteInv);
            let pipeSprite = document.createElement("div");
            pipeSprite.className = "pipe_sprite";
            pipeSprite.style.top = pipePosi + pipeGap + "vh";
            pipeSprite.style.left = "100vw";
            pipeSprite.increase_score = "1";

            document.body.appendChild(pipeSprite);
        }
        pipeSeparation++;
        requestAnimationFrame(createPipe); // Request next frame for creating pipes
    }
    requestAnimationFrame(createPipe); // Start creating pipes
}

// Start the game when the page loads
requestAnimationFrame(move);
flapButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    simulateKeyPress('ArrowUp');
});

// Function to simulate key press for Arrow Up
function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        code: key,
        keyCode: key === 'ArrowUp' ? 38 : 0, // keyCode for ArrowUp
        charCode: 0,
        bubbles: true
    });
    document.dispatchEvent(event);
}
