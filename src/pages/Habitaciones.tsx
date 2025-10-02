import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, Habitacion } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { DoorOpen, DoorClosed, Wrench, Sparkles } from "lucide-react";

export default function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHabitaciones();
  }, []);

  const loadHabitaciones = async () => {
    setLoading(true);
    const response = await api.getHabitaciones();
    
    if (response.success && response.data) {
      setHabitaciones(response.data);
    } else {
      toast({
        title: "Error",
        description: "No se pudieron cargar las habitaciones",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      disponible: "bg-success text-success-foreground",
      ocupada: "bg-destructive text-destructive-foreground",
      mantenimiento: "bg-warning text-warning-foreground",
      limpieza: "bg-primary text-primary-foreground",
    };
    return colors[estado as keyof typeof colors] || "bg-muted";
  };

  const getEstadoIcon = (estado: string) => {
    const icons = {
      disponible: DoorOpen,
      ocupada: DoorClosed,
      mantenimiento: Wrench,
      limpieza: Sparkles,
    };
    const Icon = icons[estado as keyof typeof icons] || DoorOpen;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Habitaciones</h1>
          <p className="text-muted-foreground mt-1">
            Control de disponibilidad y estados
          </p>
        </div>
        <Button>Nueva Reserva</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-6 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          habitaciones.map((hab) => (
            <Card 
              key={hab.id} 
              className="hover:shadow-lg transition-all cursor-pointer border-2"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Hab. {hab.numero}</span>
                  <Badge className={getEstadoColor(hab.estado)}>
                    <span className="flex items-center gap-1">
                      {getEstadoIcon(hab.estado)}
                      {hab.estado}
                    </span>
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{hab.tipo}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio/Noche</span>
                  <span className="font-bold text-lg">${hab.precio.toLocaleString()}</span>
                </div>
                {hab.huesped && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Huésped</p>
                    <p className="font-medium">{hab.huesped}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
