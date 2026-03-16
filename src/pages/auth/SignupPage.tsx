import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* -------- Masks -------- */
function maskCnpj(v: string) {
  return v.replace(/\D/g, "").slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
function maskCpf(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
function maskCep(v: string) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

/* -------- Schemas -------- */
const companySchema = z.object({
  razaoSocial: z.string().min(1, "Razão Social obrigatória"),
  cnpj: z.string().refine((v) => v.replace(/\D/g, "").length === 14, "CNPJ deve ter 14 dígitos"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mín. 8 caracteres")
    .regex(/[A-Z]/, "Deve ter letra maiúscula")
    .regex(/[a-z]/, "Deve ter letra minúscula")
    .regex(/[0-9]/, "Deve ter número")
    .regex(/[^A-Za-z0-9]/, "Deve ter caractere especial"),
  confirmPassword: z.string(),
  contactName: z.string().min(1, "Nome do contato obrigatório"),
  phone: z.string().optional(),
  terms: z.literal(true, { errorMap: () => ({ message: "Aceite os termos" }) }),
}).refine((d) => d.password === d.confirmPassword, { message: "Senhas não coincidem", path: ["confirmPassword"] });

const studentSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  cpf: z.string().refine((v) => v.replace(/\D/g, "").length === 11, "CPF deve ter 11 dígitos"),
  birthDate: z.string().min(1, "Data obrigatória"),
  gender: z.string().min(1, "Selecione o gênero"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  escolaridade: z.string().min(1, "Selecione a escolaridade"),
  curso: z.string().optional(),
  instituicao: z.string().optional(),
  password: z.string().min(8, "Mín. 8 caracteres")
    .regex(/[A-Z]/, "Deve ter letra maiúscula")
    .regex(/[a-z]/, "Deve ter letra minúscula")
    .regex(/[0-9]/, "Deve ter número")
    .regex(/[^A-Za-z0-9]/, "Deve ter caractere especial"),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: "Aceite os termos" }) }),
}).refine((d) => d.password === d.confirmPassword, { message: "Senhas não coincidem", path: ["confirmPassword"] });

type CompanyForm = z.infer<typeof companySchema>;
type StudentForm = z.infer<typeof studentSchema>;

const escolaridades = [
  "Ensino Médio",
  "Técnico",
  "Superior Incompleto",
  "Superior Completo",
  "Pós-Graduação",
];

export default function SignupPage() {
  const [tab, setTab] = useState<"company" | "student">("company");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-center space-y-6">
          <div className="h-20 w-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-heading font-bold text-2xl">LR</span>
          </div>
          <h1 className="text-4xl font-heading font-bold text-primary-foreground">LideraRH</h1>
          <p className="text-primary-foreground/70 max-w-sm text-lg">
            Crie sua conta e comece a gerenciar seus processos de RH.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">Criar Conta</h2>
            <p className="text-sm text-muted-foreground mt-1">Selecione o tipo de conta</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setTab("company")}
              className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                tab === "company" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Sou Empresa
            </button>
            <button
              onClick={() => setTab("student")}
              className={cn("flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                tab === "student" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Sou Estudante
            </button>
          </div>

          {tab === "company" ? (
            <CompanySignup signUp={signUp} navigate={navigate} />
          ) : (
            <StudentSignup signUp={signUp} navigate={navigate} />
          )}

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==================== Company Form ==================== */
function CompanySignup({ signUp, navigate }: { signUp: any; navigate: any }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: { terms: false as any },
  });

  const onSubmit = async (data: CompanyForm) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.contactName);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Erro ao criar conta.");
    } else {
      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Razão Social" error={errors.razaoSocial?.message}>
        <Input {...register("razaoSocial")} placeholder="Empresa LTDA" />
      </Field>
      <Field label="CNPJ" error={errors.cnpj?.message}>
        <Input
          value={watch("cnpj") || ""}
          onChange={(e) => setValue("cnpj", maskCnpj(e.target.value), { shouldValidate: true })}
          placeholder="XX.XXX.XXX/XXXX-XX"
        />
      </Field>
      <Field label="E-mail Corporativo" error={errors.email?.message}>
        <Input type="email" {...register("email")} placeholder="contato@empresa.com" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Senha" error={errors.password?.message}>
          <Input type="password" {...register("password")} placeholder="Mín. 8 caracteres" />
        </Field>
        <Field label="Confirmar Senha" error={errors.confirmPassword?.message}>
          <Input type="password" {...register("confirmPassword")} placeholder="Repetir senha" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome do Contato" error={errors.contactName?.message}>
          <Input {...register("contactName")} placeholder="João Silva" />
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <Input
            value={watch("phone") || ""}
            onChange={(e) => setValue("phone", maskPhone(e.target.value))}
            placeholder="(XX) XXXXX-XXXX"
          />
        </Field>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox
          id="terms-company"
          checked={watch("terms") === true}
          onCheckedChange={(c) => setValue("terms", c === true ? true : false as any, { shouldValidate: true })}
        />
        <Label htmlFor="terms-company" className="text-sm font-normal leading-tight cursor-pointer">
          Aceito os <span className="text-primary underline">Termos de Serviço</span> e a <span className="text-primary underline">Política de Privacidade</span>
        </Label>
      </div>
      {errors.terms && <p className="text-sm text-destructive">{errors.terms.message}</p>}
      <Button type="submit" className="w-full shadow-btn" disabled={loading}>
        {loading ? "Criando..." : "Criar Conta"}
      </Button>
    </form>
  );
}

