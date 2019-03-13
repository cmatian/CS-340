let updatePlanet = (id) => {
    // Context Row
    const row = document.getElementById(`planet_${id}`);

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
    let payload = ($(row).find('input, select').serialize() + `&planet_planetid=${id}`);
    // Make PUT Request
    $.ajax({
        url: '/planet',
        method: "PUT",
        data: payload,
        success: function() {
            window.location.reload(true);
        }
    });
};

let editPlanet = (id) => {
    console.log(`Editing Row ${id}`)
};

let deletePlanet = (id) => {
    if(confirm("Are you sure you want to delete this planet?")) {
        let payload = `planet_planetid=${id}`;
        // Make DELETE Request
        $.ajax({
            url: '/planet',
            method: "DELETE",
            data: payload,
            success: function() {
                window.location.reload(true);
            }
        });
    }
};
