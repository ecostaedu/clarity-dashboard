import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const allData = [
  { id: "1", nome: "João Pedro Silva", dataNascimento: "1998-05-15", email: "joao@email.com", telefone: "(11) 99999-1111", mes: 5 },
  { id: "2", nome: "Maria Oliveira", dataNascimento: "2000-08-22", email: "maria@email.com", telefone: "(21) 99999-2222", mes: 8 },
  { id: "3", nome: "Carlos Santos", dataNascimento: "2001-01-10", email: "carlos@email.com", telefone: "(41) 99999-3333", mes: 1 },
  { id: "4", nome: "Ana Souza", dataNascimento: "1999-03-28", email: "ana@email.com", telefone: "(11) 99999-4444", mes: 3 },
  { id: "5", nome: "Pedro Lima", dataNascimento: "2002-12-05", email: "pedro@email.com", telefone: "(21) 99999-5555", mes: 12 },
];

export default function AniversariantesPage() {
  const [mesFiltro, setMesFiltro] = useState<string>("__all__");
  const [msgOpen, setMsgOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [mensagem, setMensagem] = useState("");

  const data = mesFiltro === "__all__" ? allData : allData.filter((d) => d.mes === Number(mesFiltro));

  const columns: Column[] = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "dataNascimento", label: "Data de Nascimento", render: (v) => new Date(v + "T12:00:00").toLocaleDateString("pt-BR") },
    { key: "email", label: "Email" },
    { key: "telefone", label: "Telefone" },
  ];

  const actions: ActionConfig[] = [
    { label: "Enviar Mensagem", icon: <Mail className="h-4 w-4" />, onClick: (row) => { setSelected(row); setMensagem(`Parabéns pelo seu aniversário, ${row.nome}! 🎉`); setMsgOpen(true); } },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Aniversariantes" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Aniversariantes</h1>
          <p className="text-sm text-muted-foreground mt-1">Candidatos que fazem aniversário no mês selecionado.</p>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-sm">Filtrar por mês:</Label>
          <Select value={mesFiltro} onValueChange={setMesFiltro}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos</SelectItem>
              {meses.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>

      <FormModal open={msgOpen} onClose={() => setMsgOpen(false)} title={`Mensagem para ${selected?.nome}`} onSave={() => { toast.success("Mensagem enviada (simulado)!"); setMsgOpen(false); }}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Destinatário: {selected?.email}</p>
          <div className="space-y-1.5">
            <Label>Mensagem</Label>
            <Textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={4} />
          </div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
