interface Path_Parameters {
    amp_a: number,
    amp_b: number,
    freq_a: number,
    freq_b: number,
    delta: number,
    rotation: number,
}

type Path_Function = (t: number, params: Path_Parameters) => Vector

function linear_path(t: number, params: Path_Parameters): Vector {
    return {
        x: t * Math.cos(params.rotation),
        y: t * Math.sin(params.rotation),
    }
}

function lissajous_path(t: number, params: Path_Parameters): Vector {
    return {
        x: params.amp_a * Math.cos(params.freq_a * t + params.delta),
        y: params.amp_b * Math.sin(params.freq_b * t),
    }
}

function spiral_path(t: number, params: Path_Parameters): Vector {
    return {
        x: params.amp_a * (params.freq_a * t) * Math.cos(t + params.rotation + params.delta),
        y: params.amp_b * (params.freq_b * t) * Math.sin(t + params.rotation),
    }
}

function rose_path(t: number, params: Path_Parameters): Vector {
    let r = params.amp_a * Math.cos(params.freq_a * t)

    return {
        x: r * Math.cos(t + params.rotation),
        y: r * Math.sin(t + params.rotation),
    }
}

function epitrochoid_path(t: number, params: Path_Parameters): Vector {
    let combined_amp: number = params.amp_a + params.amp_b

    return {
        x: combined_amp * Math.cos(t) - params.delta * Math.cos(combined_amp / params.amp_b * t + params.rotation),
        y: combined_amp * Math.sin(t) - params.delta * Math.sin(combined_amp / params.amp_b * t + params.rotation),
    }
}

function draw_path_preview(emitter: Emitter, dt: number): void {
    const steps = 200
    const origin_x = canvas.width / 2
    const origin_y = canvas.height / 2

    ctx.beginPath()
    ctx.strokeStyle = "#fbbbad"
    ctx.lineWidth = 1

    for (let i = 0; i < emitter.config.bullet_count; i++) {

        const params = {
            ...emitter.params,
            rotation: emitter.params.rotation + (i / emitter.config.bullet_count) * Math.PI * 2,
        }

        
        let t: number = 0
        let dist: number = 0
        let sample_dt: number = dt
        while (t <= emitter.config.kill_time) {
            t += sample_dt
            dist += emitter.config.speed * sample_dt

            let ft: number = 0
            if (emitter.arc_table) {
                ft = arc_to_t(emitter.arc_table, dist)
            } else {
                ft = t * emitter.config.speed
            }

            const fpos = emitter.fn(ft, params)
            const screen_x = origin_x + fpos.x + emitter.pos.x
            const screen_y = origin_y + fpos.y + emitter.pos.y

            if (t === 0) ctx.moveTo(screen_x, screen_y)
            else ctx.lineTo(screen_x, screen_y)
        }

        /*for (let j = 0; j <= steps; j++) {
            let t: number
            if (emitter.arc_table) {
                const max_distance = emitter.config.kill_time * emitter.config.speed
                const distance = (j / steps) * max_distance
                t = arc_to_t(emitter.arc_table, distance)
            } else {
                t = (j / steps) * emitter.config.kill_time * emitter.config.speed
            }

            const pos = emitter.fn(t, params)
            const screen_x = origin_x + pos.x + emitter.pos.x
            const screen_y = origin_y + pos.y + emitter.pos.y

            if (j === 0) ctx.moveTo(screen_x, screen_y)
            else ctx.lineTo(screen_x, screen_y)
        }*/
    }

    ctx.stroke()
}