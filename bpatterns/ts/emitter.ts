interface Emitter {
    pos: Vector,
    fn: Path_Function,
    params: Path_Parameters,
    config: Pattern_Config,
    fire_timer: number,
    arc_table: Arc_Table | null,
    active: boolean,
}

function build_emitter_arc_table(emitter: Emitter): void {
    if (emitter.fn === linear_path) {
        emitter.arc_table = null
    } else {
        emitter.arc_table = build_arc_table(emitter.fn, emitter.params, emitter.config.kill_time, emitter.config.speed)
    }
}

function emitter_update(emitter: Emitter, dt: number): void {
    if (!emitter.active) return
    emitter.fire_timer += dt

    if (emitter.fire_timer < emitter.config.fire_rate) return

    emitter.fire_timer = 0
    for (let i = 0; i < emitter.config.bullet_count; i++) {
        // offset rotation per bullet to spread them evenly in a burst
        const params = {
            ...emitter.params,
            rotation: emitter.params.rotation + (i / emitter.config.bullet_count) * Math.PI * 2,
        }

        bullet_spawn(emitter.pos, emitter.fn, params, emitter.config, emitter.arc_table)
    }
}

function update_all(emitters: Emitter[], dt: number): void {
    emitters.forEach(e => emitter_update(e, dt))
    bullet_pool.forEach(b => bullet_update(b, dt))
}