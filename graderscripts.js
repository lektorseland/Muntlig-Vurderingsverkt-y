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
    addGradeSettings();
    initializeDefaultCriteria();
    enableEnterToEndEditing('#gradeAScores input, #gradeBScores input');
    document.getElementById('exportSettings').addEventListener('click', exportAppState);
    document.getElementById('importSettings').addEventListener('change', importAppState);
});

function exportAppState() {
    const criteria = Array.from(document.querySelectorAll('#criteriaTable tbody tr')).map(row => ({
        criteria: row.querySelector('input[type="text"]').value,
        weight: row.querySelector('input[type="number"]').value,
    }));

    const settings = {
        gradePercentages: Array.from(document.querySelectorAll('#gradeAScores input')).map(input => parseFloat(input.value)),
        gradeThresholds: Array.from(document.querySelectorAll('#gradeBScores input')).map(input => parseFloat(input.value))
    };

    const appState = JSON.stringify({ criteria, settings }, null, 2);

    const blob = new Blob([appState], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MuntligVurdering.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importAppState(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const appState = JSON.parse(e.target.result);
        applyAppState(appState);
    };
    reader.readAsText(file);
}

function applyAppState(appState) {
    document.querySelector('#criteriaTable tbody').innerHTML = '';
    criteriaCount = 0;

    appState.criteria.forEach(crit => {
        addCriteria(crit.criteria, crit.weight);
    });

    appState.settings.gradePercentages.forEach((val, index) => {
        document.querySelectorAll('#gradeAScores input')[index].value = val;
    });

    appState.settings.gradeThresholds.forEach((val, index) => {
        document.querySelectorAll('#gradeBScores input')[index].value = val;
    });
}

// Ensure the addCriteria and other functions are updated or implemented as suggested in previous messages.

function initializeDefaultCriteria() {
    // This could be the existing addCriteria logic, adjusted for initial load
    const table = document.getElementById('criteriaTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);
    criteriaCount++; // Assuming criteriaCount is a global variable to track the number of criteria

    let cellHtml = `
        <td>
        <div class="cell-container">
            <span class="criteria-name is-bold" onclick="editCriteria(this)">Kriterie 1 (klikk for å redigere)</span>
            <input class="input is-hidden" type="text" value="Kriterie 1" onblur="updateCriteria(this)">
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


function addCriteria(name = "Nytt kriterie", weight = 5, selectedGrade = 0) {
    criteriaCount++; // Ensure this is declared at the global scope
    const table = document.getElementById('criteriaTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    let cellHtml = `
        <td>
            <div class="cell-container">
                <span class="criteria-name is-bold" onclick="editCriteria(this)">${name}</span>
                <input class="input is-hidden" type="text" value="${name}" onblur="updateCriteria(this)">
            </div>
        </td>`;

    for (let i = 1; i <= 6; i++) {
        cellHtml += `
        <td>
            <div class="cell-container">
                <input type="checkbox" name="criteria${criteriaCount}grade" value="${i}" ${i === selectedGrade ? 'checked' : ''} onclick="checkOnlyOne(this)">
            </div>
        </td>`;
    }

    cellHtml += `
        <td>
            <div class="cell-container">
                <input class="input" type="number" min="1" max="10" value="${weight}">
            </div>
        </td>
        <td>
            <div class="cell-container">
                <button class="delete" onclick="removeCriteria(this)"></button>
            </div>
        </td>`;

    newRow.innerHTML = cellHtml;
}

// Bind addCriteria to the "Click to add criteria" button
document.getElementById('addCriteria').addEventListener('click', () => addCriteria());


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
                <label class="label">Karakter ${grade} (% Verdi)</label>
                <div class="control">
                    <input class="input" type="number" min="0" max="100" id="gradeAScore${grade}" placeholder="Score for Grade ${grade}" value="${defaultGradeScores[index]}">
                </div>
            </div>
        `;

        // Add Grade Threshold Setting (B) with pre-filled value
        document.querySelector('#gradeBScores').innerHTML += `
            <div class="field">
                <label class="label">Karakter ${grade} (Nedre grense %)</label>
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

document.getElementById('savePDF').addEventListener('click', function() {
    // Gather inputs
    const studentName = document.getElementById('studentName').value.trim();
    const course = document.getElementById('course').value.trim();
    const evaluation = document.getElementById('evaluation').value.trim();

    // Construct filename
    let filename = "Vurdering.pdf";
    if (studentName || course || evaluation) {
        filename = `${studentName}_${evaluation}_${course}.pdf`.replace(/__+/g, '_').replace(/^_|_$/g, '');
    }

    // Hide buttons within the content area
    const buttons = document.querySelectorAll('#tab-content-1 button');

    html2canvas(document.getElementById('tab-content-1'), { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const margin = 20;
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfImageWidth = pdfWidth;
        const pdfImageHeight = (imgProps.height * pdfImageWidth) / imgProps.width;

        if (pdfImageHeight > pdf.internal.pageSize.getHeight() - 2 * margin) {
            const pdfImageHeightAdjusted = pdf.internal.pageSize.getHeight() - 2 * margin;
            const pdfImageWidthAdjusted = (imgProps.width * pdfImageHeightAdjusted) / imgProps.height;
            pdf.addImage(imgData, 'PNG', margin, margin, pdfImageWidthAdjusted, pdfImageHeightAdjusted);
        } else {
            pdf.addImage(imgData, 'PNG', margin, margin, pdfImageWidth, pdfImageHeight);
        }

        pdf.save(filename); // Use the constructed filename
    });
});

document.getElementById('clearForm').addEventListener('click', function() {
    // Show confirmation dialog
    if (confirm('Er du sikker på at du vil tilbakestille verktøyet. Avkrysningene vil bli tapt.')) {
        // Clear inputs
        document.getElementById('studentName').value = '';
        document.getElementById('finalScore').value = '';
        document.getElementById('finalGrade').value = '';
        document.getElementById('overrideGrade').value = '';
        document.getElementById('feedback').value = '';

        // Clear all checkbox selections in the criteria matrix
        const checkboxes = document.querySelectorAll('#criteriaTable input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
});
