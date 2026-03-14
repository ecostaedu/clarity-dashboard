import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronDown, ArrowUpDown, Plus, MoreHorizontal, Eye, Pencil, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  type?: "text" | "status" | "date" | "currency" | "badge";
}

export interface CrudListPageProps {
  title: string;
  subtitle?: string;
  columns: ColumnDef[];
  data: Record<string, any>[];
  createRoute?: string;
  createLabel?: string;
  baseRoute: string;
  filterOptions?: { key: string; label: string; values: string[] }[];
  onRowClick?: (row: Record<string, any>) => void;
  headerActions?: ReactNode;
}

export function CrudListPage({
  title,
  subtitle,
  columns,
  data,
  createRoute,
  createLabel = "Novo",
  baseRoute,
  filterOptions = [],
  onRowClick,
  headerActions,
}: CrudListPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [actionMenuRow, setActionMenuRow] = useState<number | null>(null);
  const perPage = 10;

  const filtered = data.filter((row) => {
    const matchesSearch = Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesFilters = Object.entries(activeFilters).every(
      ([key, val]) => !val || String(row[key]).toLowerCase() === val.toLowerCase()
    );
    return matchesSearch && matchesFilters;
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = String(a[sortKey]);
        const bVal = String(b[sortKey]);
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const renderCellValue = (col: ColumnDef, value: any) => {
    if (col.type === "status" || col.type === "badge") return <StatusBadge status={String(value)} />;
    if (col.type === "currency") return <span className="tabular-nums">R$ {Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>;
    if (col.type === "date") return <span className="tabular-nums text-muted-foreground">{value}</span>;
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
          {createRoute && (
            <Button onClick={() => navigate(createRoute)} className="gap-2">
              <Plus className="h-4 w-4" />
              {createLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex items-center gap-3 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-9 w-full pl-9 pr-4 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
            />
          </div>
          {filterOptions.map((filter) => (
            <div key={filter.key} className="relative">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setOpenFilter(openFilter === filter.key ? null : filter.key)}
              >
                <Filter className="h-3.5 w-3.5" />
                {filter.label}
                {activeFilters[filter.key] && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
                <ChevronDown className="h-3 w-3" />
              </Button>
              {openFilter === filter.key && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-card-hover z-20 min-w-[160px] py-1 animate-fade-in">
                  <button
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent/50 text-muted-foreground"
                    onClick={() => { setActiveFilters((f) => ({ ...f, [filter.key]: "" })); setOpenFilter(null); setPage(1); }}
                  >
                    Todos
                  </button>
                  {filter.values.map((v) => (
                    <button
                      key={v}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm hover:bg-accent/50",
                        activeFilters[filter.key] === v ? "text-primary font-medium" : "text-foreground"
                      )}
                      onClick={() => { setActiveFilters((f) => ({ ...f, [filter.key]: v })); setOpenFilter(null); setPage(1); }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground",
                      col.sortable && "cursor-pointer hover:text-foreground select-none"
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <ArrowUpDown className="h-3 w-3" />}
                    </span>
                  </th>
                ))}
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-12 text-muted-foreground text-sm">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id || i}
                    className="h-12 border-t border-border/50 transition-colors duration-100 hover:bg-primary/5 cursor-pointer"
                    onClick={() => {
                      if (onRowClick) onRowClick(row);
                      else navigate(`${baseRoute}/${row.id || i + 1}`);
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 text-sm text-foreground">
                        {renderCellValue(col, row[col.key])}
                      </td>
                    ))}
                    <td className="px-4 relative">
                      <button
                        className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setActionMenuRow(actionMenuRow === i ? null : i); }}
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {actionMenuRow === i && (
                        <div className="absolute right-4 top-full mt-1 bg-card border border-border rounded-lg shadow-card-hover z-20 min-w-[150px] py-1 animate-fade-in">
                          <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent/50 flex items-center gap-2" onClick={(e) => { e.stopPropagation(); navigate(`${baseRoute}/${row.id || i + 1}`); }}>
                            <Eye className="h-3.5 w-3.5" /> Visualizar
                          </button>
                          <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent/50 flex items-center gap-2" onClick={(e) => { e.stopPropagation(); navigate(`${baseRoute}/${row.id || i + 1}/edit`); }}>
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>
                          <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent/50 flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setActionMenuRow(null); }}>
                            <Archive className="h-3.5 w-3.5" /> Arquivar
                          </button>
                          <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent/50 flex items-center gap-2 text-destructive" onClick={(e) => { e.stopPropagation(); setActionMenuRow(null); }}>
                            <Trash2 className="h-3.5 w-3.5" /> Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>{sorted.length} {sorted.length === 1 ? "item" : "itens"}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="xs" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant="ghost" size="xs" className={cn(p === page && "bg-primary/10 text-primary")} onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}
            <Button variant="ghost" size="xs" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Próximo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
