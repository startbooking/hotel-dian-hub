import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Mail, Phone, Calendar } from "lucide-react";

interface Empleado {
  id: string;
  nombre: string;
  cedula: string;
  cargo: string;
  departamento: string;
  salario: number;
  fechaIngreso: string;
  estado: "activo" | "inactivo" | "vacaciones";
  email: string;
  telefono: string;
}

const empleadosData: Empleado[] = [
  {
    id: "1",
    nombre: "María González",
    cedula: "1234567890",
    cargo: "Recepcionista",
    departamento: "Recepción",
    salario: 1500000,
    fechaIngreso: "2023-01-15",
    estado: "activo",
    email: "maria@hotel.com",
    telefono: "3001234567"
  },
  {
    id: "2",
    nombre: "Carlos Pérez",
    cedula: "9876543210",
    cargo: "Chef",
    departamento: "Cocina",
    salario: 2500000,
    fechaIngreso: "2022-06-20",
    estado: "activo",
    email: "carlos@hotel.com",
    telefono: "3009876543"
  },
  {
    id: "3",
    nombre: "Ana Martínez",
    cedula: "5555555555",
    cargo: "Camarera",
    departamento: "Limpieza",
    salario: 1200000,
    fechaIngreso: "2023-03-10",
    estado: "vacaciones",
    email: "ana@hotel.com",
    telefono: "3005555555"
  }
];

export default function Empleados() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmpleados = empleadosData.filter(emp =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cedula.includes(searchTerm) ||
    emp.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      activo: { variant: "default", label: "Activo" },
      inactivo: { variant: "secondary", label: "Inactivo" },
      vacaciones: { variant: "outline", label: "Vacaciones" }
    };
    return variants[estado] || variants.activo;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Empleados</h1>
          <p className="text-muted-foreground mt-1">Gestión de personal del hotel</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cédula o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmpleados.map((empleado) => {
              const estadoBadge = getEstadoBadge(empleado.estado);
              return (
                <Card key={empleado.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {empleado.nombre.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{empleado.nombre}</h3>
                            <p className="text-sm text-muted-foreground">CC: {empleado.cedula}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Cargo</p>
                            <p className="font-medium text-foreground">{empleado.cargo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Departamento</p>
                            <p className="font-medium text-foreground">{empleado.departamento}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Salario</p>
                            <p className="font-medium text-foreground">
                              ${empleado.salario.toLocaleString('es-CO')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-foreground">{empleado.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-foreground">{empleado.telefono}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-foreground">{empleado.fechaIngreso}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={estadoBadge.variant}>
                          {estadoBadge.label}
                        </Badge>
                        <Button variant="outline" size="sm">Ver Detalles</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredEmpleados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron empleados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
