let nextRowId = 1;
    let confirmedRowsCount = 0;
    let confirmedJobs = [];
   
    document.getElementById('rosterTableBody').addEventListener('change', function(event) {
    if (event.target.matches('select')) {
        const rowElement = event.target.closest('tr');
        const rowId = rowElement.getAttribute('data-row-id'); // Get the rowId from data attribute
        updateDriverList(rowId); // Call function to update driver list
    }
})

    // Event listener for MSIC, White Card, and On Leave checkboxes in Drivers Table
    document.getElementById('driversTable').addEventListener('change', function(event) {
        if (event.target.matches('.onLeave, .hasMSIC, .hasWhiteCard')) {
            refreshDriverDropdowns(); // Call function to refresh driver lists across all rows
        }
    });
    function refreshJobListState() {
    const jobsTable = document.getElementById('jobsTable').querySelectorAll('tr');

    jobsTable.forEach((row) => {
        const clientName = row.cells[0].textContent;
        const confirmedRows = Array.from(document.querySelectorAll('#rosterTableBody tr'))
            .filter(rosterRow => rosterRow.querySelector(`#service${rosterRow.rowIndex}`).value === clientName);

        // If no rows are left in the roster for this job, re-enable the Confirm button
        if (confirmedRows.length === 0) {
            const confirmButton = row.querySelector('.confirm-btn');
            confirmButton.disabled = false; // Re-enable the button
            confirmButton.style.backgroundColor = '#007bff'; // Restore original button color
            confirmButton.style.cursor = 'pointer'; // Restore pointer cursor
        }
    });
}

// Function to set default date inputs to current date
function setDefaultJobDates() {
    const dateInputs = document.querySelectorAll('#jobsTable .jobDate');
    jobDateInputs.forEach(input => {
        input.value = melbourneDate; // Set date value to Melbourne date
        input.dispatchEvent(new Event('change')); // Trigger a change event for any listeners
    });
}

