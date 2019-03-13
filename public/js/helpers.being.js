$(document).ready(() => {
    currentFilters();
});


let getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};


// Grab Current Document Filters based on the URL param
let currentFilters = () => {
    let filters = [];
    let param = getUrlParameter('fname');
    if(param !== undefined || param !== null) {
        filters.push(param);
    }
    filters.forEach(() => {
        document.querySelector('.current-filters').textContent = param || 'None';
    });
};

let clearFilters = () => {
    document.location.href = '/being';
};

let filterBeingName = () => {
    const form = document.getElementById('form_filter');
    const filterValue = form.querySelector('#filter_fname').value;
    window.location.href = `/being?fname=${filterValue}`;
};

let updateBeing = (id) => {
    // Context Row
    const row = document.getElementById(`being_${id}`);

    // Basic Validation
    let flag = 1;
    row.querySelectorAll('input').forEach((el) => {
        // Checks for (blank inputs OR only white space inputs) AND whether the input is required
        if((el.value === '' || !el.value.replace(/\s/g, '').length) && el.hasAttribute('required')) {
            flag = 0;
        }
    });

    if(flag === 0) {
        alert('Error - Blank input detected on required fields.');
        window.location.reload(true);
        return;
    }

    // Prepare Payload from information within the context row
    let payload = ($(row).find('input, select').serialize() + `&being_beingid=${id}`);
    // Make PUT Request
    $.ajax({
        url: '/being',
        method: "PUT",
        data: payload,
        success: function() {
            window.location.reload(true);
        }
    });
};

let editBeing = (id) => {
    console.log(`Editing Row ${id}`)
};

let deleteBeing = (id) => {
    if(confirm("Are you sure you want to delete this being?")) {
        let payload = `being_beingid=${id}`;
        // Make DELETE Request
        $.ajax({
            url: '/being',
            method: "DELETE",
            data: payload,
            success: function() {
                window.location.reload(true);
            }
        });
    }
};