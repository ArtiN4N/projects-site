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

function draw_path_preview(fn: Path_Function, params: Path_Parameters, speed: number, kill_time: number): void {
    const steps = 200
    const origin_x = canvas.width / 2
    const origin_y = canvas.height / 2

    ctx.beginPath()
    ctx.strokeStyle = "#fbbbad"
    ctx.lineWidth = 1

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * kill_time * speed
        const pos = fn(t, params)
        const screen_x = origin_x + pos.x
        const screen_y = origin_y + pos.y

        if (i === 0) ctx.moveTo(screen_x, screen_y)
        else ctx.lineTo(screen_x, screen_y)
    }

    ctx.stroke()
}