function updateRosterTableDates(melbourneDate) {
    const rosterDateInputs = document.querySelectorAll('#rosterTableBody input[type="date"]');
    rosterDateInputs.forEach(input => {
        input.value = melbourneDate; // Set date value to Melbourne date
        input.dispatchEvent(new Event('change'));
    });
}
function getMelbourneDate() {
    const now = new Date();  // Get the current date and time
    const currentDateElement = document.getElementById("currentDate");
    
    try {
        // Use the Intl.DateTimeFormat to get the current date in Melbourne
        const melbourneTime = new Intl.DateTimeFormat('en-AU', {
            timeZone: 'Australia/Melbourne',
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(now);

        console.log("Melbourne time:", melbourneTime);  // Log the Melbourne time
        
        if (currentDateElement) {
            currentDateElement.innerText = melbourneTime;  // Display the Melbourne time in the header
        } else {
            console.error("Element with ID 'currentDate' not found");
        }

        // Get Melbourne's current date in 'YYYY-MM-DD' format
        const melbourneDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
        
        // Update the job list and roster table dates
        updateJobListDates(melbourneDate); 
        updateRosterTableDates(melbourneDate); 

    } catch (error) {
        console.error("Error getting Melbourne time:", error);
    }
}







function resetMemory() {
    // Clear roster data from localStorage
    localStorage.removeItem('rosterData');
    
    // Clear other related localStorage keys if necessary
    localStorage.removeItem('confirmedJobs');
    //localStorage.removeItem('vehicles'); 
    // Add any other relevant keys here

    // Clear the table body content
    const tableBody = document.getElementById('rosterTableBody');
    tableBody.innerHTML = '';

    // Optionally reset the rowId counter
    //nextRowId = 1;

    alert('Memory reset successfully. The roster table is now empty.');
}

   
    function deleteRow(rowId) {
    const currentRowElement = document.querySelector(`#rosterTableBody tr:nth-child(${rowId})`);
    
    // Remove the selected row from the table
    currentRowElement.remove(); 

    // Reassign row IDs and element IDs after deletion (optional but recommended for consistency)
    reassignRowIds();

    //Optionally, re-enable the jobs list confirm button if rows corresponding to a job were deleted
    refreshJobListState(); // Refresh jobs list state after deletion
}

function reassignRowIds() {
    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach((row, index) => {
        const newId = index + 1; // Create new rowId based on index
        row.id = `row-${newId}`; // Update the row's ID
        row.setAttribute('data-row-id', newId); // Update the data-row-id attribute

        // Update the IDs of all elements within the row
        row.querySelector(`input[type="date"]`).id = `date${newId}`;
        row.querySelector(`#rego${rowId}`).id = `rego${newId}`;
        row.querySelector(`#trailerRego${newId}`).id = `trailerRego${newId}`;
        row.querySelector(`#trailer2${newId}`).id = `trailer2${newId}`; // Update for Trailer 2
        row.querySelector(`#trailer3${newId}`).id = `trailer3${newId}`; 
        row.querySelector(`#type${rowId}`).id = `type${newId}`;
        row.querySelector(`#startTime${rowId}`).id = `startTime${newId}`;
        row.querySelector(`#finishTime${rowId}`).id = `finishTime${newId}`;
        row.querySelector(`#service${rowId}`).id = `service${newId}`;
        row.querySelector(`#wharfLocation${rowId}`).id = `wharfLocation${newId}`;
        row.querySelector(`#constructionSite${rowId}`).id = `constructionSite${newId}`;
        row.querySelector(`#driver${rowId}`).id = `driver${newId}`;
        row.querySelector(`#notes${rowId}`).id = `driver${newId}`;
        row.querySelector('.confirm-btn').setAttribute('onclick', `confirmRow(${newId})`);
        row.querySelector('.delete-btn').setAttribute('onclick', `deleteRow(${newId})`)
        
        
    });
}


function addRow(selectedDate = '') {
    if (!selectedDate) {
        selectedDate = getCurrentMelbourneDate();// Set to current date if not provided
    }

    

    const tableBody = document.getElementById('rosterTableBody');
    const rowId = nextRowId++; // Use the current rowId for unique IDs

    const row = document.createElement('tr');
    row.setAttribute('data-row-id', rowId); // Store the rowId as a data attribute


    

    row.innerHTML = `
        <td><input type="date" id="date${rowId}" value="${selectedDate}"></td> <!-- Date Input -->
        <td><select id="rego${rowId}"></select></td>

        <td>
            <select id="trailerRego${rowId}"></select> <!-- Trailer Rego dropdown -->
        </td>
        <td><select id="trailer2${rowId}"></select></td> <!-- Trailer 2 dropdown -->
        <td><select id="trailer3${rowId}"></select></td> <!-- Trailer 3 dropdown -->

        
        <td>
            <select id="type${rowId}"></select> <!-- Trailer Type dropdown -->
        </td>
        <td><input type="time" id="startTime${rowId}"></td>
        <td><input type="time" id="finishTime${rowId}"></td>
        <td><select id="service${rowId}"></select></td>
        <td>
            <select id="wharfLocation${rowId}" onchange="updateDriverList(${rowId})">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
        </td>
        <td>
            <select id="constructionSite${rowId}" onchange="updateDriverList(${rowId})">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
        </td>
        <td><select id="driver${rowId}"></select></td>
        <td><input type="text" id="notes${rowId}"></td>
        <td>
            <button class="confirm-btn" onclick="confirmRow(${rowId})">Confirm</button>
            
        </td>

    <td><button class="delete-btn" onclick="deleteRow(${rowId})">Delete</button></td>
    `;

    tableBody.appendChild(row);

    // Populate the Trailer Rego dropdown
    populateTrailerRegoDropdown(rowId);
    populateVehicleDropdown(rowId);
    hideRowsWithEmptyService();
    // Populate other dropdowns
    populateDropDowns(rowId);
    
    return row; // Return the created row
}
function toggleVehiclesList() {
    const vehiclesList = document.getElementById('vehiclesTable');
    const newRegoInput = document.getElementById('newRego');
    const addRegoButton = document.querySelector('button[onclick="addRego()"]');
    
    // Toggle the display property of vehicles list and inputs
    if (vehiclesList.style.display === 'none') {
        vehiclesList.style.display = 'table';
        newRegoInput.style.display = 'inline';
        addRegoButton.style.display = 'inline';
    } else {
        vehiclesList.style.display = 'none';
        newRegoInput.style.display = 'none';
        addRegoButton.style.display = 'none';
    }
}

function updateDriverList(rowId) {
    const wharfStatus = document.getElementById(`wharfLocation${rowId}`).value;
    const constructionSiteStatus = document.getElementById(`constructionSite${rowId}`).value;

    const wharfStatusIsYes = (wharfStatus === "Yes");
    const constructionSiteIsYes = (constructionSiteStatus === "Yes");

    // Update the driver dropdown based on the criteria
    populateDriverDropdown(rowId, wharfStatusIsYes, constructionSiteIsYes);
}
function confirmJob(button) {
    const row = button.closest('tr');
    const jobCountInput = row.querySelector('.rowCount');
    const selectedDate = row.querySelector('.jobDate').value;
    const clientName = row.cells[1].textContent;
    const selectedTrailerType = row.querySelector('select').value;
    const numberOfRows = parseInt(jobCountInput.value);

    if (button.textContent === "Add Job") {
        if (isNaN(numberOfRows) || numberOfRows <= 0) {
            alert("Please enter a valid number of jobs.");
            return;
        }

        if (!selectedDate) {
            alert("Please select a date for the job.");
            return;
        }

        let savedJobs = JSON.parse(localStorage.getItem('confirmedJobs')) || [];

        for (let i = 0; i < numberOfRows; i++) {
            const newRow = addRow(selectedDate);
            const rowId = newRow.getAttribute('data-row-id');

            const clientCell = document.getElementById(`service${rowId}`);
            const trailerTypeSelect = document.getElementById(`type${rowId}`);
            const dateCell = document.getElementById(`date${rowId}`);

            clientCell.innerHTML = `<option>${clientName}</option>`;
            trailerTypeSelect.innerHTML = `<option value="${selectedTrailerType}">${selectedTrailerType}</option>`;
            dateCell.value = selectedDate;

            const jobData = {
                client: clientName,
                trailerType: selectedTrailerType,
                date: selectedDate,
                rowId: rowId
            };
            savedJobs.push(jobData);
        }

        localStorage.setItem('confirmedJobs', JSON.stringify(savedJobs));

        button.textContent = "Edit";
        button.classList.add('edit-btn');
        button.classList.remove('confirm-btn');
        jobCountInput.disabled = true;
        row.querySelector('select').disabled = true;
        row.querySelector('.jobDate').disabled = true;
        saveRosterState();
    } else if (button.textContent === "Edit") {
        button.textContent = "Save";
        jobCountInput.disabled = false;
        row.querySelector('select').disabled = false;
        row.querySelector('.jobDate').disabled = false;
    } else if (button.textContent === "Save") {
        const newJobCount = parseInt(jobCountInput.value);
        if (isNaN(newJobCount) || newJobCount <= 0) {
            alert("Please enter a valid number of jobs.");
            return;
        }

        const existingRows = Array.from(document.querySelectorAll('#rosterTableBody tr'));
        const existingClientRows = existingRows.filter(r => 
            r.querySelector(`#service${r.getAttribute('data-row-id')}`).value === clientName
        );

        const rowsToAdd = newJobCount - existingClientRows.length;
        if (rowsToAdd > 0) {
            for (let i = 0; i < rowsToAdd; i++) {
                const newRow = addRow(selectedDate);
                const rowId = newRow.getAttribute('data-row-id');

                const clientCell = document.getElementById(`service${rowId}`);
                const trailerTypeSelect = document.getElementById(`type${rowId}`);
                clientCell.innerHTML = `<option>${clientName}</option>`;
                trailerTypeSelect.innerHTML = `<option value="${selectedTrailerType}">${selectedTrailerType}</option>`;
            }
        }

        button.textContent = "Edit";
        button.classList.add('edit-btn');
        button.classList.remove('confirm-btn');
        jobCountInput.disabled = true;
        row.querySelector('select').disabled = true;
        row.querySelector('.jobDate').disabled = true;
    }

    saveRosterState();
}




// Call this function on page load to repopulate the confirmed jobs
document.addEventListener('DOMContentLoaded', loadConfirmedJobs);


function populateDriverDropdown(rowId, wharfStatusIsYes, constructionSiteIsYes) {
    const drivers = document.querySelectorAll('#driversTable tbody tr');
    const driverSelect = document.getElementById(`driver${rowId}`);
    const currentValue = driverSelect.value; // Store current selected value
    driverSelect.innerHTML = ''; // Clear existing options

    let driverAdded = false; // Track if any driver is added
    let hasCurrentValue = false; // Track if current value is still valid

    // Loop through drivers and apply filters based on conditions
    drivers.forEach(function (row) {
        const cells = row.querySelectorAll('td'); // Use querySelectorAll to get cells
        if (cells.length < 4) return; // Skip if not enough cells

        const driverName = cells[0].textContent.trim();
        const onLeaveCheckbox = cells[1].querySelector('.onLeave');
        const hasMSICCheckbox = cells[2].querySelector('.hasMSIC');
        const hasWhiteCardCheckbox = cells[3].querySelector('.hasWhiteCard');

        const onLeave = onLeaveCheckbox ? onLeaveCheckbox.checked : false;
        const hasMSIC = hasMSICCheckbox ? hasMSICCheckbox.checked : false;
        const hasWhiteCard = hasWhiteCardCheckbox ? hasWhiteCardCheckbox.checked : false;

        // Debugging statements (you can remove these if not needed)
        // console.log(`Driver: ${driverName}, OnLeave: ${onLeave}, HasMSIC: ${hasMSIC}, HasWhiteCard: ${hasWhiteCard}`);

        // Check if the driver meets the criteria and is not on leave
        if (!onLeave) {
            let addDriver = false;

            if (wharfStatusIsYes && constructionSiteIsYes) {
                if (hasMSIC && hasWhiteCard) addDriver = true;
            } else if (wharfStatusIsYes) {
                if (hasMSIC) addDriver = true;
            } else if (constructionSiteIsYes) {
                if (hasWhiteCard) addDriver = true;
            } else {
                addDriver = true; // No restrictions, allow all drivers not on leave
            }

            // Debugging statement
            // console.log(`AddDriver for ${driverName}: ${addDriver}`);

            // If the driver meets the conditions, add them to the dropdown
            if (addDriver) {
                const option = document.createElement('option');
                option.value = driverName;
                option.textContent = driverName;
                if (driverName === currentValue) {
                    hasCurrentValue = true;
                    option.selected = true; // Keep current selection if still valid
                }
                driverSelect.appendChild(option);
                driverAdded = true;
            }
        }
    });

    // If no drivers are added, show a message in the dropdown
    if (!driverAdded) {
        const noDriverOption = document.createElement('option');
        noDriverOption.value = '';
        noDriverOption.textContent = 'No drivers available';
        driverSelect.appendChild(noDriverOption);
    }

    // If current value is no longer valid, reset the select value
    if (!hasCurrentValue) {
        driverSelect.value = ''; // Reset to default
    }

    // Re-initialize Select2 for the driver dropdown
    $(`#driver${rowId}`).select2('destroy'); // Destroy existing Select2 instance
    $(`#driver${rowId}`).select2(); // Re-initialize Select2

    // Trigger change event to update the UI
    $(`#driver${rowId}`).trigger('change');
}

    
function populateDropDowns(rowId) {
    const drivers = document.querySelectorAll('#driversTable tbody tr');
    const vehicles = document.querySelectorAll('#vehiclesTable tbody tr');
    const driverSelect = document.getElementById(`driver${rowId}`);
    const regoSelect = document.getElementById(`rego${rowId}`);
    const wharfLocationSelect = document.getElementById(`wharfLocation${rowId}`); // Wharf Location (Restricted)
    const wharfRestricted = wharfLocationSelect.value === "Yes"; // Check if wharf location is restricted

    regoSelect.innerHTML = ''; // Clear vehicle options
    driverSelect.innerHTML = ''; // Clear driver options

    // Populate vehicles dropdown
    vehicles.forEach(function (row) {
        const option = document.createElement('option');
        option.value = row.cells[0].textContent;
        option.textContent = row.cells[0].textContent;
        regoSelect.appendChild(option);
    });
        $(document).ready(function() {
        $('select').select2();
    });

    // Populate drivers dropdown
    drivers.forEach(function (row) {
        const driverName = row.cells[0].textContent;
        const onLeave = row.cells[1].querySelector('.onLeave').checked;
        const hasMSIC = row.cells[2].querySelector('.hasMSIC').checked;

        if (!onLeave) {
            if (wharfRestricted) {
                // Show only drivers with MSIC for restricted wharf jobs
                if (hasMSIC) {
                    const option = document.createElement('option');
                    option.value = driverName;
                    option.textContent = driverName;
                    driverSelect.appendChild(option);
                }
            } else {
                // For non-wharf jobs, add all drivers who are not on leave
                const option = document.createElement('option');
                option.value = driverName;
                option.textContent = driverName;
                driverSelect.appendChild(option);
            }
        }
    });
    $(`#rego${rowId}, #driver${rowId}`).select2();
}

function refreshDriverDropdowns() {
    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach((row) => {
        const rowId = row.getAttribute('data-row-id'); // Get the rowId from the data attribute
        updateDriverList(rowId); // Update the driver list for each row dynamically
       // $(`#driver${rowId}`).select2();  
    });
}

// Ensure this is triggered when driver statuses change
document.querySelectorAll('.onLeave, .hasMSIC, .hasWhiteCard').forEach(checkbox => {
    checkbox.addEventListener('change', refreshDriverDropdowns);
});

function confirmRow(rowId) {
    const currentRowElement = document.querySelector(`#rosterTableBody tr[data-row-id="${rowId}"]`);
    const confirmButton = currentRowElement.querySelector('.confirm-btn');
    const driverSelect = document.getElementById(`driver${rowId}`).value;

    // Ensure a driver is selected before confirming
    if (!driverSelect) {
        alert('Please select a driver before confirming.');
        return;
    }

    // Toggle between Confirm and Edit
    if (confirmButton.textContent === "Confirm") {
        // Disable all inputs and dropdowns
        currentRowElement.querySelectorAll('input, select').forEach(function(element) {
            element.disabled = true;
        });

        // Change button to Edit
        confirmButton.textContent = "Edit";
        confirmButton.classList.add('edit-btn');
    } else {
        // Enable all inputs and dropdowns to make row editable again
        currentRowElement.querySelectorAll('input, select').forEach(function(element) {
            element.disabled = false;
        });

        // Change button back to Confirm
        confirmButton.textContent = "Confirm";
        confirmButton.classList.remove('edit-btn');
    }

    saveRosterState(); 
}


   function addDriver() {
    const newDriverName = document.getElementById('newDriverName').value.trim();
    const newDriverPhone = document.getElementById('newDriverPhone').value.trim();
    if (newDriverName !== "") {
        const driversTable = document.getElementById('driversTable').querySelector('tbody');
        const newRow = driversTable.insertRow();

        newRow.innerHTML = `
            <td>${newDriverName}</td>
            <td><input type="checkbox" class="onLeave" onchange="refreshDriverDropdowns()"></td>
            <td><input type="checkbox" class="hasMSIC" checked onchange="refreshDriverDropdowns()"></td>
            <td><input type="checkbox" class="hasWhiteCard" checked onchange="refreshDriverDropdowns()"></td>
            <td><input type="text" value="${newDriverPhone}" class="driverPhone"></td>
        `;

        // Clear input fields and refresh dropdowns
        document.getElementById('newDriverName').value = '';
        document.getElementById('newDriverPhone').value = '';
        refreshDriverDropdowns();  // Refresh dropdowns across all rows
    } else {
        alert("Please enter a driver name.");
    }
}

//function updateLocalStorage() {
  //  const vehicles = [];
    //const vehicleRows = document.querySelectorAll('#vehiclesTable tbody tr');

   // vehicleRows.forEach(row => {
     //   const rego = row.cells[0].textContent.trim();
       // vehicles.push(rego);
   // });

    // Store the vehicles array in local storage
   // localStorage.setItem('vehicles', JSON.stringify(vehicles));
//}

  function addRego() {
    const newRego = document.getElementById('newRego').value.trim();
    if (newRego !== "") {
        const vehiclesTable = document.getElementById('vehiclesTable').querySelector('tbody');
        const newRow = vehiclesTable.insertRow();
        newRow.innerHTML = `<td>${newRego}</td>`;

        // Clear input field
        document.getElementById('newRego').value = '';

        // Refresh dropdowns in all rows
       // const rows = document.querySelectorAll('#rosterTableBody tr');
      //  rows.forEach((row) => {
      //      const rowId = row.getAttribute('data-row-id');
      //      populateDropDowns(rowId);

        //    });

           // updateLocalStorage();
    }
}
// Function to get the current date in Melbourne time in 'YYYY-MM-DD' format
function getCurrentMelbourneDate() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
}

  // Function to add a new job dynamically
  function addJob() {
    const newJob = document.getElementById('newJob').value.trim();
    const newJobCount = parseInt(document.getElementById('newJobCount').value.trim());
    let newJobDate = document.getElementById('newJobDate').value; 

    if (!newJobDate) {
        newJobDate = getCurrentMelbourneDate();
    }

    // Validate job name, job count, and date
    if (newJob === "") {
        alert("Please enter a job name.");
        return;
    }

    if (isNaN(newJobCount) || newJobCount <= 0) {
        alert("Please enter a valid number of jobs.");
        return;
    }

    const jobsTable = document.getElementById('jobsTable').querySelector('tbody');
    const newRow = jobsTable.insertRow();

    newRow.innerHTML = `
        <td><input type="date" class="jobDate" value="${newJobDate}"></td>
        <td>${newJob}</td>
        <td>
            <select>
                <option value="S">S</option>
                <option value="SDL">SDL</option>
                <option value="RT">RT</option>
                <option value="BDBL">BDBL</option>
            </select>
        </td>
        <td><input type="number" class="rowCount" value="${newJobCount}" min="1"></td>
        <td><button class="confirm-btn" onclick="confirmJob(this)">Confirm</button></td>
    `;

    // Clear input fields after adding the job
    document.getElementById('newJob').value = '';
    document.getElementById('newJobCount').value = '';
    document.getElementById('newJobDate').value = '';
}



function saveRoster(data) {
    fetch('https://tasmandriverroster-a8hqh7hcd2gfbkc0.australiasoutheast-01.azurewebsites.net/save-roster', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Roster saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error saving roster:', error);
    });
}


