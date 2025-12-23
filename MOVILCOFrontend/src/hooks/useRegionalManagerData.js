import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { api } from "../../store/api"

const currentPeriod = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
}

const normalizeNovedades = (data) => {
    if (!data || typeof data !== "object") return []
    const entries = []
    Object.entries(data).forEach(([district, list]) => {
        if (Array.isArray(list)) {
            list.forEach((item, idx) =>
                entries.push({
                    id: `${district}-${idx}`,
                    zona: district,
                    ciudad: item.coordinacion || "N/A",
                    tipo: item.tipo || "N/A",
                    mensaje: item.descripcion || "",
                    time: `${item.fecha_inicio || ""}`.split("T")[0],
                    severity: item.tipo === "PERMISO" ? "success" : "warning"
                })
            )
        }
    })
    return entries
}

const defaultPeriods = {
    directions: "2025-12",
    novedades: currentPeriod()
}

export default function useRegionalManagerData({ periodDirections = defaultPeriods.directions, periodNovedades = defaultPeriods.novedades } = {}) {
    const [directions, setDirections] = useState([])
    const [novedades, setNovedades] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            setError("")
            const [dirRes, novRes] = await Promise.all([
                axios.get(`${api}/api/regional/directions`, { params: { period: periodDirections } }),
                axios.get(`${api}/api/regional/novedades`, { params: { period: periodNovedades } })
            ])
            setDirections(Array.isArray(dirRes.data?.direcciones) ? dirRes.data.direcciones : [])
            setNovedades(normalizeNovedades(novRes.data?.resultado))
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || "No se pudieron cargar los datos regionales"
            setError(msg)
            setDirections([])
            setNovedades([])
        } finally {
            setLoading(false)
        }
    }, [periodDirections, periodNovedades])

    useEffect(() => {
        loadData()
    }, [loadData])

    const currentDay = directions[0]?.metas?.dia_actual ?? 0
    const totalDays = directions[0]?.metas?.dias_mes ?? 30
    const progressTimePct = totalDays > 0 ? (currentDay / totalDays) * 100 : 0

    const processedData = useMemo(() => {
        return directions.map((dir) => {
            const metas = dir.metas || {}
            const proratedGoal = metas.meta_dia ?? 0
            const compliance = metas.meta_mes > 0 ? (metas.total_ventas / metas.meta_mes) * 100 : 0
            const proratedCompliance = proratedGoal > 0 ? (metas.total_ventas / proratedGoal) * 100 : 0
            const gap = metas.total_ventas - (metas.meta_dia ?? 0)

            const coordsProcessed = (dir.coordinaciones || []).map((c) => {
                const coordId = c.id || c.coordinacion_id || c.name
                const metaDia = c.meta_dia ?? c.prorrateo ?? 0
                const metaSemana = c.meta_semana ?? 0
                const metaMes = c.meta_mes ?? c.prorrateo ?? 0
                const prorratedCompliance = metaDia > 0 ? (c.ventas / metaDia) * 100 : 0
                const gapCoord = c.ventas - metaDia

                return {
                    ...c,
                    id: coordId,
                    metaDia,
                    metaSemana,
                    metaMes,
                    proratedGoal: metaDia,
                    proratedCompliance,
                    gap: gapCoord
                }
            })

            return {
                id: dir.id,
                name: dir.direccion?.name || "Sin nombre",
                director: dir.direccion?.name || "Director",
                sales: metas.total_ventas ?? 0,
                monthGoal: metas.meta_mes ?? 0,
                proratedGoal,
                compliance,
                proratedCompliance,
                gap,
                coordinators: coordsProcessed,
                metaDia: metas.meta_dia ?? 0
            }
        })
    }, [directions])

    const globalStats = useMemo(() => {
        const totalGoal = processedData.reduce((acc, d) => acc + (d.monthGoal ?? 0), 0)
        const totalSales = processedData.reduce((acc, d) => acc + (d.sales ?? 0), 0)
        const totalProrated = processedData.reduce((acc, d) => acc + (d.proratedGoal ?? 0), 0)
        const gap = totalSales - totalProrated
        return {
            sales: totalSales,
            goal: totalGoal,
            proratedGoal: totalProrated,
            compliance: totalGoal > 0 ? (totalSales / totalGoal) * 100 : 0,
            proratedCompliance: totalProrated > 0 ? (totalSales / totalProrated) * 100 : 0,
            gap
        }
    }, [processedData])

    return {
        directions,
        novedades,
        loading,
        error,
        processedData,
        globalStats,
        currentDay,
        totalDays,
        progressTimePct,
        reload: loadData,
        periodDirections,
        periodNovedades
    }
}
