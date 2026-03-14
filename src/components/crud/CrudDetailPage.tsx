import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";

export interface DetailField {
  key: string;
  label: string;
  type?: "text" | "status" | "currency" | "date" | "badge";
}

export interface CrudDetailPageProps {
  title: string;
  fields: DetailField[];
  data: Record<string, any>;
  backRoute: string;
  editRoute?: string;
  actions?: { label: string; icon?: React.ReactNode; onClick: () => void; variant?: "default" | "destructive" | "outline" }[];
}

export function CrudDetailPage({ title, fields, data, backRoute, editRoute, actions = [] }: CrudDetailPageProps) {
  const navigate = useNavigate();

  const renderValue = (field: DetailField, value: any) => {
    if (!value) return <span className="text-muted-foreground">—</span>;
    if (field.type === "status" || field.type === "badge") return <StatusBadge status={String(value)} />;
    if (field.type === "currency") return <span className="tabular-nums">R$ {Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>;
    if (field.type === "date") return <span className="tabular-nums">{value}</span>;
    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(backRoute)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {actions.map((action, i) => (
            <Button key={i} variant={action.variant || "outline"} size="sm" className="gap-2" onClick={action.onClick}>
              {action.icon}
              {action.label}
            </Button>
          ))}
          {editRoute && (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(editRoute)}>
              <Pencil className="h-3.5 w-3.5" /> Editar
            </Button>
          )}
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded-xl bg-card shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{field.label}</p>
              <p className="text-sm text-foreground font-medium">{renderValue(field, data[field.key])}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
