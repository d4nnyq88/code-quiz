var timerElement = document.querySelector("#timer-text");
var highScores = document.querySelector("#high-scores");
var startButton = document.querySelector(".start-button");
var titleText = document.querySelector("#title-text");
var mainText = document.querySelector("#main-text");
var buttonContainer = document.querySelector("#button-container");
var choicesContainer = document.querySelector("#choices-container");
var alertContainer = document.querySelector("#alert-container");
var resetContainer = document.querySelector("#reset-container");
var highScoresList = document.querySelector("#high-scores-list");
var highScoreForm;
var submitHighScore;
var resetButton;
var inputHighScore;
var timerCount;
var timerInterval;
var questionIndex = 0;
var highScoresArray = [];

//question object array
var questions = [{
        question: "What HTML element do we put JavaScript inside?",
        choices: ["<head>", "<meta>", "<script>", "<style>", "<javascript>"],
        answer: "<script>"
    },
    {
        question: "What data type is used to represent true or false in JavaScript?",
        choices: ["Boolean", "Number", "Float", "Undefined", "NaN"],
        answer: "Boolean"
    },
    {
        question: "What does CSS stand for?",
        choices: ["Code Style Sheets", "Cascading Style Sheets", "Cascading Style Syntax", "Cool Style Sheets", "Code Style Syntax"],
        answer: "Cascading Style Sheets"
    },
    {
        question: "Which coding language is used to mark up elements on a web page?",
        choices: ["CSS", "JavaScript", "TypeScript", "JAVA", "HTML"],
        answer: "HTML"
    },
    {
        question: "Which of the following is typically used to store numbers in JavaScript?",
        choices: ["object", "variable", "character", "number", "array"],
        answer: "array"
    },
]

function init() {
    displayStart();
    resetContainer.innerHTML = '';
    highScoresList.innerHTML = '';
    mainText.textContent = "Answer the following questions within the alotted time limit. \n Incorrect answers will substract 10 points from your score/time! Good luck!"
    timerCount = 60;
    timerElement.textContent = "Time: " + timerCount;
    var storedHighScores = JSON.parse(localStorage.getItem("highScoresArray"));
    if (storedHighScores !== null) {
        highScoresArray = storedHighScores;
    }
}

function displayStart() {
    titleText.textContent = "Code Quiz Challenge";
    startButton = document.createElement("button");
    startButton.setAttribute("class", "start-button");
    startButton.textContent = "Start Quiz";
    buttonContainer.appendChild(startButton);
    startButton.addEventListener("click", startGame);
}

function startGame() {
    startButton.disabled = true;
    buttonContainer.innerHTML = '';
    highScoresList.innerHTML = '';
    displayQuestion();
    startTime();
}


function displayQuestion() {
    var currentQuestion = questions[questionIndex];
    titleText.innerHTML = '';
    titleText.textContent = currentQuestion.question;
    mainText.innerHTML = '';
    choicesContainer.innerHTML = '';
    currentQuestion.choices.forEach(function (choice, i) {
        var choiceButton = document.createElement("button");
        choiceButton.textContent = i + 1 + ". " + choice;
        choiceButton.setAttribute("class", "choice");
        choiceButton.setAttribute("value", choice);
        choiceButton.onclick = questionClick;
        choicesContainer.appendChild(choiceButton);
    })
}

function questionClick() {
    alertContainer.innerHTML = '';
    document.getElementById('alert-container').style.display = 'initial';

    if (questions[questionIndex].answer === this.value) {
        displayAlert("Correct!");
        setTimeout(function () {
            document.getElementById('alert-container').style.display = 'none'
        }, 2000);        
    } else {
        displayAlert("Wrong!");
        setTimeout(function () {
            document.getElementById('alert-container').style.display = 'none'
        }, 2000);
        timerCount -= 20;
    }

    if (questionIndex === questions.length - 1) {
        return displayEnd(); //call function display input scores page;
    }
    questionIndex++;
    displayQuestion();
}

function displayEnd() {
    clearInterval(timerInterval);
    titleText.innerHTML = '';
    titleText.textContent = 'All done!';
    mainText.innerHTML = '';
    mainText.textContent = 'Your final score is ' + timerCount;
    choicesContainer.innerHTML = '';
    questionIndex = 0;

    inputHighScoresForm();
    displayResetButton();

    submitHighScore = document.querySelector("#submit-score");
    inputHighScore = document.querySelector("#high-score-text");
    highScoreForm.addEventListener("submit", function (event) {
        event.preventDefault();
        resetContainer.innerHTML = '';
        var highScoreText = inputHighScore.value.trim();
        if (highScoreText === "") {
            return;
        }

        highScoresArray.push(highScoreText + ": " + timerCount);
        inputHighScore.value = "";

        storeHighScore();
        displayHighScores();
    });
}

function storeHighScore() {
    localStorage.setItem("highScoresArray", JSON.stringify(highScoresArray));
}

function displayHighScores() {
    highScoresList.innerHTML = '';
    resetContainer.innerHTML = '';
    titleText.textContent = "High Scores"
    mainText.textContent = "All time high scores below:"
    for (var i = 0; i < highScoresArray.length; i++) {
        var highScore = highScoresArray[i];

        var li = document.createElement("li");
        li.textContent = highScore;
        li.setAttribute("data-index", i);

        highScoresList.appendChild(li);
    }
    displayResetButton();
}

function inputHighScoresForm() {
    highScoreForm = document.createElement("form");
    highScoreForm.setAttribute("id", "high-score-form");
    highScoreForm.setAttribute("class", "pt");
    inputHighScore = document.createElement("input");
    inputHighScore.setAttribute("id", "high-score-text");
    inputHighScore.setAttribute("type", "text");
    submitHighScore = document.createElement("button");
    submitHighScore.setAttribute("id", "submit-score");
    submitHighScore.setAttribute("type", "submit");
    submitHighScore.textContent = "Submit";
    mainText.appendChild(highScoreForm);
    highScoreForm.appendChild(inputHighScore);
    highScoreForm.appendChild(submitHighScore);
}

function displayAlert(alertText) {
    var alert = document.createElement("input");
    alert.setAttribute("class", "alert");
    alert.setAttribute("value", alertText);
    alert.setAttribute("disabled", true);
    alertContainer.appendChild(alert);
}

function startTime() {
    // Sets interval in variable
    timerInterval = setInterval(function () {
        timerCount--;

        if (timerCount <= 0) {
            // Stops execution of action at set interval
            clearInterval(timerInterval);
            resetContainer.innerHTML = '';
            titleText.innerHTML = '';
            titleText.textContent = 'Game over! You ran out of time!';
            choicesContainer.innerHTML = '';
            questionIndex = 0;
            timerCount = 0;
            displayResetButton();

        }
        timerElement.textContent = "Time: " + timerCount;

    }, 1000); //1000 milliseconds setInterval(function to run at each interval, time in milliseconds between each interval)
}

function displayResetButton() {
    buttonContainer.innerHTML = '';
    choicesContainer.innerHTML = '';
    resetButton = document.createElement("button");
    resetButton.setAttribute("class", "reset-button");
    resetButton.textContent = "Reset";
    resetContainer.appendChild(resetButton);
    resetButton = document.querySelector(".reset-button");
    resetButton.addEventListener("click", init);
}

init();
highScores.addEventListener("click", displayHighScores);