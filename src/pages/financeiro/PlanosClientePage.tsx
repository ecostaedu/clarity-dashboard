import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const initial = [
  { id: "PL001", name: "Básico", repasse: true, repasse_evento: false, transporte: true, recesso: false, cobranca: "Mensal", inicio_cobranca: "Imediato", active: true },
  { id: "PL002", name: "Premium", repasse: true, repasse_evento: true, transporte: true, recesso: true, cobranca: "Mensal", inicio_cobranca: "Próximo Mês", active: true },
];

const badge = (v: boolean) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>{v ? "Sim" : "Não"}</span>;

export default function PlanosClientePage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ id: "", name: "", repasse: false, repasse_evento: false, transporte: false, recesso: false, cobranca: "Mensal", inicio_cobranca: "Imediato", active: true });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nome", sortable: true },
    { key: "repasse", label: "Repasse", render: badge },
    { key: "transporte", label: "Transporte", render: badge },
    { key: "cobranca", label: "Cobrança" },
    { key: "active", label: "Ativo", render: badge },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ id: r.id, name: r.name, repasse: r.repasse, repasse_evento: r.repasse_evento, transporte: r.transporte, recesso: r.recesso, cobranca: r.cobranca, inicio_cobranca: r.inicio_cobranca, active: r.active }); setModal(true); } },
    { label: "Exportar PDF", onClick: () => toast.success("PDF exportado com sucesso!") },
    { label: "Baixar Nomenclaturas", onClick: () => toast.success("CSV baixado com sucesso!") },
  ];

  const handleSave = () => {
    if (!form.name) { toast.error("Preencha o nome."); return; }
    if (editing) {
      setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d));
      toast.success("Plano atualizado!");
    } else {
      setData([...data, { ...form, id: `PL${String(data.length + 1).padStart(3, "0")}` }]);
      toast.success("Plano criado!");
    }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Planos p/ Cliente" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Planos p/ Cliente</h1><p className="text-sm text-muted-foreground">{data.length} planos.</p></div>
          <button onClick={() => { setEditing(null); setForm({ id: "", name: "", repasse: false, repasse_evento: false, transporte: false, recesso: false, cobranca: "Mensal", inicio_cobranca: "Imediato", active: true }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Plano</button>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Plano" : "Novo Plano"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2"><Switch checked={form.repasse} onCheckedChange={v => setForm({ ...form, repasse: v })} /><Label>Repasse</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.repasse_evento} onCheckedChange={v => setForm({ ...form, repasse_evento: v })} /><Label>Repasse Evento</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.transporte} onCheckedChange={v => setForm({ ...form, transporte: v })} /><Label>Transporte</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.recesso} onCheckedChange={v => setForm({ ...form, recesso: v })} /><Label>Recesso</Label></div>
          </div>
          <div><Label>Cobrança</Label><Select value={form.cobranca} onValueChange={v => setForm({ ...form, cobranca: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Mensal">Mensal</SelectItem><SelectItem value="Quinzenal">Quinzenal</SelectItem><SelectItem value="Semanal">Semanal</SelectItem></SelectContent></Select></div>
          <div><Label>Início Cobrança</Label><Select value={form.inicio_cobranca} onValueChange={v => setForm({ ...form, inicio_cobranca: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Imediato">Imediato</SelectItem><SelectItem value="Próximo Mês">Próximo Mês</SelectItem></SelectContent></Select></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
