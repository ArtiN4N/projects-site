const canvas = document.getElementById("game_canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

window.addEventListener("resize", () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
})

load_inputs()
document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", save_inputs)
})

function input(): void {
    // handle input
}

let shoot_bullets: boolean = false

const emitters: Emitter[] = [{
    pos: {x: 0, y:0},
    fn: linear_path,
    params: {
        amp_a: 0,
        amp_b: 0,
        freq_a: 0,
        freq_b: 0,
        delta: 0,
        rotation: 0,
    },
    config: {
        speed: 100,
        kill_time: 10,
        bullet_count: 1,
        fire_rate: 1,
    },
    fire_timer: 0,
    active: true,
}]

function update(dt: number): void {
    update_all(emitters, dt)
}

function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw_path_preview(emitters[0].fn, emitters[0].params, emitters[0].config.speed, emitters[0].config.kill_time)
    if (shoot_bullets) { bullet_pool.forEach(b => bullet_draw(b)) }
}

let last_time: number = -1

function loop(time_stamp: number): void {
    if (last_time === -1) {
        last_time = time_stamp
        requestAnimationFrame(loop)
        return
    }

    const dt: number = (time_stamp - last_time) / 1000
    last_time = time_stamp

    input()
    update(dt)
    draw()

    requestAnimationFrame(loop)
}

let new_game: boolean = true

function update_params(): void {
    reset_bullet_pool()

    const [should_crash, crash_text] = read_config_inputs()
    if (should_crash) {
        window.alert(`Invalid Inputs! ${crash_text}`)
        return
    }

    if (new_game) {
        requestAnimationFrame(loop)
        new_game = false
    }
}

function read_config_inputs(): [boolean, string] {
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

    shoot_bullets = (document.getElementById("shoot_bullets") as HTMLInputElement).checked

    if (isNaN(x) || isNaN(y) || isNaN(speed) || isNaN(kill_time) || isNaN(bullet_count) || isNaN(fire_rate)
        || isNaN(amp_a) || isNaN(amp_b) || isNaN(freq_a) || isNaN(freq_b) || isNaN(delta) || isNaN(rotation)
    ) {
        return [true, "Please enter values for all inputs!"]
    }

    if (speed <= 0) { return [true, "Please enter a non-zero positive float for speed!"] }
    if (kill_time <= 0) { return [true, "Please enter a non-zero positive float for kill time!"] }
    if (bullet_count <= 0) { return [true, "Please enter a non-zero positive integer for bullet count!"] }
    if (!Number.isInteger(bullet_count)) { return [true, "Please enter an integer for bullet count!"] }
    if (fire_rate <= 0) { return [true, "Please enter a non-zero positive integer for fire_rate!"] }

    let fn: Path_Function = linear_path
    switch (path_fn) {
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

    emitters[0] = {
        pos: { x, y },
        fn,
        params: {
            amp_a,
            amp_b,
            freq_a,
            freq_b,
            delta,
            rotation,
        },
        config: {
            speed,
            kill_time,
            bullet_count,
            fire_rate,
        },
        fire_timer: fire_rate,
        active: true,
    }

    return [false, ""]
}