function saveDriver(data) {
    fetch('https://tasmandriverroster-a8hqh7hcd2gfbkc0.australiasoutheast-01.azurewebsites.net/save-driver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Driver saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error saving driver:', error);
    });
}
function submitDriverForm() {
    const driverData = {
        name: document.getElementById('driverName').value,
        onLeave: document.getElementById('onLeave').checked,
        hasMSIC: document.getElementById('hasMSIC').checked,
        hasWhiteCard: document.getElementById('hasWhiteCard').checked
    };

    saveDriver(driverData);
}

function collectRosterData() {
    const rosterData = [];

    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach(row => {
        const rowId = row.getAttribute('data-row-id');
        const data = {
            date: document.getElementById(`date${rowId}`).value,
            rego: document.getElementById(`rego${rowId}`).value,
            trailerRego: document.getElementById(`trailerRego${rowId}`).value,
            trailer2: document.getElementById(`trailer2${rowId}`).value,
            trailer3: document.getElementById(`trailer2${rowId}`).value,
            trailerType: document.getElementById(`type${rowId}`).value,
            startTime: document.getElementById(`startTime${rowId}`).value,
            finishTime: document.getElementById(`finishTime${rowId}`).value,
            service: document.getElementById(`service${rowId}`).value,
            wharfStatus: document.getElementById(`wharfLocation${rowId}`).value,
            constructionSite: document.getElementById(`constructionSite${rowId}`).value,
            driver: document.getElementById(`driver${rowId}`).value
        };
        rosterData.push(data);
    });

    // Now you can save the roster data or process it as needed
    saveRoster(rosterData);
}


    // Function to download the entire roster to an Excel file
    function downloadExcel() {
        const workbook = XLSX.utils.book_new();

        // Collect data from the roster table, drivers table, vehicles table, and jobs table
        const rosterData = tableToArray(document.getElementById('rosterTable'));
        const driversData = tableToArray(document.getElementById('driversTable'));
        const vehiclesData = tableToArray(document.getElementById('vehiclesTable'));
        const jobsData = tableToArray(document.getElementById('jobsTable'));

        // Create worksheets for each section
        const rosterSheet = XLSX.utils.aoa_to_sheet(rosterData);
        const driversSheet = XLSX.utils.aoa_to_sheet(driversData);
        const vehiclesSheet = XLSX.utils.aoa_to_sheet(vehiclesData);
        const jobsSheet = XLSX.utils.aoa_to_sheet(jobsData);

        rosterSheet['!cols'] = rosterData[0].map(() => ({ wch: 20 })); // Auto-width for columns

        // Add worksheets to the workbook
        XLSX.utils.book_append_sheet(workbook, rosterSheet, 'Roster');
        XLSX.utils.book_append_sheet(workbook, driversSheet, 'Drivers');
        XLSX.utils.book_append_sheet(workbook, vehiclesSheet, 'Vehicles');
        XLSX.utils.book_append_sheet(workbook, jobsSheet, 'Jobs');

        // Generate file name based on the date
        const dateString = new Date().toLocaleDateString('en-AU').replace(/\//g, '_');
        const fileName = `Driver_Roster_${dateString}.xlsx`;

        // Download the Excel file
        XLSX.writeFile(workbook, fileName);
    }

   function tableToArray(table) {
        const data = [];
        const colors = {
            'Sunrice': 'FFFF00', // Yellow
            'Agripak': 'ADD8E6', // Light Blue
            'CHS BB': 'FFC0CB', // Light Pink
            'NE Link': 'FFA500' // Orange
        };
    
        table.querySelectorAll('tr').forEach((row, index) => {
            // Skip hidden rows
            if (row.style.display === 'none')  return;
    
            const rowData = [];
            const cells = Array.from(row.querySelectorAll('th, td'));
    
            // Omit the last two columns (Confirm and Delete)
            cells.slice(0, -2).forEach(cell => {
                const input = cell.querySelector('input, select');
                const cellValue = input ? (input.value || cell.textContent) : cell.textContent;
                const service = cell.textContent.trim();
    
                // Apply color based on the service
                const style = colors[service] ? { fill: { fgColor: { rgb: colors[service] } } } : {};
    
                rowData.push({ v: cellValue, s: style });
            });
    
            data.push(rowData);
        });
        return data;
    }

function loadConfirmedJobs() {
    const savedJobs = JSON.parse(localStorage.getItem('confirmedJobs')) || [];

    savedJobs.forEach(job => {
        if (job.client && job.trailerType && job.date) { // Only add rows with valid data
            const newRow = addRow(job.date); // Add a new row for each saved job
            const rowId = newRow.getAttribute('data-row-id');

            // Populate the new row with saved data
            const clientCell = document.getElementById(`service${rowId}`);
            const trailerTypeSelect = document.getElementById(`type${rowId}`);
            const dateCell = document.getElementById(`date${rowId}`);

            clientCell.innerHTML = `<option>${job.client}</option>`;
            trailerTypeSelect.innerHTML = `<option>${job.trailerType}</option>`;
            dateCell.value = job.date;
        }
    });
}

function handleBackToRoster(event) {
    event.preventDefault(); // Prevent immediate redirection

    // Save the roster state before navigating
    const isSaved = saveRosterState();

    // If saving was successful, proceed with navigation
    if (isSaved) {
        setTimeout(() => {
            refreshVehicleDropdowns(); // Refresh vehicle dropdowns
            window.location.href = "index.html"; // Navigate back to roster page after a short delay
        }, 100); // Short delay of 100ms to allow data saving
    } else {
        // If saving failed, show an alert and prevent navigation
        alert("Failed to save roster data. Please try again.");
    }
}


// Function to save the current roster table to localStorage
function saveRosterState() {
    try {
        const rosterData = [];
        const rows = document.querySelectorAll('#rosterTableBody tr');

        rows.forEach((row) => {
            const rowId = row.getAttribute('data-row-id');
            const data = {
                date: document.getElementById(`date${rowId}`).value,
                rego: document.getElementById(`rego${rowId}`).value,
                trailerRego: document.getElementById(`trailerRego${rowId}`).value,
                trailer2: document.getElementById(`trailer2${rowId}`).value,
                trailer3: document.getElementById(`trailer3${rowId}`).value,
                trailerType: document.getElementById(`type${rowId}`).value,
                startTime: document.getElementById(`startTime${rowId}`).value,
                finishTime: document.getElementById(`finishTime${rowId}`).value,
                service: document.getElementById(`service${rowId}`).value,
                wharfLocation: document.getElementById(`wharfLocation${rowId}`).value,
                constructionSite: document.getElementById(`constructionSite${rowId}`).value,
                driver: document.getElementById(`driver${rowId}`).value,
                notes: document.getElementById(`notes${rowId}`).value
            };
            rosterData.push(data);
        });

        // Try saving the data to localStorage
        localStorage.setItem('rosterData', JSON.stringify(rosterData));

        // Return true if the data was saved successfully
        return true;
    } catch (error) {
        console.error("Error saving roster data:", error);
        return false;
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    loadRosterState();
});
function loadRosterState() {
    const savedRosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
    let highestRowId = 0;
    if (savedRosterData.length === 0) {
        console.log("No saved roster data found, table will remain empty.");
        return; // Stop loading if there's no saved data
    }

    savedRosterData.forEach((rowData, index) => {
        const row = addRow(rowData.date); // Add a new row for each saved row
        const rowId = row.getAttribute('data-row-id');

        // Restore the row data
        document.getElementById(`rego${rowId}`).value = rowData.rego;
        document.getElementById(`trailerRego${rowId}`).value = rowData.trailerRego;
        document.getElementById(`trailer2${rowId}`).value = rowData.trailer2;
        document.getElementById(`trailer3${rowId}`).value = rowData.trailer3;
        document.getElementById(`type${rowId}`).value = rowData.trailerType;
        document.getElementById(`startTime${rowId}`).value = rowData.startTime;
        document.getElementById(`finishTime${rowId}`).value = rowData.finishTime;
        document.getElementById(`service${rowId}`).value = rowData.service;
        document.getElementById(`wharfLocation${rowId}`).value = rowData.wharfLocation;
        document.getElementById(`constructionSite${rowId}`).value = rowData.constructionSite;
        document.getElementById(`driver${rowId}`).value = rowData.driver;
        document.getElementById(`notes${rowId}`).value = rowData.notes;

        // Optionally reinitialize Select2 for the dropdowns
        $(`#rego${rowId}, #trailerRego${rowId}, #trailer2${rowId}, #trailer3${rowId}, #driver${rowId}`).select2();
    });

    
    highestRowId = Math.max(highestRowId, parseInt(rowId)); // Track the highest row ID

        nextRowId = highestRowId + 1;

}


// Function to initialize trailers if localStorage is empty
function initializeTrailers() {
    let trailers = JSON.parse(localStorage.getItem('trailers')) || [];
    if (trailers.length === 0) {
        console.log("No trailers found in localStorage. Initializing with predefined trailers.");
        // Predefined trailers to show if none exist
        trailers = ['YQ93SE', 'YB05CK'];
        localStorage.setItem('trailers', JSON.stringify(trailers));
    } else {
        console.log("Trailers found in localStorage:", trailers);
    }
}

// Function to load trailers from localStorage and populate the table
function loadTrailers() {
    const trailers = JSON.parse(localStorage.getItem('trailers')) || [];
    const trailersTable = document.getElementById('trailersTable').querySelector('tbody');
    
    // Clear the existing table content (in case it's reloaded)
    trailersTable.innerHTML = '';  

    // Only add rows if there are trailers in the array
    if (trailers.length > 0) {
        trailers.forEach((trailerRego, index) => {
            // Create a new row
            const newRow = trailersTable.insertRow();

            // Insert cells for trailer rego and action (delete button)
            const regoCell = newRow.insertCell(0);
            regoCell.textContent = trailerRego; // Trailer rego

            const actionCell = newRow.insertCell(1);
            const deleteButton = document.createElement('button'); // Create delete button
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() { deleteTrailer(index); }; // Attach delete functionality to the button

            actionCell.appendChild(deleteButton); // Add the delete button to the action cell
        });
    }
}


// Function to add new trailer rego and update the table
function addTrailerRego() {
    const newTrailerRego = document.getElementById('newTrailerRego').value.trim();
    if (newTrailerRego !== "") {
        let trailers = JSON.parse(localStorage.getItem('trailers')) || [];
        trailers.push(newTrailerRego);
        localStorage.setItem('trailers', JSON.stringify(trailers));

        loadTrailers(); // Reload trailers to refresh the table

        // Clear input field
        document.getElementById('newTrailerRego').value = '';
    } else {
        alert("Please enter a trailer rego.");
    }
}

// Function to delete a trailer by index
function deleteTrailer(index) {
    let trailers = JSON.parse(localStorage.getItem('trailers')) || [];
    trailers.splice(index, 1); // Remove the trailer at the specified index
    localStorage.setItem('trailers', JSON.stringify(trailers));

    // Reload trailers to refresh the table
    loadTrailers();
}

// Refresh trailer dropdowns in the roster table
function refreshTrailerRegoDropdowns() {
    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach((row) => {
        const rowId = row.getAttribute('data-row-id'); // Get the rowId from the data attribute
        populateTrailerRegoDropdown(rowId); // Update the trailer rego dropdown for each row
    });
}




function populateTrailerRegoDropdown(rowId) {
    const trailers = JSON.parse(localStorage.getItem('trailers')) || []; 
    const trailerRegoSelect = document.getElementById(`trailerRego${rowId}`);
    const trailer2Select = document.getElementById(`trailer2${rowId}`);
    const trailer3Select = document.getElementById(`trailer3${rowId}`);
    
    [trailerRegoSelect, trailer2Select, trailer3Select].forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '';

        trailers.forEach(function (trailerRego) {
            const option = document.createElement('option');
            option.value = trailerRego;
            option.textContent = trailerRego;
            select.appendChild(option);
        });

        if (currentValue) {
            select.value = currentValue;
        }
    });

    // Initialize or refresh Select2
    [`#trailerRego${rowId}`, `#trailer2${rowId}`, `#trailer3${rowId}`].forEach(selectId => {
        const $select = $(selectId);
        if ($select.hasClass('select2-hidden-accessible')) {
            $select.select2('destroy');
        }
        $select.select2();
    });
}
function hideRowsWithEmptyService() {
    const rows = document.querySelectorAll('#rosterTableBody tr:not(.existing-row)'); // Select only non-existing rows

    rows.forEach(row => {
        const serviceInput = row.querySelector('td:nth-child(9) input'); // Get the service input (9th column)

        // If service is blank or empty, hide the row
        if (serviceInput && !serviceInput.value.trim()) {
            row.style.display = 'none'; // Use inline style to hide the row
        } else {
            row.style.display = ''; // Ensure the row is visible if service is filled
        }
    });
}

