import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Calculator, FileDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface LiquidacionItem {
  empleado: string;
  cargo: string;
  salarioBase: number;
  diasTrabajados: number;
  horasExtras: number;
  deducciones: number;
  totalPagar: number;
}

const liquidacionData: LiquidacionItem[] = [
  {
    empleado: "María González",
    cargo: "Recepcionista",
    salarioBase: 1500000,
    diasTrabajados: 30,
    horasExtras: 20000,
    deducciones: 180000,
    totalPagar: 1340000
  },
  {
    empleado: "Carlos Pérez",
    cargo: "Chef",
    salarioBase: 2500000,
    diasTrabajados: 30,
    horasExtras: 50000,
    deducciones: 300000,
    totalPagar: 2250000
  },
  {
    empleado: "Ana Martínez",
    cargo: "Camarera",
    salarioBase: 1200000,
    diasTrabajados: 30,
    horasExtras: 15000,
    deducciones: 144000,
    totalPagar: 1071000
  }
];

export default function LiquidarNomina() {
  const [mes, setMes] = useState<string>("");
  const [fechaPago, setFechaPago] = useState<Date>();
  
  const totalNomina = liquidacionData.reduce((sum, item) => sum + item.totalPagar, 0);
  const totalDeducciones = liquidacionData.reduce((sum, item) => sum + item.deducciones, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Liquidar Nómina</h1>
          <p className="text-muted-foreground mt-1">Cálculo y procesamiento de nómina mensual</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Nómina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${totalNomina.toLocaleString('es-CO')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deducciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalDeducciones.toLocaleString('es-CO')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {liquidacionData.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurar Liquidación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">Enero 2025</SelectItem>
                  <SelectItem value="02">Febrero 2025</SelectItem>
                  <SelectItem value="03">Marzo 2025</SelectItem>
                  <SelectItem value="04">Abril 2025</SelectItem>
                  <SelectItem value="05">Mayo 2025</SelectItem>
                  <SelectItem value="06">Junio 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Pago</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaPago ? format(fechaPago, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaPago}
                    onSelect={setFechaPago}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detalle de Liquidación</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown className="h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" className="gap-2">
                <Calculator className="h-4 w-4" />
                Procesar Nómina
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liquidacionData.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{item.empleado}</h3>
                        <p className="text-sm text-muted-foreground">{item.cargo}</p>
                      </div>
                      <Badge variant="outline">
                        ${item.totalPagar.toLocaleString('es-CO')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Salario Base</p>
                        <p className="font-medium text-foreground">
                          ${item.salarioBase.toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Días Trabajados</p>
                        <p className="font-medium text-foreground">{item.diasTrabajados}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Horas Extras</p>
                        <p className="font-medium text-success">
                          +${item.horasExtras.toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deducciones</p>
                        <p className="font-medium text-destructive">
                          -${item.deducciones.toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total a Pagar</p>
                        <p className="font-bold text-foreground">
                          ${item.totalPagar.toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
