export function clsx(...values) {
  return values.filter(Boolean).join(" ");
}

export function formatMoneyCOP(value) {
  const numeric = Number(value || 0);
  try {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(numeric);
  } catch (err) {
    return `${Math.round(numeric || 0).toLocaleString("es-CO")} COP`;
  }
}

export function parsePeriodInput(value) {
  const period = String(value || "").trim();
  const match = period.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  return match ? period : null;
}

export function currentPeriod() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function flattenTree(tree) {
  const out = [];
  const walk = (node, parent = null, level = 0) => {
    out.push({ ...node, __parent: parent, __level: level });
    (node.children || []).forEach((child) => walk(child, node, level + 1));
  };
  (tree || []).forEach((root) => walk(root, null, 0));
  return out;
}

export function findNodes(tree, predicate) {
  return flattenTree(tree).filter(predicate);
}

export function findNodeById(tree, id) {
  return flattenTree(tree).find((node) => Number(node.id) === Number(id)) || null;
}

export function sumBudgetsFromRows(rows, dirty) {
  return (rows || []).reduce((acc, row) => {
    const key = String(row.user_id);
    const value = dirty[key] != null ? Number(dirty[key]) : Number(row?.budget?.budget_amount || 0);
    return acc + (Number.isFinite(value) ? value : 0);
  }, 0);
}
