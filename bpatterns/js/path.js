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
function draw_path_preview(emitter) {
    const steps = 200;
    const origin_x = canvas.width / 2;
    const origin_y = canvas.height / 2;
    ctx.beginPath();
    ctx.strokeStyle = "#fbbbad";
    ctx.lineWidth = 1;
    for (let i = 0; i < emitter.config.bullet_count; i++) {
        const params = Object.assign(Object.assign({}, emitter.params), { rotation: emitter.params.rotation + (i / emitter.config.bullet_count) * Math.PI * 2 });
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * emitter.config.kill_time * emitter.config.speed;
            const pos = emitter.fn(t, params);
            const screen_x = origin_x + pos.x + emitter.pos.x;
            const screen_y = origin_y + pos.y + emitter.pos.y;
            if (i === 0)
                ctx.moveTo(screen_x, screen_y);
            else
                ctx.lineTo(screen_x, screen_y);
        }
    }
    ctx.stroke();
}
