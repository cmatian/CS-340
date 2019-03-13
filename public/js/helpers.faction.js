let updateFaction = (id) => {
    const row = document.getElementById(`faction_${id}`);

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

    let payload = ($(row).find('input, select').serialize() + `&faction_factionid=${id}`);
    console.log(payload);
    $.ajax({
        url: '/faction',
        method: "PUT",
        data: payload,
        success: function() {
            window.location.reload(true);
        }
    });
};

let editFaction = (id) => {
    console.log(`Editing Row ${id}`)
};

let deleteFaction = (id) => {
    if(confirm("Are you sure you want to delete this faction?")) {
        let payload = `faction_factionid=${id}`;
        $.ajax({
            url: '/faction',
            method: "DELETE",
            data: payload,
            success: function() {
                window.location.reload(true);
            }
        });
    }
};
