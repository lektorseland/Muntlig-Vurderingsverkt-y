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

document.getElementById('addCriteria').addEventListener('click', function() {
    const table = document.getElementById('criteriaTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);

    let cellHtml = `
        <td>
            <span class="criteria-name is-bold" onclick="editCriteria(this)">New Criteria</span>
            <input class="input is-hidden" type="text" value="New Criteria" onblur="updateCriteria(this)">
        </td>
    `;
    for (let i = 1; i <= 6; i++) {
        cellHtml += `<td><input type="checkbox" name="criteria1grade" value="1" onclick="checkOnlyOne(this)"></td>
        `;
    }
    cellHtml += '<td><input class="input" type="number" min="1" max="10" value="5"></td>'; // Weight input
    cellHtml += '<td><button class="delete" onclick="removeCriteria(this)"></button></td>'; // Delete button
    // Rest of the cellHtml with checkboxes and delete button as previously implemented

    newRow.innerHTML = cellHtml;
});

function editCriteria(element) {
    let inputField = element.nextElementSibling;
    let textSpan = element.classList.contains('criteria-name') ? element : element.previousElementSibling;
    
    textSpan.classList.toggle('is-hidden');
    inputField.classList.toggle('is-hidden');
    inputField.focus();
    inputField.select();
}

function updateCriteria(input) {
    let textSpan = input.previousElementSibling;
    textSpan.textContent = input.value;
    textSpan.classList.toggle('is-hidden');
    input.classList.toggle('is-hidden');
}

function removeCriteria(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function checkOnlyOne(checkbox) {
    let checkboxes = document.querySelectorAll(`input[name="${checkbox.name}"]`);
    checkboxes.forEach(chk => {
        if(chk !== checkbox) chk.checked = false;
    });
}


function addGradeSettings() {
    const grades = [1, 2, 3, 4, 5, 6];

    grades.forEach(grade => {
        // Add Grade Score Setting (A)
        document.querySelector('#gradeAScores').innerHTML += `
            <div class="field">
                <label class="label">Grade ${grade} (% Score)</label>
                <div class="control">
                    <input class="input" type="number" min="0" max="100" id="gradeAScore${grade}" placeholder="Score for Grade ${grade}">
                </div>
            </div>
        `;

        // Add Grade Threshold Setting (B)
        document.querySelector('#gradeBScores').innerHTML += `
            <div class="field">
                <label class="label">Grade ${grade} Threshold (%)</label>
                <div class="control">
                    <input class="input" type="number" min="0" max="100" id="gradeBScore${grade}" placeholder="Threshold for Grade ${grade}">
                </div>
            </div>
        `;
    });
}

addGradeSettings();




function addCriteria(name, weight) {
    // Code to dynamically add criteria to the UI
}

function saveCriteria() {
    // Code to save criteria to local storage
}

function loadCriteria() {
    // Code to load criteria from local storage
}
