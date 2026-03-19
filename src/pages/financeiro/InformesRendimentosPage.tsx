import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initial = [
  { id: "1", ano: "2023", funcionario: "João Silva", data_geracao: "15/02/2024" },
  { id: "2", ano: "2023", funcionario: "Maria Santos", data_geracao: "15/02/2024" },
];

export default function InformesRendimentosPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ano: "", funcionarios: "" });
  const [processing, setProcessing] = useState(false);

  const columns: Column[] = [
    { key: "ano", label: "Ano Base", sortable: true },
    { key: "funcionario", label: "Funcionário", sortable: true },
    { key: "data_geracao", label: "Data de Geração" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", onClick: () => toast.success("PDF gerado!") },
    { label: "Enviar por Email", onClick: () => toast.success("Email enviado!") },
  ];

  const handleProcess = () => {
    if (!form.ano) { toast.error("Informe o ano base."); return; }
    setProcessing(true);
    setTimeout(() => {
      const names = ["João Silva", "Maria Santos", "Pedro Lima"];
      const newItems = names.map(n => ({ id: String(Date.now() + Math.random()), ano: form.ano, funcionario: n, data_geracao: new Date().toLocaleDateString("pt-BR") }));
      setData([...newItems, ...data]);
      toast.success("Informes processados!"); setProcessing(false); setModal(false);
    }, 1500);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Informes de Rendimentos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Informes de Rendimentos</h1><p className="text-sm text-muted-foreground">{data.length} informes.</p></div>
          <button onClick={() => { setForm({ ano: "", funcionarios: "" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Gerar Informes</button>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => setModal(false)} title="Gerar Informes" onSave={handleProcess} saving={processing}>
        <div className="space-y-4">
          <div><Label>Ano Base *</Label><Input placeholder="2023" value={form.ano} onChange={e => setForm({ ...form, ano: e.target.value })} /></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
