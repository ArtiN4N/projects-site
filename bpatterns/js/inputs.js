"use strict";
function save_inputs() {
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach(el => {
        if (el.type === "checkbox")
            localStorage.setItem(el.id, el.checked.toString());
        else
            localStorage.setItem(el.id, el.value);
    });
}
function load_inputs() {
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach(el => {
        const saved = localStorage.getItem(el.id);
        if (saved === null)
            return;
        if (el.type === "checkbox")
            el.checked = saved === "true";
        else
            el.value = saved;
    });
}
