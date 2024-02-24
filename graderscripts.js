document.querySelectorAll('.tabs ul li').forEach(tab => {
    tab.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent the default anchor action

        let activeTabs = document.querySelectorAll('.is-active');
        activeTabs.forEach(function(tab) {
            tab.classList.remove('is-active');
        });

        tab.classList.add('is-active');

        let tabNumber = tab.getAttribute('data-tab');
        let activeContent = document.querySelectorAll('.tab-content');
        activeContent.forEach(function(content) {
            content.style.display = 'none';
        });

        document.querySelector('#tab-content-' + tabNumber).style.display = 'block';
    });
});

let criteriaCount = 0; // Initialize a counter for criteria

document.addEventListener('DOMContentLoaded', function() {
    addGradeSettings(); // Existing function to add grade settings
    initializeDefaultCriteria(); // New function to add a default criterium
});

function initializeDefaultCriteria() {
    // This could be the existing addCriteria logic, adjusted for initial load
    const table = document.getElementById('criteriaTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);
    criteriaCount++; // Assuming criteriaCount is a global variable to track the number of criteria

    let cellHtml = `
        <td>
        <div class="cell-container">
            <span class="criteria-name is-bold" onclick="editCriteria(this)">Default Criteria</span>
            <input class="input is-hidden" type="text" value="Default Criteria" onblur="updateCriteria(this)">
        </div>
        </td>
    `;
    for (let i = 1; i <= 6; i++) {
        cellHtml += `
        <td>
        <div class="cell-container">
            <input type="checkbox" name="criteria${criteriaCount}grade" value="${i}" onclick="checkOnlyOne(this)">
        </div>
        </td>
        `;
    }
    cellHtml += `
    <td>
    <div class="cell-container">
        <input class="input" type="number" min="1" max="10" value="5">
    </div>
    </td>`; // Weight input

    cellHtml += `
    <td>
    <div class="cell-container">
        <button class="delete" onclick="removeCriteria(this)"></button>
    </div>
    </td>`; // Delete button

    newRow.innerHTML = cellHtml;
}

// Plus, ensure all other function definitions like addGradeSettings(), editCriteria(), etc., are still present.


document.getElementById('addCriteria').addEventListener('click', function() {
    criteriaCount++; // Increment criteria count to ensure unique name for each group of checkboxes
    const table = document.getElementById('criteriaTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);

    let cellHtml = `
        <td>
        <div class="cell-container">
            <span class="criteria-name is-bold" onclick="editCriteria(this)">New Criteria</span>
            <input class="input is-hidden" type="text" value="New Criteria" onblur="updateCriteria(this)">
        </div>
        </td>
    `;
    for (let i = 1; i <= 6; i++) {
        cellHtml += `
        <td>
        <div class="cell-container">
            <input type="checkbox" name="criteria${criteriaCount}grade" value="${i}" onclick="checkOnlyOne(this)">
        </div>
        </td>
        `;
    }
    cellHtml += `
    <td>
    <div class="cell-container">
        <input class="input" type="number" min="1" max="10" value="5">
    </div>
    </td>`; // Weight input

    cellHtml += `
    <td>
    <div class="cell-container">
        <button class="delete" onclick="removeCriteria(this)"></button>
    </div>
    </td>`; // Delete button

    newRow.innerHTML = cellHtml;
});

function editCriteria(element) {
    let inputField = element.nextElementSibling;
    let textSpan = element.classList.contains('criteria-name') ? element : element.previousElementSibling;

    // Show the input field and hide the text span
    textSpan.classList.toggle('is-hidden');
    inputField.classList.toggle('is-hidden');
    inputField.focus();
    inputField.select();

    // Listen for Enter key press on the input field
    inputField.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) { // 13 is the Enter key
            // Trigger the blur event to update the criteria name
            this.blur();
        }
    });
}

function updateCriteria(input) {
    let textSpan = input.previousElementSibling;
    // Update the text span with the input's value
    textSpan.textContent = input.value;
    // Toggle visibility to show the updated criteria name and hide the input field
    textSpan.classList.toggle('is-hidden');
    input.classList.toggle('is-hidden');
}

function removeCriteria(btn) {
    const row = btn.closest('tr'); // Finds the nearest ancestor 'tr' element
    row.parentNode.removeChild(row);
}

