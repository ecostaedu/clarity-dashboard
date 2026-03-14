import { X, Tag, Clock, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContextPanelProps {
  open: boolean;
  onClose: () => void;
  selectedItem?: {
    name: string;
    type: string;
    status: string;
    owner: string;
    lastUpdate: string;
    tags: string[];
  } | null;
}

const activityLog = [
  { user: "Ana Maria", action: "atualizou o status", time: "2m atrás" },
  { user: "Carlos Silva", action: "adicionou comentário", time: "15m atrás" },
  { user: "Maria Costa", action: "criou o documento", time: "1h atrás" },
  { user: "João Santos", action: "compartilhou com equipe", time: "3h atrás" },
];

export function ContextPanel({ open, onClose, selectedItem }: ContextPanelProps) {
  if (!open || !selectedItem) return null;

  return (
    <aside className={cn(
      "w-80 border-l border-border bg-card h-full overflow-y-auto animate-slide-in-right shrink-0"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground tracking-tight">Detalhes</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{selectedItem.name}</p>
            <p className="text-xs text-muted-foreground">{selectedItem.type}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className={cn(
            "px-2 py-0.5 rounded text-xs font-medium",
            selectedItem.status === "Ativo" && "bg-success/10 text-success",
            selectedItem.status === "Pendente" && "bg-warning/10 text-warning",
            selectedItem.status === "Concluído" && "bg-info/10 text-info",
          )}>{selectedItem.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Responsável</span>
          <span className="text-foreground font-medium">{selectedItem.owner}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Atualizado</span>
          <span className="text-foreground">{selectedItem.lastUpdate}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Tags</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedItem.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Atividade</span>
        </div>
        <div className="space-y-4">
          {activityLog.map((entry, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">{entry.user}</span>{" "}
                  <span className="text-muted-foreground">{entry.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
