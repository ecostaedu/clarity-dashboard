import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type Lead = { id: string; cliente: string; contato: string; ultimo_contato: string; proximo_contato: string; status: string; oportunidade: number };

const initial: Lead[] = [
  { id: "1", cliente: "Nova Corp", contato: "contato@novacorp.com", ultimo_contato: "15/03/2024", proximo_contato: "25/03/2024", status: "Novo Lead", oportunidade: 15000 },
  { id: "2", cliente: "Tech Startup", contato: "hello@techstartup.io", ultimo_contato: "10/03/2024", proximo_contato: "20/03/2024", status: "Em Contato", oportunidade: 45000 },
  { id: "3", cliente: "Mega Corp", contato: "rh@megacorp.com", ultimo_contato: "05/03/2024", proximo_contato: "15/03/2024", status: "Proposta Enviada", oportunidade: 120000 },
  { id: "4", cliente: "Global Inc", contato: "info@global.com", ultimo_contato: "01/03/2024", proximo_contato: "10/03/2024", status: "Cliente Ativo", oportunidade: 89000 },
  { id: "5", cliente: "Smart Sol", contato: "smart@sol.com", ultimo_contato: "20/02/2024", proximo_contato: "01/03/2024", status: "Perdido", oportunidade: 32000 },
  { id: "6", cliente: "Inova Tec", contato: "inova@tec.com", ultimo_contato: "18/03/2024", proximo_contato: "28/03/2024", status: "Novo Lead", oportunidade: 67000 },
];

const stages = ["Novo Lead", "Em Contato", "Proposta Enviada", "Cliente Ativo", "Perdido"];

const statusColors: Record<string, string> = {
  "Novo Lead": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Em Contato": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Proposta Enviada": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Cliente Ativo": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Perdido": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function CrmPage() {
  const [data, setData] = useState(initial);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [contactModal, setContactModal] = useState<Lead | null>(null);
  const [oppModal, setOppModal] = useState<Lead | null>(null);
  const [detailPanel, setDetailPanel] = useState<Lead | null>(null);
  const [contactForm, setContactForm] = useState({ data: "", tipo: "", obs: "" });
  const [oppForm, setOppForm] = useState({ desc: "", valor: 0 });

  const columns: Column[] = [
    { key: "cliente", label: "Cliente", sortable: true },
    { key: "contato", label: "Contato" },
    { key: "ultimo_contato", label: "Último Contato" },
    { key: "proximo_contato", label: "Próximo Contato" },
    { key: "status", label: "Status", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[v] || "bg-muted text-muted-foreground"}`}>{v}</span> },
    { key: "oportunidade", label: "Oportunidade", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
  ];

  const filters: FilterConfig[] = [
    { key: "cliente", label: "Cliente", type: "text" },
    { key: "status", label: "Status", type: "select", options: stages.map(s => ({ label: s, value: s })) },
  ];

  const actions: ActionConfig[] = [
    { label: "Detalhes", onClick: (r) => setDetailPanel(r as Lead) },
    { label: "Registrar Contato", onClick: (r) => { setContactModal(r as Lead); setContactForm({ data: "", tipo: "", obs: "" }); } },
    { label: "Criar Oportunidade", onClick: (r) => { setOppModal(r as Lead); setOppForm({ desc: "", valor: 0 }); } },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Outros" }, { label: "CRM" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">CRM</h1><p className="text-sm text-muted-foreground">{data.length} leads. Total: R$ {data.reduce((s, d) => s + d.oportunidade, 0).toLocaleString("pt-BR")}</p></div>
          <div className="flex gap-2">
            <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}><List className="h-4 w-4 mr-1" />Tabela</Button>
            <Button variant={view === "kanban" ? "default" : "outline"} size="sm" onClick={() => setView("kanban")}><LayoutGrid className="h-4 w-4 mr-1" />Kanban</Button>
          </div>
        </div>

        {view === "table" ? (
          <DataTable columns={columns} data={data} filters={filters} actions={actions} />
        ) : (
          <div className="grid grid-cols-5 gap-3 overflow-x-auto">
            {stages.map(stage => (
              <div key={stage} className="min-w-[200px]">
                <div className={`px-3 py-2 rounded-t-lg text-xs font-semibold ${statusColors[stage]}`}>{stage} ({data.filter(d => d.status === stage).length})</div>
                <div className="bg-muted/20 rounded-b-lg p-2 space-y-2 min-h-[200px]">
                  {data.filter(d => d.status === stage).map(lead => (
                    <div key={lead.id} onClick={() => setDetailPanel(lead)} className="p-3 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border/50">
                      <p className="text-sm font-semibold text-foreground">{lead.cliente}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lead.contato}</p>
                      <p className="text-xs font-medium text-primary mt-2">R$ {lead.oportunidade.toLocaleString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <Dialog open={!!detailPanel} onOpenChange={() => setDetailPanel(null)}>
        <DialogContent><DialogHeader><DialogTitle>{detailPanel?.cliente}</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <p><strong>Contato:</strong> {detailPanel?.contato}</p>
            <p><strong>Status:</strong> {detailPanel?.status}</p>
            <p><strong>Oportunidade:</strong> R$ {detailPanel?.oportunidade.toLocaleString("pt-BR")}</p>
            <p><strong>Último contato:</strong> {detailPanel?.ultimo_contato}</p>
            <p><strong>Próximo contato:</strong> {detailPanel?.proximo_contato}</p>
            <div className="pt-3 border-t border-border">
              <p className="font-semibold mb-2">Histórico de Contatos</p>
              <div className="space-y-2">
                <div className="p-2 rounded bg-muted/30"><span className="text-xs text-muted-foreground">15/03/2024</span> — Reunião de apresentação</div>
                <div className="p-2 rounded bg-muted/30"><span className="text-xs text-muted-foreground">10/03/2024</span> — Email de follow-up</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <FormModal open={!!contactModal} onClose={() => setContactModal(null)} title="Registrar Contato" onSave={() => { toast.success("Contato registrado!"); setContactModal(null); }}>
        <div className="space-y-4">
          <div><Label>Data</Label><Input type="date" value={contactForm.data} onChange={e => setContactForm({ ...contactForm, data: e.target.value })} /></div>
          <div><Label>Tipo</Label><Select value={contactForm.tipo} onValueChange={v => setContactForm({ ...contactForm, tipo: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="Telefone">Telefone</SelectItem><SelectItem value="Email">Email</SelectItem><SelectItem value="Reunião">Reunião</SelectItem><SelectItem value="Visita">Visita</SelectItem></SelectContent></Select></div>
          <div><Label>Observações</Label><Textarea value={contactForm.obs} onChange={e => setContactForm({ ...contactForm, obs: e.target.value })} /></div>
        </div>
      </FormModal>

      {/* Opportunity Modal */}
      <FormModal open={!!oppModal} onClose={() => setOppModal(null)} title="Criar Oportunidade" onSave={() => {
        if (oppModal) setData(data.map(d => d.id === oppModal.id ? { ...d, oportunidade: d.oportunidade + oppForm.valor } : d));
        toast.success("Oportunidade criada!"); setOppModal(null);
      }}>
        <div className="space-y-4">
          <div><Label>Descrição</Label><Input value={oppForm.desc} onChange={e => setOppForm({ ...oppForm, desc: e.target.value })} /></div>
          <div><Label>Valor Estimado (R$)</Label><Input type="number" value={oppForm.valor} onChange={e => setOppForm({ ...oppForm, valor: Number(e.target.value) })} /></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
