export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function normalizeUser(user) {
  const id = user.id ?? user.user_id ?? user.userId ?? null;
  const name = user.name ?? user.nombre ?? user.full_name ?? "";
  const documentId = user.document_id ?? user.documentId ?? user.cedula ?? "";
  const email = user.email ?? "";
  const role = user.role ?? user.rol ?? "";
  const active =
    typeof user.active === "boolean"
      ? user.active
      : user.active === "t"
        ? true
        : Boolean(user.active);

  const directionName =
    user.direction_name ??
    user.direccion ??
    user.nombre_direccion ??
    user.direction ??
    user.regional ??
    user.direccion_type ??
    "";

  const coordinatorName =
    user.coordinator_name ??
    user.coordinator ??
    user.nombre_coordinador ??
    user.coordinador ??
    "";

  const coordinatorId = user.coordinator_id ?? user.coordinatorId ?? null;

  const district = user.district ?? user.distrito ?? "";
  const districtClaro = user.district_claro ?? user.distrito_claro ?? "";

  return {
    id,
    name: String(name ?? ""),
    documentId: String(documentId ?? ""),
    email: String(email ?? ""),
    role: String(role ?? ""),
    active,
    directionName: String(directionName ?? ""),
    coordinatorId: coordinatorId ? Number(coordinatorId) : null,
    coordinatorName: String(coordinatorName ?? ""),
    district: String(district ?? ""),
    districtClaro: String(districtClaro ?? "")
  };
}