// Function to hide rows with empty Trailer Type and Service
function hideRowsWithEmptyTrailerAndService() {
    const rows = document.querySelectorAll('#rosterTableBody tr');

    rows.forEach(row => {
        const trailerTypeSelect = row.querySelector('td:nth-child(6) select'); // Trailer Type
        const serviceSelect = row.querySelector('td:nth-child(10) select');    // Service

        if (trailerTypeSelect && serviceSelect) {
            const trailerTypeValue = trailerTypeSelect.value.trim();
            const serviceValue = serviceSelect.value.trim();

            // Hide row if both Trailer Type and Service are empty
            if (!trailerTypeValue || !serviceValue) {
                row.style.display = 'none';
            }
        }
    });
}

const rosterTableBody = document.querySelector('#rosterTableBody');

const observer = new MutationObserver(function(mutationsList, observer) {
    // Check for added nodes (new rows)
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            hideRowsWithEmptyTrailerAndService(); // Call the function when rows are added
        }
    }
});
function initializeVehicles() {
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    if (vehicles.length === 0) {
        console.log("No vehicles found in localStorage. Initializing with predefined vehicles.");
        // Predefined vehicles to show if none exist
        vehicles = ['XW06PY', 'XW05PI'];
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    } else {
        console.log("Vehicles found in localStorage:", vehicles);
    }
}
function loadVehicles() {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehiclesTable = document.getElementById('vehiclesTable').querySelector('tbody');

    // Clear the existing table content (in case it's reloaded)
    vehiclesTable.innerHTML = '';

    // Populate the table with vehicles
    vehicles.forEach((vehicleRego, index) => {
        const newRow = vehiclesTable.insertRow();

        // Insert cells for vehicle rego and action (delete button)
        const regoCell = newRow.insertCell(0);
        regoCell.textContent = vehicleRego;

        const actionCell = newRow.insertCell(1);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() { deleteVehicle(index); };

        actionCell.appendChild(deleteButton);
    });
}
function addVehicleRego() {
    const newVehicleRego = document.getElementById('newVehicleRego').value.trim();
    if (newVehicleRego !== "") {
        let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        vehicles.push(newVehicleRego); // Add new vehicle rego
        localStorage.setItem('vehicles', JSON.stringify(vehicles)); // Save to localStorage

        loadVehicles(); // Reload vehicles to refresh the table
        refreshVehicleDropdowns(); // Refresh all vehicle rego dropdowns

        // Clear input field
        document.getElementById('newVehicleRego').value = '';
    } else {
        alert("Please enter a vehicle rego.");
    }
}

