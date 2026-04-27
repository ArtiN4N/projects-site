function save_inputs(): void {
    const inputs = document.querySelectorAll("input, select") as NodeListOf<HTMLInputElement>
    inputs.forEach(el => {
        if (el.type === "checkbox") localStorage.setItem(el.id, el.checked.toString())
        else localStorage.setItem(el.id, el.value)
    })
}

function load_inputs(): void {
    const inputs = document.querySelectorAll("input, select") as NodeListOf<HTMLInputElement>
    inputs.forEach(el => {
        const saved = localStorage.getItem(el.id)
        if (saved === null) return
        if (el.type === "checkbox") el.checked = saved === "true"
        else el.value = saved
    })
}