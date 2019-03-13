let editShip = (id) => {
    console.log(`Editing Row ${id}`)
};

let updateShip = (id) => {
    // Context Row
    const row = document.getElementById(`ship_${id}`);

    // Basic Validation
    let flag = 1;
    row.querySelectorAll('input').forEach((el) => {
        // Checks for (blank inputs OR only white space inputs) AND whether the input is required
        if((el.value === '' || !el.value.replace(/\s/g, '').length) && el.hasAttribute('required')) {
            flag = 0;
        }
    });

    if(flag === 0) {
        alert('Error - Blank input detected on required fields. Please try again.');
        window.location.reload(true);
        return;
    }

    // Prepare Payload from information within the context row
    let payload = ($(row).find('input, select').serialize() + `&ship_shipid=${id}`);
    // Make PUT Request
    $.ajax({
        url: '/ship',
        method: "PUT",
        data: payload,
        success: function() {
            window.location.reload(true);
        }
    });
};

let deleteShip = (id) => {
    if(confirm("Are you sure you want to delete this ship?")) {
        let payload = `ship_shipid=${id}`;
        // Make DELETE Request
        $.ajax({
            url: '/ship',
            method: "DELETE",
            data: payload,
            success: function() {
                window.location.reload(true);
            }
        });
    }
};