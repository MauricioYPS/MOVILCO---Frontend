import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Download, AlertCircle, ChevronRight } from "lucide-react"
import useAuthSession from "../hooks/useAuthSession"
import Badge from "../components/novelties/common/Badge"
import FilterToolbar from "../components/novelties/FilterToolbar"
import RecentPanel from "../components/novelties/RecentPanel"
import DataTable from "../components/novelties/DataTable"
import CreateEditModal from "../components/novelties/modals/CreateEditModal"
import DetailModal from "../components/novelties/modals/DetailModal"
import DeleteModal from "../components/novelties/modals/DeleteModal"
import {
  fetchNovelties,
  fetchRecentNovelties,
  fetchNoveltyDetail,
  createNovelty,
  updateNovelty,
  deleteNovelty,
  selectNovelties,
  setFilters,
  clearDetail
} from "../../store/reducers/noveltiesSlice"

const formatDate = (value) => {
  if (!value) return ""
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const str = String(value)
  return str.length >= 10 ? str.slice(0, 10) : str
}

const computeStatus = (start, end) => {
  const todayStr = new Date().toISOString().slice(0, 10)
  const startDate = start ? new Date(`${formatDate(start)}T00:00:00`) : null
  const endDate = end ? new Date(`${formatDate(end)}T00:00:00`) : null
  const todayDate = new Date(`${todayStr}T00:00:00`)
  if (startDate && startDate > todayDate) return "Pending"
  if (endDate && endDate < todayDate) return "Expired"
  return "Active"
}

const buildDatesLabel = (start, end) => {
  const formattedStart = formatDate(start)
  const formattedEnd = formatDate(end)
  const todayStr = new Date().toISOString().slice(0, 10)
  if (formattedStart && formattedStart === formattedEnd) {
    return formattedStart === todayStr ? "Hoy" : formattedStart
  }
  if (formattedStart || formattedEnd) return `${formattedStart} - ${formattedEnd}`.trim()
  return ""
}

const mapNoveltyItem = (item = {}) => ({
  id: item.id,
  name: item.user_name || item.name || "Sin nombre",
  docId: item.document_id || item.docId || "",
  type: item.novelty_type || item.type || "N/D",
  start: formatDate(item.start_date || item.start),
  end: formatDate(item.end_date || item.end),
  district: item.district_claro || item.district || "N/D",
  regional: item.regional || "",
  role: item.role || "",
  userId: item.user_id || "",
  created_at: formatDate(item.created_at),
  updated_at: formatDate(item.updated_at),
  notes: item.notes || ""
})

const mapRecentItem = (item = {}) => {
  const start = item.start_date || item.start
  const end = item.end_date || item.end
  return {
    id: item.id,
    user: item.user_name || item.name || "Sin nombre",
    type: item.novelty_type || item.type || "N/D",
    dates: buildDatesLabel(start, end),
    status: computeStatus(start, end)
  }
}

const mapOverlap = (overlaps = []) =>
  overlaps.map((ov) => ({
    type: ov?.novelty_type || ov?.type || "N/D",
    start: formatDate(ov?.start_date || ov?.start),
    end: formatDate(ov?.end_date || ov?.end),
    notes: ov?.notes || ""
  }))

