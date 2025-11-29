$(document).ready(function () {
    // Custom error rules:
    // Whole number only.
    $.validator.addMethod("integerOnly", function (value) {
        return value === "" || Number.isInteger(parseFloat(value));
    }, "Value must be a whole number.");

    // Must be between -50 and 50.
    $.validator.addMethod("inRange", function (value) {
        if (value === "" || isNaN(value)) return true;
        const n = parseFloat(value);
        return n >= -50 && n <= 50;
    }, "Value must be between -50 and 50.");

    // minRow ≤ maxRow.
    $.validator.addMethod("rowOrder", function (value) {
        const min = parseFloat($("#minrow").val());
        const max = parseFloat($("#maxrow").val());
        if (isNaN(min) || isNaN(max)) return true;
        return min <= max;
    }, "Max row must be ≥ min row.");

    // minCol ≤ maxCol.
    $.validator.addMethod("colOrder", function (value) {
        const min = parseFloat($("#mincol").val());
        const max = parseFloat($("#maxcol").val());
        if (isNaN(min) || isNaN(max)) return true;
        return min <= max;
    }, "Max column must be ≥ min column.");

    // Validate form:
    $("#form").validate({
        rules: {
            minrow: { required: true, number: true, integerOnly: true, inRange: true, rowOrder: true },
            maxrow: { required: true, number: true, integerOnly: true, inRange: true, rowOrder: true },
            mincol: { required: true, number: true, integerOnly: true, inRange: true, colOrder: true },
            maxcol: { required: true, number: true, integerOnly: true, inRange: true, colOrder: true }
        },

        // Custom error display:
        showErrors: function (errorMap, errorList) {

            // Clear previous:
            $(".error-msg").text("");
            $("#conditions li").removeClass("invalid");

            const minRow = parseFloat($("#minrow").val());
            const maxRow = parseFloat($("#maxrow").val());
            const minCol = parseFloat($("#mincol").val());
            const maxCol = parseFloat($("#maxcol").val());

            let anyNotNumber = false;
            let anyNotInteger = false;
            let outOfRange = false;
            let minOverMax = false;

            // Detect failed rules:
            for (const field in errorMap) {
                const msg = errorMap[field].toLowerCase();

                if (msg.includes("number")) anyNotNumber = true;
                if (msg.includes("whole")) anyNotInteger = true;
                if (msg.includes("between")) outOfRange = true;
                if (msg.includes("≥") || msg.includes(">=")) minOverMax = true;
                if (msg.includes("greater")) minOverMax = true;
            }

            // Display unmet conditions:
            if (outOfRange) {
                $("#in-range .error-msg").text("Values must be between -50 and 50");
                $("#in-range").addClass("invalid");
            }

            if (minOverMax) {
                $("#max-over-min .error-msg")
                    .text("Maximum must be greater than or equal to minimum");
                $("#max-over-min").addClass("invalid");
            }

            if (anyNotInteger) {
                $("#whole-number .error-msg").text("All inputs must be whole numbers");
                $("#whole-number").addClass("invalid");
            }

            if (anyNotNumber) {
                $("#is-number .error-msg").text("All inputs must be numbers");
                $("#is-number").addClass("invalid");
            }
        },

        // Clear table if invalid:
        invalidHandler: function (event, validator) {
            clearTable();
        },
        // Block table generation unless valid:
        submitHandler: function (form) {
            clearTable();
            generateTable();
        }
    });
});

const container = document.getElementById("mult-table");
const generateButton = document.getElementById("generate");

// Creates the table based on inputs:
function generateTable() {
    // Obtain values for the mins & maxes of rows & columns:
    const minRow = parseFloat($("#minrow").val());
    const maxRow = parseFloat($("#maxrow").val());
    const minCol = parseFloat($("#mincol").val());
    const maxCol = parseFloat($("#maxcol").val());

    // Create a table in the document:
    const table = document.createElement("table");

    // Fill the table appropriately:
    for (let i = minRow - 1; i <= maxRow; i++) {
        // Add a new row:
        const row = document.createElement("tr");

        for (let j = minCol - 1; j <= maxCol; j++) {
            // Determine if this is a header row, header column, or the origin:
            const headerRow = (i == minRow - 1);
            const headerColumn = (j == minCol - 1);
            const origin = headerRow && headerColumn;

            // Create cells accordingly:
            const cell = document.createElement(headerRow || headerColumn ? "th" : "td");

            // Fill the table out based on position in for loop:
            if (origin) {
                cell.textContent = "*";
            } else if (headerRow) {
                cell.textContent = j;
            } else if (headerColumn) {
                cell.textContent = i;
            } else {
                cell.textContent = i * j;
            }
            // Add cell to row:
            row.appendChild(cell);
        }
        // Add row to table:
        table.appendChild(row);
    }
    // Add table to container:
    container.appendChild(table);
}

// Clears the previous table:
function clearTable() {
    container.innerHTML = "";
}