function populateVehicleDropdown(rowId) {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehicleRegoSelect = document.getElementById(`rego${rowId}`);
    
    vehicleRegoSelect.innerHTML = ''; // Clear existing options

    vehicles.forEach(function (vehicleRego) {
        const option = document.createElement('option');
        option.value = vehicleRego;
        option.textContent = vehicleRego;
        vehicleRegoSelect.appendChild(option);
    });

    // Initialize or refresh Select2 for better dropdown UI (optional)
    $(`#rego${rowId}`).select2(); // Reinitialize Select2 if needed
}

function refreshVehicleDropdowns() {
    const rows = document.querySelectorAll('#rosterTableBody tr');
    rows.forEach((row) => {
        const rowId = row.getAttribute('data-row-id'); // Get the rowId from the data attribute
        populateVehicleDropdown(rowId); // Update the vehicle rego dropdown for each row
    });
}

function addVehicleRego() {
    const newVehicleRego = document.getElementById('newVehicleRego').value.trim();
    if (newVehicleRego !== "") {
        let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        vehicles.push(newVehicleRego); // Add new vehicle rego
        localStorage.setItem('vehicles', JSON.stringify(vehicles)); // Save to localStorage

        loadVehicles(); // Reload vehicles to refresh the table
        refreshVehicleDropdowns(); // Refresh all vehicle rego dropdowns

        // Clear input field
        document.getElementById('newVehicleRego').value = '';
    } else {
        alert("Please enter a vehicle rego.");
    }
}

