let updateForcePower = (id) => {
    const row = document.getElementById(`forcepower_${id}`);

    let flag = 1;
    row.querySelectorAll('input').forEach((el) => {
        if ((el.value === '' || !el.value.replace(/\s/g, '').length) && el.hasAttribute('required')) {
            flag = 0;
        }
    });

    if(flag === 0) {
        alert('Error - Blank input detected on required fields.');
        window.location.reload(true);
        return;
    }

    let payload = ($(row).find('input, select').serialize() + `&forcepower_forceid=${id}`);
    console.log(payload);
    $.ajax({
        url: '/forcepower',
        method: "PUT",
        data: payload,
        success: function() {
            window.location.reload(true);
        }
    });
};

let editForcePower = (id) => {
    console.log(`Editing Row ${id}`);
};

let deleteForcePower = (id) => {
    if(confirm("Are you sure you want to delete this Force Power?")) {
        let payload = `forcepower_forceid=${id}`;
        $.ajax({
            url: '/forcepower',
            method: "DELETE",
            data: payload,
            success: function() {
                window.location.reload(true);
            }
        });
    }
};