$(document).ready(() => {
    // Generate Client Side Hash Map after page has loaded
    hashMap();
});

// Allegiance Map Object
map = {};

// hashMap function will maintain a key-value pairing using the data-being as the key (index) and the
let hashMap = () => {
    rows = document.querySelectorAll("[data-being]");
    // Generate a Hash Map
    rows.forEach((el) => {
        key = el.getAttribute('data-being');
        // Check if the property already exists
        if (!map.hasOwnProperty(key)) {
            // Create the property in map using the key
            Object.defineProperty(map, key, {
                value: new Set(),
                writable: false
            });
        }
        // Add each data-faction value to the current context. Set guarantees unique values.
        map[key].add(el.getAttribute('data-faction'));
    });
};

let handleSubmit = () => {
    event.preventDefault();
    const form = document.getElementById('allegiance-form');
    const key = document.getElementById('allegiance-being').value;
    const value = document.getElementById('allegiance-faction').value;
    /*  Check against map object to see if the combination exists
            - If it's invalid (false) return and don't submit the form
            - Otherwise submit the form normally
     */
    if(!validateAllegiance(key, value)) {
        alert('That allegiance already exists in the table.');
        return;
    }
    // Submit form if combination is valid
    form.submit();
};

let validateAllegiance = (key, value) => {
    // Check if property exists to begin with
    if(!map[key] || map[key] === undefined || map[key] === null) {
        return true;
    }
    // Check if the property contains the value in question already (if it doesn't exist we can exit early)
    if(!map[key].has(value)) {
        return true;
    }
    // Return false indicating that the combination already exists in the map object
    return false;
};

// Edit Allegiance
let editAllegiance = (beingid, factionid) => {
    console.log(`Editing Row${beingid}${factionid}`)
};

// Update Allegiance
let updateAllegiance = (beingid, factionid) => {
    // Context Row
    const row = document.getElementById(`${beingid + factionid}`);
    const value = row.querySelector('.form-control.faction').value;
    // Prepare Payload from information within the context row
    let payload = ($(row).find('input, select').serialize() + `&allegiance_beingid=${beingid}&allegiance_oldfactionid=${factionid}`);

    // No change was made when hitting button
    if(value === factionid) {
        return;
    }

    // Change was made - validate the combination
    if(!validateAllegiance(beingid, value)) {
        alert('Error: That allegiance is already present. Please try a different combination.');
        window.location.reload(true);
        return;
    }
    // Make PUT Request
    $.ajax({
        url: '/allegiance',
        method: "PUT",
        data: payload,
        success: function() {
            window.location.reload(true);
        }
    });

};

let deleteAllegiance = (beingid, factionid) => {
    if(confirm("Are you sure you want to delete this Allegiance?")) {
        let payload = `allegiance_factionid=${factionid}&allegiance_beingid=${beingid}`;
        // Make DELETE Request
        $.ajax({
            url: '/allegiance',
            method: "DELETE",
            data: payload,
            success: function() {
                window.location.reload(true);
            }
        });
    }
};


