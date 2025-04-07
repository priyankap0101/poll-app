// Utility function to show in-page messages
function showMessage(message, type = "error") {
    let messageBox = document.getElementById("message-box");

    if (!messageBox) {
        messageBox = document.createElement("div");
        messageBox.id = "message-box";
        document.body.insertBefore(messageBox, document.body.firstChild);
    }

    messageBox.innerHTML = message;
    messageBox.className = `message ${type}`;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
}

// Function to add a new poll option dynamically
function addOption() {
    const container = document.getElementById("poll-options");

    if (!container) {
        showMessage("❌ Poll options container not found!", "error");
        return;
    }

    const optionCount = container.querySelectorAll(".poll-option").length + 1;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "poll-option";
    input.placeholder = `Option ${optionCount}`;
    input.setAttribute("data-option-index", optionCount);

    container.appendChild(input);
}

// Function to create and save the poll in localStorage
function createPoll() {
    const questionInput = document.getElementById("poll-question");
    const optionsContainer = document.getElementById("poll-options");

    if (!questionInput || !optionsContainer) {
        showMessage("❌ Missing required elements in the form!", "error");
        return;
    }

    const question = questionInput.value.trim();
    const options = Array.from(optionsContainer.querySelectorAll(".poll-option"))
        .map(input => input.value.trim())
        .filter(opt => opt !== "");

    if (!question) {
        showMessage("❌ Please enter a question.", "error");
        return;
    }

    if (options.length < 2) {
        showMessage("⚠ Please add at least two options.", "warning");
        return;
    }

    const poll = { question, options, votes: Array(options.length).fill(0) };
    localStorage.setItem("poll", JSON.stringify(poll));

    showMessage("✅ Poll created successfully!", "success");

    setTimeout(() => {
        location.href = "vote.html";
    }, 1000);
}

// Function to display the poll for voting
function displayPoll() {
    const pollData = JSON.parse(localStorage.getItem("poll"));
    if (!pollData) return;

    const pollDisplay = document.getElementById("poll-display");
    if (!pollDisplay) return;

    pollDisplay.innerHTML = `<h2>${pollData.question}</h2>`;

    pollData.options.forEach((option, index) => {
        const optionElement = document.createElement("p");
        optionElement.innerHTML = `<input type='radio' name='poll' value='${index}'> ${option}`;
        pollDisplay.appendChild(optionElement);
    });

    const voteButton = document.createElement("button");
    voteButton.textContent = "Submit Vote";
    voteButton.onclick = submitVote;
    pollDisplay.appendChild(voteButton);
}

// Function to submit a vote
function submitVote() {
    if (localStorage.getItem("voted")) {
        showMessage("⚠ You have already voted!", "warning");
        return;
    }

    const selectedOption = document.querySelector("input[name='poll']:checked");
    if (!selectedOption) {
        showMessage("❌ Please select an option.", "error");
        return;
    }

    const pollData = JSON.parse(localStorage.getItem("poll"));
    pollData.votes[selectedOption.value]++;
    localStorage.setItem("poll", JSON.stringify(pollData));
    localStorage.setItem("voted", "true");

    showMessage("✅ Vote submitted successfully!", "success");

    setTimeout(() => {
        location.href = "results.html";
    }, 1000);
}

// Function to display poll results
function displayResults() {
    const pollData = JSON.parse(localStorage.getItem("poll"));
    if (!pollData) return;

    const resultsDisplay = document.getElementById("results-display");
    if (!resultsDisplay) return;

    resultsDisplay.innerHTML = `<h2>${pollData.question}</h2>`;

    pollData.options.forEach((option, index) => {
        resultsDisplay.innerHTML += `<p>${option} - ${pollData.votes[index]} votes</p>`;
    });
}

// Run functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("poll-display")) displayPoll();
    if (document.getElementById("results-display")) displayResults();
});
