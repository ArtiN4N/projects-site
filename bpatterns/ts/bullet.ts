type Vector = {
    x: number,
    y: number,
}

interface Bullet {
    spawn_pos: Vector,
    fn: Path_Function,
    params: Path_Parameters,
    config: Pattern_Config,
    timer: number,
    distance: number,
    arc_table: Arc_Table | null,
    active: boolean,
}

const MAX_BULLETS = 1000
const bullet_pool: Bullet[] = Array.from({ length: MAX_BULLETS }, () => ({
    spawn_pos: { x: 0, y: 0 },
    fn: lissajous_path,
    params: { amp_a: 0, amp_b: 0, freq_a: 0, freq_b: 0, delta: 0, rotation: 0 },
    config: { speed: 0, kill_time: 0, bullet_count: 0, fire_rate: 0 },
    timer: 0,
    distance: 0,
    arc_table: null,
    active: false,
}))

function bullet_spawn(spawn_pos: Vector, fn: Path_Function, params: Path_Parameters, config: Pattern_Config, arc_table: Arc_Table | null): void {
    const bullet = bullet_pool.find(b => !b.active)
    if (!bullet) return

    bullet.spawn_pos = spawn_pos
    bullet.fn = fn
    bullet.params = params
    bullet.config = config
    bullet.timer = 0
    bullet.distance = 0
    bullet.arc_table = arc_table
    bullet.active = true
}

// --- Bullet Functions ---

function reset_bullet_pool(): void {
    bullet_pool.forEach(b => b.active = false)
}

function bullet_position(bullet: Bullet): Vector {
    let t: number;
    if (bullet.arc_table) {
        t = arc_to_t(bullet.arc_table, bullet.distance)
    } else {
        t = bullet.timer * bullet.config.speed
    }

    const offset = bullet.fn(t, bullet.params)
    return {
        x: bullet.spawn_pos.x + offset.x,
        y: bullet.spawn_pos.y + offset.y,
    }
}

function bullet_update(bullet: Bullet, dt: number): void {
    if (!bullet.active) return

    bullet.timer += dt
    bullet.distance += bullet.config.speed * dt

    if (bullet.timer >= bullet.config.kill_time) bullet.active = false
}

const bullet_radius: number = 10

function bullet_draw(bullet: Bullet): void {
    if (!bullet.active) return

    const pos = bullet_position(bullet)
    const screen_x = canvas.width / 2 + pos.x
    const screen_y = canvas.height / 2 + pos.y

    ctx.beginPath()
    ctx.arc(screen_x, screen_y, bullet_radius, 0, Math.PI * 2)
    ctx.fillStyle = "#ee8695"
    ctx.fill()
}