function updateTrailerFields(rowId) {
    const trailerType = document.getElementById(`type${rowId}`).value;
    const trailerRego = document.getElementById(`trailerRego${rowId}`);
    const trailer2 = document.getElementById(`trailer2${rowId}`);
    const trailer3 = document.getElementById(`trailer3${rowId}`);

    // Disable all trailer fields initially
    trailerRego.disabled = true;
    trailer2.disabled = true;
    trailer3.disabled = true;

    // Enable fields based on the trailer type selected
    if (trailerType === 'S' || trailerType === 'SDL') {
        // For type 'S' and 'SDL', only trailerRego is enabled
        trailerRego.disabled = false;
    } else if (trailerType === 'BDBL') {
        // For type 'BDBL', trailerRego and trailer2 are enabled
        trailerRego.disabled = false;
        trailer2.disabled = false;
    } else if (trailerType === 'RT') {
        // For type 'RT', all three trailer fields are enabled
        trailerRego.disabled = false;
        trailer2.disabled = false;
        trailer3.disabled = false;
    }
}

function deleteVehicle(index) {
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    vehicles.splice(index, 1); // Remove the vehicle at the specified index
    localStorage.setItem('vehicles', JSON.stringify(vehicles));

    // Reload vehicles to refresh the table
    loadVehicles();
    refreshVehicleDropdowns(); // Refresh dropdowns after deletion
}
// Start observing the roster table for changes
observer.observe(rosterTableBody, { childList: true });
// Initial setup: load trailers and setup roster


