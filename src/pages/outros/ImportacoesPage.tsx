import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const initial = [
  { id: "1", tipo: "Candidatos", arquivo: "candidatos_2024.csv", data: "15/03/2024", status: "Concluído", usuario: "Admin" },
  { id: "2", tipo: "Empresas", arquivo: "empresas_parceiras.xlsx", data: "10/03/2024", status: "Com Erros", usuario: "Admin" },
];

const statusBadge = (v: string) => {
  const c = v === "Concluído" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : v === "Com Erros" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

const mappingFields: Record<string, string[]> = {
  Candidatos: ["Nome", "CPF", "Email", "Telefone", "Data Nascimento", "Escolaridade"],
  Empresas: ["Razão Social", "CNPJ", "Email", "Telefone", "Endereço"],
  Contratos: ["Empresa", "Candidato", "Data Início", "Data Término", "Valor"],
};

export default function ImportacoesPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [tipo, setTipo] = useState("Candidatos");
  const [file, setFile] = useState<File | null>(null);
  const [showMapping, setShowMapping] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [detail, setDetail] = useState<any>(null);

  const columns: Column[] = [
    { key: "tipo", label: "Tipo" },
    { key: "arquivo", label: "Arquivo" },
    { key: "data", label: "Data" },
    { key: "status", label: "Status", render: statusBadge },
    { key: "usuario", label: "Usuário" },
  ];

  const filters: FilterConfig[] = [
    { key: "tipo", label: "Tipo", type: "select", options: [{ label: "Candidatos", value: "Candidatos" }, { label: "Empresas", value: "Empresas" }, { label: "Contratos", value: "Contratos" }] },
    { key: "status", label: "Status", type: "select", options: [{ label: "Concluído", value: "Concluído" }, { label: "Com Erros", value: "Com Erros" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar Detalhes", onClick: (r) => setDetail(r) },
    { label: "Baixar Erros", onClick: () => toast.success("CSV de erros baixado!") },
  ];

  const handleUpload = () => {
    if (!file) { toast.error("Selecione um arquivo."); return; }
    setShowMapping(true);
  };

  const handleImport = () => {
    setProcessing(true);
    setTimeout(() => {
      setData([{ id: String(Date.now()), tipo, arquivo: file?.name || "", data: new Date().toLocaleDateString("pt-BR"), status: "Concluído", usuario: "Admin" }, ...data]);
      toast.success("42 registros importados, 3 erros encontrados.");
      setProcessing(false); setShowMapping(false); setModal(false); setFile(null);
    }, 2000);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Outros" }, { label: "Importações" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Importações</h1><p className="text-sm text-muted-foreground">{data.length} importações.</p></div>
          <button onClick={() => { setFile(null); setShowMapping(false); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Nova Importação</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => setModal(false)} title="Nova Importação" onSave={showMapping ? handleImport : handleUpload} saving={processing} wide>
        {!showMapping ? (
          <div className="space-y-4">
            <div><Label>Tipo de Importação</Label><Select value={tipo} onValueChange={setTipo}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Candidatos">Candidatos</SelectItem><SelectItem value="Empresas">Empresas</SelectItem><SelectItem value="Contratos">Contratos</SelectItem></SelectContent></Select></div>
            <div><Label>Arquivo (CSV/XLSX)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <input type="file" accept=".csv,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
                {file && <p className="text-sm text-foreground mt-2">{file.name}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Mapeie as colunas do arquivo para os campos do sistema:</p>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/40"><th className="text-left px-3 py-2">Coluna do Arquivo</th><th className="text-left px-3 py-2">Campo do Sistema</th></tr></thead>
              <tbody>
                {(mappingFields[tipo] || []).map((field, i) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="px-3 py-2">Coluna {i + 1}</td>
                    <td className="px-3 py-2"><Select defaultValue={field}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent>{(mappingFields[tipo] || []).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormModal>
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent><DialogHeader><DialogTitle>Detalhes da Importação</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            <p><strong>Tipo:</strong> {detail?.tipo}</p>
            <p><strong>Arquivo:</strong> {detail?.arquivo}</p>
            <p><strong>Data:</strong> {detail?.data}</p>
            <p><strong>Status:</strong> {detail?.status}</p>
            <p><strong>Usuário:</strong> {detail?.usuario}</p>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
