"use strict";
function emitter_update(emitter, dt) {
    if (!emitter.active)
        return;
    emitter.fire_timer += dt;
    if (emitter.fire_timer < emitter.config.fire_rate)
        return;
    emitter.fire_timer = 0;
    for (let i = 0; i < emitter.config.bullet_count; i++) {
        // offset rotation per bullet to spread them evenly in a burst
        const params = Object.assign(Object.assign({}, emitter.params), { rotation: emitter.params.rotation + (i / emitter.config.bullet_count) * Math.PI * 2 });
        bullet_spawn(emitter.pos, emitter.fn, params, emitter.config);
    }
}
function update_all(emitters, dt) {
    emitters.forEach(e => emitter_update(e, dt));
    bullet_pool.forEach(b => bullet_update(b, dt));
}
