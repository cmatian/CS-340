$(document).ready(() => {
    // Generate Client Side Hash Map after page has loaded
    hashMap();
});

// Force Power Map Object
map = {};

// hashMap function will maintain a key-value pairing using the data-being as the key (index)
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
        // Add each data-forcepower value to the current context. Set guarantees unique values.
        map[key].add(el.getAttribute('data-forcepower'));
    });
};

let handleSubmit = () => {
    event.preventDefault();
    const form = document.getElementById('forceuser-form');
    const key = document.getElementById('forceuser-being').value;
    const value = document.getElementById('forceuser-power').value;
    /*  Check against map object to see if the combination exists
            - If it's invalid (false) return and don't submit the form
            - Otherwise submit the form normally
     */
    if(!validateForceUser(key, value)) {
        alert('That user-to-power combination already exists in the table.');
        return;
    }
    // Submit form if combination is valid
    form.submit();
};

let validateForceUser = (key, value) => {
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
let editForceUser = (beingid, forceid) => {
    console.log(`Editing Row${beingid}${forceid}`)
};

// Update Allegiance
let updateForceUser = (beingid, forceid) => {
    // Context Row
    const row = document.getElementById(`${beingid + forceid}`);
    const value = row.querySelector('.form-control.forcepower').value;
    // Prepare Payload from information within the context row
    let payload = ($(row).find('input, select').serialize() + `&forceuser_beingid=${beingid}&forceuser_oldforceid=${forceid}`);
    // No change was made when hitting button
    if(value === forceid) {
        return;
    }
    // Change was made - validate the combination
    if(!validateForceUser(beingid, value)) {
        alert('Error: That combination is already present. Please try a different combination.');
        window.location.reload(true);
        return;
    }
    // Make PUT Request
    $.ajax({
        url: '/forceuser',
        method: "PUT",
        data: payload,
        success: function() {
            window.location.reload(true);
        }
    });
};

let deleteForceUser = (beingid, forceid) => {
    if(confirm("Are you sure you want to delete this user-to-power combination?")) {
        let payload = `forceuser_forceid=${forceid}&forceuser_beingid=${beingid}`;
        // Make DELETE Request
        $.ajax({
            url: '/forceuser',
            method: "DELETE",
            data: payload,
            success: function() {
                window.location.reload(true);
            }
        });
    }
};