/* ==================== Student Form ==================== */
function StudentSignup({ signUp, navigate }: { signUp: any; navigate: any }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: { terms: false as any },
  });

  const escolaridade = watch("escolaridade");
  const needsCourseInfo = escolaridade === "Técnico" || escolaridade === "Superior Incompleto" || escolaridade === "Superior Completo";

  const fetchCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue("logradouro", data.logradouro || "");
          setValue("bairro", data.bairro || "");
          setValue("cidade", data.localidade || "");
          setValue("estado", data.uf || "");
        }
      } catch {}
    }
  };

  const onSubmit = async (data: StudentForm) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.name);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Erro ao criar conta.");
    } else {
      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Nome Completo" error={errors.name?.message}>
        <Input {...register("name")} placeholder="Maria da Silva" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CPF" error={errors.cpf?.message}>
          <Input
            value={watch("cpf") || ""}
            onChange={(e) => setValue("cpf", maskCpf(e.target.value), { shouldValidate: true })}
            placeholder="XXX.XXX.XXX-XX"
          />
        </Field>
        <Field label="Data de Nascimento" error={errors.birthDate?.message}>
          <Input type="date" {...register("birthDate")} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Gênero" error={errors.gender?.message}>
          <Select onValueChange={(v) => setValue("gender", v, { shouldValidate: true })} value={watch("gender") || ""}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <Input
            value={watch("phone") || ""}
            onChange={(e) => setValue("phone", maskPhone(e.target.value))}
            placeholder="(XX) XXXXX-XXXX"
          />
        </Field>
      </div>
      <Field label="E-mail" error={errors.email?.message}>
        <Input type="email" {...register("email")} placeholder="seu@email.com" />
      </Field>

      {/* Address */}
      <div className="grid grid-cols-3 gap-4">
        <Field label="CEP" error={errors.cep?.message}>
          <Input
            value={watch("cep") || ""}
            onChange={(e) => {
              const masked = maskCep(e.target.value);
              setValue("cep", masked);
              fetchCep(masked);
            }}
            placeholder="XXXXX-XXX"
          />
        </Field>
        <Field label="Logradouro" error={errors.logradouro?.message} className="col-span-2">
          <Input {...register("logradouro")} placeholder="Rua..." />
        </Field>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Field label="Número">
          <Input {...register("numero")} placeholder="Nº" />
        </Field>
        <Field label="Complemento">
          <Input {...register("complemento")} placeholder="Apto..." />
        </Field>
        <Field label="Bairro">
          <Input {...register("bairro")} />
        </Field>
        <Field label="Cidade">
          <Input {...register("cidade")} />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Estado">
          <Input {...register("estado")} maxLength={2} />
        </Field>
        <Field label="Escolaridade" error={errors.escolaridade?.message} className="col-span-2">
          <Select onValueChange={(v) => setValue("escolaridade", v, { shouldValidate: true })} value={watch("escolaridade") || ""}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {escolaridades.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
      {needsCourseInfo && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Curso" error={errors.curso?.message}>
            <Input {...register("curso")} placeholder="Administração" />
          </Field>
          <Field label="Instituição de Ensino" error={errors.instituicao?.message}>
            <Input {...register("instituicao")} placeholder="Universidade..." />
          </Field>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Senha" error={errors.password?.message}>
          <Input type="password" {...register("password")} placeholder="Mín. 8 caracteres" />
        </Field>
        <Field label="Confirmar Senha" error={errors.confirmPassword?.message}>
          <Input type="password" {...register("confirmPassword")} placeholder="Repetir senha" />
        </Field>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms-student"
          checked={watch("terms") === true}
          onCheckedChange={(c) => setValue("terms", c === true ? true : false as any, { shouldValidate: true })}
        />
        <Label htmlFor="terms-student" className="text-sm font-normal leading-tight cursor-pointer">
          Aceito os <span className="text-primary underline">Termos de Serviço</span> e a <span className="text-primary underline">Política de Privacidade</span>
        </Label>
      </div>
      {errors.terms && <p className="text-sm text-destructive">{errors.terms.message}</p>}

      <Button type="submit" className="w-full shadow-btn" disabled={loading}>
        {loading ? "Criando..." : "Criar Conta"}
      </Button>
    </form>
  );
}

/* ==================== Field Helper ==================== */
function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