function getCurrentMelbourneDate() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
}

document.addEventListener('DOMContentLoaded', function() {
    const melbourneDate = getCurrentMelbourneDate();
    const jobDateInputs = document.querySelectorAll('#jobsTable .jobDate');
    jobDateInputs.forEach(input => {
        input.value = melbourneDate;
    });
});






window.onload = function() {
    console.log("Window loaded. Initializing trailers and loading trailers into the table.");
    loadRosterState(); 
    initializeVehicles;
    loadVehicles();
    refreshVehicleDropdowns();
    initializeTrailers(); // Pre-populate trailers if localStorage is empty
    loadTrailers(); // Load trailers into the table
    getMelbourneDate(); // Set the header date to Melbourne time
    addRow();
    setDefaultJobDates();
   
    setTimeout(function() {
        // Select all rows in the table body
        const rows = document.querySelectorAll('#rosterTableBody tr');

        rows.forEach(row => {
            // Get the trailer type and service columns (adjust the column index as per your structure)
            const trailerTypeSelect = row.querySelector('td:nth-child(6) select'); // Trailer Type is 6th column
            const serviceSelect = row.querySelector('td:nth-child(10) select');    // Service is 10th column

            // Check if both the trailer type and service are empty
            if (trailerTypeSelect && serviceSelect) {
                const trailerTypeValue = trailerTypeSelect.value.trim();
                const serviceValue = serviceSelect.value.trim();

                if (!trailerTypeValue || !serviceValue) {
                    // Hide the row if both Trailer Type and Service are empty
                    row.style.display = 'none';
                }
            }
        });
    }, 100);
};

    document.addEventListener('DOMContentLoaded', () => {
        const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        const vehiclesTable = document.getElementById('vehiclesTable').querySelector('tbody');
    
        // Populate the vehicles table with stored vehicles
        vehicles.forEach(vehicle => {
            const newRow = vehiclesTable.insertRow();
            newRow.innerHTML = `<td>${vehicle}</td>`;
        });
    });