function checkOnlyOne(checkbox) {
    let checkboxes = document.querySelectorAll(`input[name="${checkbox.name}"]`);
    checkboxes.forEach(chk => {
        if(chk !== checkbox) chk.checked = false;
    });
}

document.getElementById('calculateScore').addEventListener('click', function() {
    // Grade percentages and thresholds from the provided Python logic
    // Dynamically read grade percentages and thresholds from the settings
    const gradePercentages = Array.from(document.querySelectorAll('#gradeAScores input')).map(input => parseFloat(input.value));
    const gradeThresholds = Array.from(document.querySelectorAll('#gradeBScores input')).map(input => parseFloat(input.value));

    let criteriaScores = [];
    let weights = [];

    // Loop through each criteria to collect scores and weights
    document.querySelectorAll('#criteriaTable tbody tr').forEach(row => {
        const selectedGradeIndex = Array.from(row.querySelectorAll('input[type="checkbox"]')).findIndex(chk => chk.checked);
        if (selectedGradeIndex !== -1) { // Ensure a grade is selected
            criteriaScores.push(selectedGradeIndex + 1); // Adjust for 0-based index
            weights.push(parseFloat(row.querySelector('input[type="number"]').value));
        }
    });

    // Calculate adjusted weights and average score
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    const adjustedWeights = weights.map(weight => weight / totalWeight);
    let average = 0;
    criteriaScores.forEach((score, index) => {
        average += gradePercentages[score - 1] * adjustedWeights[index];
    });

    // Display the calculated average in the Final Score field
    document.getElementById('finalScore').value = average.toFixed(2);

    // Determine the final grade based on the calculated average
    let finalGrade = gradeThresholds.findIndex(threshold => average <= threshold);
    if (average > gradeThresholds[gradeThresholds.length - 1]) { // If average exceeds the last threshold
        finalGrade = 6; // Assign the highest grade
    }
    document.getElementById('finalGrade').value = `Karakter ${finalGrade}`; // Assuming you have a field to display this
    const finalGradeValue = document.getElementById('finalGrade').value;
    document.getElementById('overrideGrade').value = finalGradeValue.match(/\d+/) ? finalGradeValue : ""; // Extracts grade number if present
    updateOverrideGrade();
});

function updateOverrideGrade() {
    const finalGradeValue = document.getElementById('finalGrade').value;
    document.getElementById('overrideGrade').value = finalGradeValue.match(/\d+/) ? finalGradeValue : ""; // Extracts grade number if present
}

function addGradeSettings() {
    const grades = [1, 2, 3, 4, 5, 6];
    const defaultGradeScores = [10, 31, 50, 66.5, 83.5, 100]; // Example default scores for grades
    const defaultGradeThresholds = [0, 20, 42, 58, 75, 92]; // Example default thresholds for grades

    grades.forEach((grade, index) => {
        // Add Grade Score Setting (A) with pre-filled value
        document.querySelector('#gradeAScores').innerHTML += `
            <div class="field">
                <label class="label">Grade ${grade} (% Score)</label>
                <div class="control">
                    <input class="input" type="number" min="0" max="100" id="gradeAScore${grade}" placeholder="Score for Grade ${grade}" value="${defaultGradeScores[index]}">
                </div>
            </div>
        `;

        // Add Grade Threshold Setting (B) with pre-filled value
        document.querySelector('#gradeBScores').innerHTML += `
            <div class="field">
                <label class="label">Grade ${grade} Threshold (%)</label>
                <div class="control">
                    <input class="input" type="number" min="0" max="100" id="gradeBScore${grade}" placeholder="Threshold for Grade ${grade}" value="${defaultGradeThresholds[index]}">
                </div>
            </div>
        `;
    });
}

function enableEnterToEndEditing(selector) {
    document.querySelectorAll(selector).forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur(); // End editing by removing focus from the input
            }
        });
    });
}

// Call this function for grade percentage and threshold inputs
document.addEventListener('DOMContentLoaded', function() {
    // Assuming addGradeSettings and initializeDefaultCriteria are called here
    enableEnterToEndEditing('#gradeAScores input, #gradeBScores input');
});



function saveCriteria() {
    // Code to save criteria to local storage
}

function loadCriteria() {
    // Code to load criteria from local storage
}
