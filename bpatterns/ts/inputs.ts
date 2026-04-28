interface Config_Values {
    x: number,
    y: number,
    speed: number,
    kill_time: number,
    bullet_count: number,
    fire_rate: number,
    path_fn: string,
    amp_a: number,
    amp_b: number,
    freq_a: number,
    freq_b: number,
    delta: number,
    rotation: number,
    draw_bullets: boolean,
    draw_pattern: boolean
}

function read_config_inputs(): Config_Values {
    const x            = parseFloat((document.getElementById("start_pos_x")  as HTMLInputElement).value)
    const y            = parseFloat((document.getElementById("start_pos_y")  as HTMLInputElement).value)
    const speed        = parseFloat((document.getElementById("bullet_speed") as HTMLInputElement).value)
    const kill_time    = parseFloat((document.getElementById("kill_time")    as HTMLInputElement).value)
    const bullet_count = parseInt((document.getElementById("bullet_count")   as HTMLInputElement).value)
    const fire_rate    = parseFloat((document.getElementById("fire_rate")    as HTMLInputElement).value)

    const path_fn   = (document.getElementById("path_function")       as HTMLInputElement).value
    const amp_a     = parseFloat((document.getElementById("amp_a")    as HTMLInputElement).value)
    const amp_b     = parseFloat((document.getElementById("amp_b")    as HTMLInputElement).value)
    const freq_a    = parseFloat((document.getElementById("freq_a")   as HTMLInputElement).value)
    const freq_b    = parseFloat((document.getElementById("freq_b")   as HTMLInputElement).value)
    const delta     = parseFloat((document.getElementById("delta")    as HTMLInputElement).value) * Math.PI
    const rotation  = parseFloat((document.getElementById("rotation") as HTMLInputElement).value) * Math.PI

    const draw_bullets = (document.getElementById("shoot_bullets") as HTMLInputElement).checked
    const draw_pattern = (document.getElementById("show_pattern") as HTMLInputElement).checked

    return {
        x, y, speed, kill_time, bullet_count, fire_rate, path_fn, amp_a, amp_b, freq_a, freq_b, delta, rotation, draw_bullets, draw_pattern
    }
}

function update_config_inputs(inputs: Config_Values = read_config_inputs()): [boolean, string] {
    if (isNaN(inputs.x) || isNaN(inputs.y) || isNaN(inputs.speed) || isNaN(inputs.kill_time) || isNaN(inputs.bullet_count) || isNaN(inputs.fire_rate)
        || isNaN(inputs.amp_a) || isNaN(inputs.amp_b) || isNaN(inputs.freq_a) || isNaN(inputs.freq_b) || isNaN(inputs.delta) || isNaN(inputs.rotation)
    ) {
        return [true, "Please enter values for all inputs!"]
    }

    if (inputs.speed <= 0) { return [true, "Please enter a non-zero positive float for speed!"] }
    if (inputs.kill_time <= 0) { return [true, "Please enter a non-zero positive float for kill time!"] }
    if (inputs.bullet_count <= 0) { return [true, "Please enter a non-zero positive integer for bullet count!"] }
    if (!Number.isInteger(inputs.bullet_count)) { return [true, "Please enter an integer for bullet count!"] }
    if (inputs.fire_rate <= 0) { return [true, "Please enter a non-zero positive integer for fire_rate!"] }

    
    apply_config_inputs(inputs)
    

    return [false, ""]
}

function get_path_fn_from_string(name: string): Path_Function {
    let fn: Path_Function = linear_path
    switch (name) {
    case "lissajous":
        fn = lissajous_path
        break;
    case "spiral":
        fn = spiral_path
        break;
    case "rose":
        fn = rose_path
        break;
    case "epitrochoid":
        fn = epitrochoid_path
        break;
    default:
        break;
    }

    return fn
}

function apply_config_inputs(inputs: Config_Values): void {
    emitters[0] = {
        pos: { x: inputs.x, y: inputs.y },
        fn: get_path_fn_from_string(inputs.path_fn),
        params: {
            amp_a: inputs.amp_a,
            amp_b: inputs.amp_b,
            freq_a: inputs.freq_a,
            freq_b: inputs.freq_b,
            delta: inputs.delta,
            rotation: inputs.rotation,
        },
        config: {
            speed: inputs.speed,
            kill_time: inputs.kill_time,
            bullet_count: inputs.bullet_count,
            fire_rate: inputs.fire_rate,
        },
        fire_timer: inputs.fire_rate,
        arc_table: null,
        active: true,
    }

    show_pattern = inputs.draw_pattern
    shoot_bullets = inputs.draw_bullets
}

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

async function save_pattern_config(): Promise<void> {
    let config_name: string | null = prompt("Please enter a name for this configuration:", "")
    if (config_name == null || config_name == "") { return }

    const inputs = read_config_inputs()

    const response = await fetch(`/api/bpatterns/save/${config_name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
    })

    if (!response.ok) throw new Error(`Save failed: ${response.status}`)
}

async function load_pattern_config(config_name: string): Promise<Config_Values> {
    const response = await fetch(`/api/bpatterns/load/${config_name}`)

    if (!response.ok) throw new Error(`Load failed: ${response.status}`)

    return response.json()
}

async function load_pattern_names(): Promise<string[]> {
    const response = await fetch(`/api/bpatterns/list/`)

    if (!response.ok) throw new Error(`List failed: ${response.status}`)

    return response.json() as Promise<string[]>
}