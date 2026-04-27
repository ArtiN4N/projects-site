interface Arc_Table {
    distances: number[], // cumulative distance at each sample
    ts: number[], // corresponding t values
    total_length: number
}

function build_arc_table(
    fn: Path_Function, params: Path_Parameters, kill_time: number, speed: number,
    base_samples: number = 500, curvature_threshold: number = 0.5
): Arc_Table {
    const distances: number[] = [0]
    const ts: number[] = [0]
    const max_t = kill_time * speed

    let prev = fn(0, params)
    let total = 0

    for (let i = 1; i <= base_samples; i++) {
        const t = (i / base_samples) * max_t
        const curr = fn(t, params)

        // check curvature by sampling midpoint
        const mid_t = ((i - 1) / base_samples + i / base_samples) / 2 * max_t
        const mid = fn(mid_t, params)

        const direct_dx = curr.x - prev.x
        const direct_dy = curr.y - prev.y
        const direct_dist = Math.sqrt(direct_dx * direct_dx + direct_dy * direct_dy)

        const via_mid = Math.sqrt((mid.x - prev.x) ** 2 + (mid.y - prev.y) ** 2)
                      + Math.sqrt((curr.x - mid.x) ** 2 + (curr.y - mid.y) ** 2)

        // if the midpoint detour is significantly longer, insert extra samples
        if (via_mid - direct_dist > curvature_threshold) {
            const extra_samples = 10
            for (let k = 1; k <= extra_samples; k++) {
                const sub_t = ((i - 1) + k / extra_samples) / base_samples * max_t
                const sub = fn(sub_t, params)
                const dx = sub.x - prev.x
                const dy = sub.y - prev.y
                total += Math.sqrt(dx * dx + dy * dy)
                distances.push(total)
                ts.push(sub_t)
                prev = sub
            }
            continue
        }

        const dx = curr.x - prev.x
        const dy = curr.y - prev.y
        total += Math.sqrt(dx * dx + dy * dy)
        distances.push(total)
        ts.push(t)
        prev = curr
    }

    return { distances, ts, total_length: total };
}

function arc_to_t(table: Arc_Table, distance: number): number {
    const clamped = Math.min(distance, table.total_length)

    // binary search for the segment
    let lo = 0, hi = table.distances.length - 1
    while (lo < hi - 1) {
        const mid = (lo + hi) >> 1
        if (table.distances[mid] < distance) lo = mid
        else hi = mid
    }

    // interpolate between the two surrounding samples
    const t_range = table.distances[hi] - table.distances[lo]
    if (t_range === 0) return table.ts[lo]

    const alpha = (clamped - table.distances[lo]) / t_range
    return table.ts[lo] + alpha * (table.ts[hi] - table.ts[lo])
}