const NoveltyManager = () => {
  const dispatch = useDispatch()
  const { role } = useAuthSession()
  const {
    list,
    recent,
    total,
    limit,
    offset,
    filters,
    listLoading,
    recentLoading,
    mutationLoading,
    error,
    detail
  } = useSelector(selectNovelties)

  const [modalType, setModalType] = useState(null)
  const [selectedNovelty, setSelectedNovelty] = useState(null)
  const [conflictError, setConflictError] = useState(null)
  const [formError, setFormError] = useState("")
  const [identifyMode, setIdentifyMode] = useState("document_id")
  const [identifier, setIdentifier] = useState("")
  const [formData, setFormData] = useState({
    novelty_type: "INCAPACIDAD",
    start_date: "",
    end_date: "",
    notes: ""
  })

  const noveltyOptions = useMemo(() => {
    const base = ["INCAPACIDAD", "VACACIONES", "LICENCIA", "LICENCIA NO REMUNERADA", "PERMISO"]
    if (selectedNovelty?.type && !base.includes(selectedNovelty.type)) return [...base, selectedNovelty.type]
    return base
  }, [selectedNovelty?.type])

  useEffect(() => {
    if (role === "ADMIN") {
      dispatch(fetchRecentNovelties())
      dispatch(fetchNovelties({ limit, offset, q: filters.q, date_from: filters.dateFrom, date_to: filters.dateTo }))
    }
  }, [dispatch, role])

  const applyFilters = useCallback(
    (nextFilters) => {
      dispatch(setFilters(nextFilters))
      dispatch(
        fetchNovelties({
          limit,
          offset: 0,
          q: nextFilters.q || "",
          date_from: nextFilters.dateFrom || "",
          date_to: nextFilters.dateTo || ""
        })
      )
    },
    [dispatch, limit]
  )

  const openCreateModal = useCallback(() => {
    setFormData({ novelty_type: "INCAPACIDAD", start_date: "", end_date: "", notes: "" })
    setIdentifier("")
    setIdentifyMode("document_id")
    setConflictError(null)
    setFormError("")
    setModalType("create")
  }, [])

  const openEditModal = useCallback(
    (novelty) => {
      const mapped = mapNoveltyItem(novelty)
      setSelectedNovelty(mapped)
      setFormData({
        novelty_type: mapped.type || "INCAPACIDAD",
        start_date: mapped.start || "",
        end_date: mapped.end || "",
        notes: mapped.notes || ""
      })
      setIdentifyMode("document_id")
      setIdentifier(mapped.docId || "")
      setConflictError(null)
      setFormError("")
      setModalType("edit")
      dispatch(fetchNoveltyDetail(mapped.id))
    },
    [dispatch]
  )

  const openDetailModal = useCallback(
    (novelty) => {
      setSelectedNovelty(mapNoveltyItem(novelty))
      setModalType("detail")
      dispatch(fetchNoveltyDetail(novelty?.id))
    },
    [dispatch]
  )

  const openDeleteModal = useCallback((novelty) => {
    setSelectedNovelty(mapNoveltyItem(novelty))
    setModalType("delete")
  }, [])

  const closeModal = () => {
    setModalType(null)
    setSelectedNovelty(null)
    setConflictError(null)
    setFormError("")
    setIdentifier("")
    setIdentifyMode("document_id")
    dispatch(clearDetail())
  }

  const handleApiConflict = (errData) => {
    if (!errData) return false
    if (errData.code === "NOVELTY_OVERLAP") {
      setConflictError({ message: errData.message || "Conflicto detectado", overlaps: mapOverlap(errData.overlaps || []) })
      return true
    }
    if (errData.code === "NOVELTY_DUPLICATE") {
      window.alert("Ya existe una novedad igual")
      return true
    }
    return false
  }

  const handleCreate = async () => {
    setFormError("")
    setConflictError(null)
    if (!formData.start_date || !formData.end_date) {
      setFormError("Inicio y fin son obligatorios")
      return
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setFormError("La fecha fin debe ser mayor o igual al inicio")
      return
    }
    const trimmed = identifier.trim()
    if (!trimmed) {
      setFormError("Debes ingresar un identificador")
      return
    }
    const payload = {
      novelty_type: formData.novelty_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      notes: formData.notes
    }
    if (identifyMode === "document_id") payload.document_id = trimmed
    else if (identifyMode === "user_id") payload.user_id = Number(trimmed)
    else if (identifyMode === "name") payload.name = trimmed

    try {
      await dispatch(createNovelty(payload)).unwrap()
      closeModal()
      dispatch(fetchRecentNovelties())
      dispatch(fetchNovelties({ limit, offset: 0, q: filters.q, date_from: filters.dateFrom, date_to: filters.dateTo }))
    } catch (err) {
      if (handleApiConflict(err)) return
      setFormError(err?.message || "No se pudo guardar la novedad")
    }
  }

  const handleUpdate = async () => {
    if (!selectedNovelty?.id) return
    setFormError("")
    setConflictError(null)
    if (!formData.start_date || !formData.end_date) {
      setFormError("Inicio y fin son obligatorios")
      return
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setFormError("La fecha fin debe ser mayor o igual al inicio")
      return
    }
    const payload = {
      novelty_type: formData.novelty_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      notes: formData.notes
    }

    try {
      await dispatch(updateNovelty({ id: selectedNovelty.id, payload })).unwrap()
      closeModal()
      dispatch(fetchRecentNovelties())
      dispatch(fetchNovelties({ limit, offset, q: filters.q, date_from: filters.dateFrom, date_to: filters.dateTo }))
    } catch (err) {
      if (handleApiConflict(err)) return
      setFormError(err?.message || "No se pudo actualizar la novedad")
    }
  }

  const handleDelete = async () => {
    if (!selectedNovelty?.id) return
    try {
      await dispatch(deleteNovelty(selectedNovelty.id)).unwrap()
      closeModal()
      dispatch(fetchRecentNovelties())
      dispatch(fetchNovelties({ limit, offset: 0, q: filters.q, date_from: filters.dateFrom, date_to: filters.dateTo }))
    } catch (err) {
      window.alert(err?.message || "No se pudo eliminar la novedad")
    }
  }

  const isAuthorized = role === "ADMIN"
  if (role && !isAuthorized) {
    return (
      <div className="w-full p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="text-red-600 mb-3" size={32} />
        <h2 className="text-xl font-bold text-slate-800">Acceso denegado</h2>
        <p className="text-sm text-slate-500 mt-1">Esta seccion es exclusiva para Recursos Humanos.</p>
      </div>
    )
  }

  const recentMapped = useMemo(() => recent.map(mapRecentItem), [recent])
  const listMapped = useMemo(() => list.map(mapNoveltyItem), [list])
  const fromRecord = total === 0 ? 0 : offset + 1
  const toRecord = Math.min(offset + limit, total)

  const detailData = detail?.data ? mapNoveltyItem(detail.data) : selectedNovelty

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 p-6 lg:p-10 min-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion de Novedades</h1>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Recursos Humanos</span>
            <ChevronRight size={12} />
            <span className="font-semibold text-red-700">Control de Ausentismos</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center gap-2 shadow-sm">
            <Download size={16} /> Exportar Reporte
          </button>
          <button
            onClick={openCreateModal}
            disabled={!isAuthorized}
            className="px-4 py-2 bg-red-700 text-white rounded-md text-sm font-semibold hover:bg-red-800 transition-all flex items-center gap-2 shadow-sm shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Registrar Novedad
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <RecentPanel loading={recentLoading} items={recentMapped} onRefresh={() => dispatch(fetchRecentNovelties())} />
        </div>

        <div className="xl:col-span-3 space-y-4">
          <FilterToolbar listLoading={listLoading} onApply={applyFilters} initialFilters={filters} />
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <DataTable
            listLoading={listLoading}
            allNovelties={listMapped}
            isAuthorized={isAuthorized}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            fromRecord={fromRecord}
            toRecord={toRecord}
            total={total}
            limit={limit}
            offset={offset}
            handleLimitChange={(val) => dispatch(fetchNovelties({ ...filters, offset: 0, limit: Number(val) || 25 }))}
            handlePageChange={(direction) => {
              const nextOffset = direction === "prev" ? Math.max(offset - limit, 0) : offset + limit
              if (direction === "next" && nextOffset >= total) return
              dispatch(fetchNovelties({ ...filters, offset: nextOffset, limit }))
            }}
            listError={error}
          />
        </div>
      </div>

      {(modalType === "create" || modalType === "edit") && (
        <CreateEditModal
          modalType={modalType}
          onClose={closeModal}
          mutationLoading={mutationLoading}
          formData={formData}
          setFormData={setFormData}
          noveltyOptions={noveltyOptions}
          identifyMode={identifyMode}
          setIdentifyMode={setIdentifyMode}
          identifier={identifier}
          setIdentifier={setIdentifier}
          formError={formError}
          conflictError={conflictError}
          onSubmit={modalType === "create" ? handleCreate : handleUpdate}
        />
      )}

      {modalType === "detail" && detailData && (
        <DetailModal
          detailData={detailData}
          loading={detail?.loading}
          isAuthorized={isAuthorized}
          onClose={closeModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {modalType === "delete" && selectedNovelty && (
        <DeleteModal mutationLoading={mutationLoading} onClose={closeModal} onConfirm={handleDelete} />
      )}
    </div>
  )
}

export default NoveltyManager
