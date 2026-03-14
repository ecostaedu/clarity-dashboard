import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select" | "date" | "toggle" | "currency" | "cpf" | "cnpj" | "file";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  span?: 1 | 2;
  mask?: "cpf" | "cnpj" | "phone" | "currency";
}

export interface CrudFormPageProps {
  title: string;
  fields: FieldDef[];
  initialData?: Record<string, any>;
  backRoute: string;
  onSubmit?: (data: Record<string, any>) => void;
  isEdit?: boolean;
}

function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, "");
  if (mask === "cpf") {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  }
  if (mask === "cnpj") {
    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
      .slice(0, 18);
  }
  if (mask === "phone") {
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2").slice(0, 14);
    }
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
  }
  if (mask === "currency") {
    const num = parseInt(digits || "0", 10) / 100;
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return value;
}

export function CrudFormPage({ title, fields, initialData = {}, backRoute, onSubmit, isEdit }: CrudFormPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: any, mask?: string) => {
    const processedValue = mask ? applyMask(String(value), mask) : value;
    setFormData((prev) => ({ ...prev, [key]: processedValue }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !formData[f.key]) {
        newErrors[f.key] = `${f.label} é obrigatório`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (onSubmit) onSubmit(formData);
    toast.success(isEdit ? "Registro atualizado com sucesso" : "Registro criado com sucesso");
    navigate(backRoute);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(backRoute)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-xl bg-card shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {fields.map((field) => (
            <div key={field.key} className={cn(field.span === 2 && "md:col-span-2", field.type === "textarea" && "md:col-span-2")}>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg bg-background border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 resize-none",
                    errors[field.key] ? "border-destructive" : "border-border"
                  )}
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={cn(
                    "h-10 w-full px-3 rounded-lg bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 appearance-none",
                    errors[field.key] ? "border-destructive" : "border-border",
                    !formData[field.key] && "text-muted-foreground"
                  )}
                >
                  <option value="">Selecione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === "toggle" ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors duration-150",
                      formData[field.key] ? "bg-primary" : "bg-border"
                    )}
                    onClick={() => handleChange(field.key, !formData[field.key])}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow-soft transition-transform duration-150",
                      formData[field.key] && "translate-x-5"
                    )} />
                  </div>
                  <span className="text-sm text-muted-foreground">{formData[field.key] ? "Ativo" : "Inativo"}</span>
                </label>
              ) : (
                <input
                  type={field.type === "cpf" || field.type === "cnpj" || field.type === "currency" ? "text" : (field.type || "text")}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value, field.mask)}
                  placeholder={field.placeholder}
                  className={cn(
                    "h-10 w-full px-3 rounded-lg bg-background border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150",
                    errors[field.key] ? "border-destructive" : "border-border"
                  )}
                />
              )}

              {errors[field.key] && (
                <p className="text-xs text-destructive mt-1">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={() => navigate(backRoute)}>
            Cancelar
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {isEdit ? "Salvar Alterações" : "Criar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
