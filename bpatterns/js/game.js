"use strict";
const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
window.addEventListener("resize", () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
});
load_inputs();
document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", save_inputs);
});
function input() {
    // handle input
}
let shoot_bullets = false;
let show_pattern = false;
const emitters = [{
        pos: { x: 0, y: 0 },
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
        arc_table: null,
        active: true,
    }];
function update(dt) {
    update_all(emitters, dt);
}
function draw(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_path_preview(emitters[0], dt);
    if (shoot_bullets) {
        bullet_pool.forEach(b => bullet_draw(b));
    }
}
let last_time = -1;
function loop(time_stamp) {
    if (last_time === -1) {
        last_time = time_stamp;
        requestAnimationFrame(loop);
        return;
    }
    const dt = (time_stamp - last_time) / 1000;
    last_time = time_stamp;
    input();
    update(dt);
    draw(dt);
    requestAnimationFrame(loop);
}
let new_game = true;
function update_params() {
    reset_bullet_pool();
    const [should_crash, crash_text] = update_config_inputs();
    if (should_crash) {
        window.alert(`Invalid Inputs! ${crash_text}`);
        return;
    }
    build_emitter_arc_table(emitters[0]);
    if (new_game) {
        requestAnimationFrame(loop);
        new_game = false;
    }
}
