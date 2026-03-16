import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function detectInputType(value: string): "email" | "cpf" | "cnpj" | "unknown" {
  const digits = value.replace(/\D/g, "");
  if (value.includes("@")) return "email";
  if (digits.length === 11) return "cpf";
  if (digits.length === 14) return "cnpj";
  return "unknown";
}

function maskCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleIdentifierChange = (val: string) => {
    if (val.includes("@") || val === "") {
      setIdentifier(val);
    } else {
      setIdentifier(maskCpfCnpj(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = detectInputType(identifier);
    if (type === "unknown" && identifier.length > 0) {
      toast.error("Informe um e-mail, CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }
    setLoading(true);
    // For auth we use email; CPF/CNPJ lookup would be done server-side
    const email = type === "email" ? identifier : identifier.replace(/\D/g, "") + "@cpfcnpj.local";
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error("Credenciais inválidas. Tente novamente.");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-center space-y-6">
          <div className="h-20 w-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-heading font-bold text-2xl">LR</span>
          </div>
          <h1 className="text-4xl font-heading font-bold text-primary-foreground">LideraRH</h1>
          <p className="text-primary-foreground/70 max-w-sm text-lg">
            Plataforma completa para gestão de estágios, jovem aprendiz e recrutamento.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">LR</span>
            </div>
            <span className="text-xl font-heading font-bold text-foreground">LideraRH</span>
          </div>

          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">Entrar</h2>
            <p className="text-sm text-muted-foreground mt-1">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">E-mail, CPF ou CNPJ</Label>
              <Input
                id="identifier"
                placeholder="seu@email.com ou CPF/CNPJ"
                value={identifier}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(c) => setRememberMe(!!c)}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Lembrar de mim</Label>
            </div>

            <Button type="submit" className="w-full shadow-btn" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
