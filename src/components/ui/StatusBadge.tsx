import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  ativo: "bg-success/10 text-success",
  active: "bg-success/10 text-success",
  aberto: "bg-success/10 text-success",
  open: "bg-success/10 text-success",
  pago: "bg-success/10 text-success",
  paid: "bg-success/10 text-success",
  resolved: "bg-success/10 text-success",
  resolvido: "bg-success/10 text-success",
  closed: "bg-success/10 text-success",
  fechado: "bg-success/10 text-success",
  concluído: "bg-info/10 text-info",
  completed: "bg-info/10 text-info",
  assinado: "bg-info/10 text-info",
  signed: "bg-info/10 text-info",
  pendente: "bg-warning/10 text-warning",
  pending: "bg-warning/10 text-warning",
  em_andamento: "bg-warning/10 text-warning",
  in_progress: "bg-warning/10 text-warning",
  negociação: "bg-warning/10 text-warning",
  proposta: "bg-warning/10 text-warning",
  lead: "bg-info/10 text-info",
  cancelado: "bg-destructive/10 text-destructive",
  canceled: "bg-destructive/10 text-destructive",
  inativo: "bg-muted text-muted-foreground",
  inactive: "bg-muted text-muted-foreground",
  bloqueado: "bg-destructive/10 text-destructive",
  blocked: "bg-destructive/10 text-destructive",
  arquivado: "bg-muted text-muted-foreground",
  archived: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  const style = statusStyles[key] || "bg-secondary text-secondary-foreground";

  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium capitalize", style, className)}>
      {status}
    </span>
  );
}
