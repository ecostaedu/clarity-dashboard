import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Erro ao enviar e-mail de recuperação.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center gap-3 justify-center">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">LR</span>
          </div>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-heading font-bold text-foreground">E-mail enviado!</h2>
            <p className="text-sm text-muted-foreground">Verifique sua caixa de entrada para redefinir sua senha.</p>
            <Link to="/login" className="text-primary text-sm hover:underline">Voltar ao login</Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Recuperar Senha</h2>
              <p className="text-sm text-muted-foreground mt-1">Informe seu e-mail para receber o link de recuperação.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full shadow-btn" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Voltar ao login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
