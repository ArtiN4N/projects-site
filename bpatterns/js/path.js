"use strict";
function linear_path(t, params) {
    return {
        x: t * Math.cos(params.rotation),
        y: t * Math.sin(params.rotation),
    };
}
function lissajous_path(t, params) {
    return {
        x: params.amp_a * Math.cos(params.freq_a * t + params.delta),
        y: params.amp_b * Math.sin(params.freq_b * t),
    };
}
function spiral_path(t, params) {
    return {
        x: params.amp_a * (params.freq_a * t) * Math.cos(t + params.rotation + params.delta),
        y: params.amp_b * (params.freq_b * t) * Math.sin(t + params.rotation),
    };
}
function rose_path(t, params) {
    let r = params.amp_a * Math.cos(params.freq_a * t);
    return {
        x: r * Math.cos(t + params.rotation),
        y: r * Math.sin(t + params.rotation),
    };
}
function epitrochoid_path(t, params) {
    let combined_amp = params.amp_a + params.amp_b;
    return {
        x: combined_amp * Math.cos(t) - params.delta * Math.cos(combined_amp / params.amp_b * t + params.rotation),
        y: combined_amp * Math.sin(t) - params.delta * Math.sin(combined_amp / params.amp_b * t + params.rotation),
    };
}
function draw_path_preview(emitter, dt) {
    if (!show_pattern) {
        return;
    }
    const steps = 200;
    const origin_x = canvas.width / 2;
    const origin_y = canvas.height / 2;
    ctx.beginPath();
    ctx.strokeStyle = "#fbbbad";
    ctx.lineWidth = 1;
    for (let i = 0; i < emitter.config.bullet_count; i++) {
        const params = Object.assign(Object.assign({}, emitter.params), { rotation: emitter.params.rotation + (i / emitter.config.bullet_count) * Math.PI * 2 });
        let t = 0;
        let dist = 0;
        let sample_dt = dt;
        const first_pos = emitter.fn(0, params);
        ctx.moveTo(origin_x + first_pos.x + emitter.pos.x, origin_y + first_pos.y + emitter.pos.y);
        while (t <= emitter.config.kill_time) {
            t += sample_dt;
            dist += emitter.config.speed * sample_dt;
            let ft = 0;
            if (emitter.arc_table) {
                ft = arc_to_t(emitter.arc_table, dist);
            }
            else {
                ft = t * emitter.config.speed;
            }
            const fpos = emitter.fn(ft, params);
            const screen_x = origin_x + fpos.x + emitter.pos.x;
            const screen_y = origin_y + fpos.y + emitter.pos.y;
            ctx.lineTo(screen_x, screen_y);
        }
    }
    ctx.stroke();
}
