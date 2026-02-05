import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, LogIn } from "lucide-react";
import { LoginDialog } from "./LoginDialog";

export function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo y nombre del proyecto */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">SACTEL</h1>
              <p className="text-xs text-muted-foreground">Sistema Contable</p>
            </div>
          </div>

          {/* Botón de ingreso */}
          <Button onClick={() => setShowLogin(true)} className="gap-2">
            <LogIn className="h-4 w-4" />
            Ingresar
          </Button>
        </div>
      </header>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
}
