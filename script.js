// Add a new poll option
function addOption() {
    const container = document.getElementById("poll-options");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Option ${container.children.length + 1}`;
    container.appendChild(input);
}

// Create & save poll in localStorage
function createPoll() {
    const question = document.getElementById("poll-question").value;
    const options = Array.from(document.querySelectorAll("#poll-options input"))
        .map(input => input.value.trim()).filter(opt => opt !== "");

    if (!question || options.length < 2) {
        alert("Enter a valid question & at least two options.");
        return;
    }

    const poll = { question, options, votes: Array(options.length).fill(0) };
    localStorage.setItem("poll", JSON.stringify(poll));
    location.href = "vote.html";
}

// Display poll for voting
function displayPoll() {
    const pollData = JSON.parse(localStorage.getItem("poll"));
    if (!pollData) return;

    const pollDisplay = document.getElementById("poll-display");
    pollDisplay.innerHTML = `<h2>${pollData.question}</h2>`;

    pollData.options.forEach((option, index) => {
        pollDisplay.innerHTML += `<p><input type='radio' name='poll' value='${index}'> ${option}</p>`;
    });
}

// Submit vote
function submitVote() {
    if (localStorage.getItem("voted")) {
        alert("You have already voted!");
        return;
    }

    const selectedOption = document.querySelector("input[name='poll']:checked");
    if (!selectedOption) {
        alert("Please select an option.");
        return;
    }

    const pollData = JSON.parse(localStorage.getItem("poll"));
    pollData.votes[selectedOption.value]++;
    localStorage.setItem("poll", JSON.stringify(pollData));
    localStorage.setItem("voted", "true");

    alert("Vote submitted successfully!");
    location.href = "results.html";
}

// Display poll results
function displayResults() {
    const pollData = JSON.parse(localStorage.getItem("poll"));
    if (!pollData) return;

    const resultsDisplay = document.getElementById("results-display");
    resultsDisplay.innerHTML = `<h2>${pollData.question}</h2>`;

    pollData.options.forEach((option, index) => {
        resultsDisplay.innerHTML += `<p>${option} - ${pollData.votes[index]} votes</p>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("poll-display")) displayPoll();
    if (document.getElementById("results-display")) displayResults();
});
