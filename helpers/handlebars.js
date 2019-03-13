const register = function(Handlebars) {
    const helpers = {
        inc: function(value, options) {
            return parseInt(value) + 1;
        },
        isSelected: function (key1, key2) {
            return key1 === key2 ? 'selected' : '';
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (let prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);