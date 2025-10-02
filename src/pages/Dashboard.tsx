import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, TrendingUp, FileText, DollarSign } from "lucide-react";
import { api, DashboardStats } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const response = await api.getDashboardStats();
    
    if (response.success && response.data) {
      setStats(response.data);
    } else {
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const statCards = [
    {
      title: "Ocupación",
      value: stats ? `${stats.ocupacion}%` : "0%",
      icon: Hotel,
      gradient: "from-primary to-primary/80",
    },
    {
      title: "Habitaciones Disponibles",
      value: stats?.habitacionesDisponibles || 0,
      icon: Hotel,
      gradient: "from-success to-success/80",
    },
    {
      title: "Ingresos del Día",
      value: stats ? `$${stats.ingresosDia.toLocaleString()}` : "$0",
      icon: DollarSign,
      gradient: "from-accent to-accent/80",
    },
    {
      title: "Facturas Pendientes",
      value: stats?.facturasPendientes || 0,
      icon: FileText,
      gradient: "from-warning to-warning/80",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general del sistema de contabilidad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className={`bg-gradient-to-br ${card.gradient} pb-4`}>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="text-sm font-medium">{card.title}</span>
                <card.icon className="h-5 w-5 opacity-80" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                ) : (
                  card.value
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ingresos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">Hospedaje - Hab. 10{i}</p>
                    <p className="text-sm text-muted-foreground">Hace {i} hora(s)</p>
                  </div>
                  <span className="font-bold text-success">
                    +${(150000 + i * 50000).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Facturas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">Factura #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Cliente {i}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    Pagada
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
