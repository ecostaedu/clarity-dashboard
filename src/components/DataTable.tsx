import { useState, useMemo, ReactNode } from "react";
import { Search, Filter, ChevronDown, ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: Record<string, any>) => ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
}

export interface ActionConfig {
  label: string;
  icon?: ReactNode;
  onClick: (row: Record<string, any>) => void;
  variant?: "default" | "destructive";
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  filters?: FilterConfig[];
  actions?: ActionConfig[];
  onRowClick?: (row: Record<string, any>) => void;
  pageSizes?: number[];
}

export function DataTable({
  columns,
  data,
  filters = [],
  actions = [],
  onRowClick,
  pageSizes = [10, 25, 50],
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return data.filter((row) => {
      // Global search
      if (search) {
        const match = Object.values(row).some((val) =>
          String(val ?? "").toLowerCase().includes(search.toLowerCase())
        );
        if (!match) return false;
      }
      // Column filters
      for (const f of filters) {
        const val = filterValues[f.key];
        if (val && val !== "__all__") {
          if (f.type === "select") {
            if (String(row[f.key]) !== val) return false;
          } else {
            if (!String(row[f.key] ?? "").toLowerCase().includes(val.toLowerCase())) return false;
          }
        }
      }
      return true;
    });
  }, [data, search, filterValues, filters]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "");
      const bVal = String(b[sortKey] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const allColumns = actions.length > 0
    ? [...columns, { key: "__actions__", label: "Ações", sortable: false }]
    : columns;

  return (
    <div className="rounded-xl bg-card shadow-card overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 flex items-center gap-3 border-b border-border flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="h-9 w-full pl-9 pr-4 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
          />
        </div>
        {filters.length > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-3.5 w-3.5" />
            Filtros
            <ChevronDown className={cn("h-3 w-3 transition-transform", showFilters && "rotate-180")} />
          </Button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && filters.length > 0 && (
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-wrap gap-3">
          {filters.map((f) => (
            <div key={f.key} className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-muted-foreground">{f.label}</span>
              {f.type === "select" ? (
                <Select value={filterValues[f.key] || "__all__"} onValueChange={(v) => { setFilterValues({ ...filterValues, [f.key]: v }); setPage(0); }}>
                  <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todos</SelectItem>
                    {f.options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <input
                  type="text"
                  placeholder={f.label}
                  value={filterValues[f.key] || ""}
                  onChange={(e) => { setFilterValues({ ...filterValues, [f.key]: e.target.value }); setPage(0); }}
                  className="h-8 w-[160px] px-2 rounded-md bg-background border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              )}
            </div>
          ))}
          <div className="flex items-end">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setFilterValues({}); setPage(0); }}>Limpar</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/40">
              {allColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap",
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
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={allColumns.length} className="text-center py-12 text-sm text-muted-foreground">Nenhum registro encontrado.</td></tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="h-12 border-t border-border/50 transition-colors duration-100 hover:bg-primary/5"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 text-sm text-foreground cursor-pointer whitespace-nowrap"
                      onClick={() => onRowClick?.(row)}
                    >
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((a, j) => (
                            <DropdownMenuItem
                              key={j}
                              onClick={() => a.onClick(row)}
                              className={a.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
                            >
                              {a.icon && <span className="mr-2">{a.icon}</span>}
                              {a.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{sorted.length} itens</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
            <SelectTrigger className="h-7 w-[70px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {pageSizes.map((s) => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-xs">por página</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs px-2">{page + 1} de {totalPages}</span>
          <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
