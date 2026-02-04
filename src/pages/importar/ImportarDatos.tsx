import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Users, Building, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ImportPUC } from "@/components/importar/ImportPUC";
import { ImportTerceros } from "@/components/importar/ImportTerceros";
import { ImportCentrosCosto } from "@/components/importar/ImportCentrosCosto";
import { ImportSaldosIniciales } from "@/components/importar/ImportSaldosIniciales";

export default function ImportarDatos() {
  const { hasRole } = useAuth();
  const canImport = hasRole(["admin", "contador"]);

  if (!canImport) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground">
              No tiene permisos para acceder a esta sección. 
              Solo administradores y contadores pueden importar datos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Importar Datos</h1>
        <p className="text-muted-foreground mt-1">
          Importe información desde archivos Excel o CSV
        </p>
      </div>

      <Tabs defaultValue="puc" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="puc" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            PUC
          </TabsTrigger>
          <TabsTrigger value="terceros" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Terceros
          </TabsTrigger>
          <TabsTrigger value="centros" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Centros de Costo
          </TabsTrigger>
          <TabsTrigger value="saldos" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Saldos Iniciales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="puc">
          <ImportPUC />
        </TabsContent>

        <TabsContent value="terceros">
          <ImportTerceros />
        </TabsContent>

        <TabsContent value="centros">
          <ImportCentrosCosto />
        </TabsContent>

        <TabsContent value="saldos">
          <ImportSaldosIniciales />
        </TabsContent>
      </Tabs>
    </div>
  );
}
