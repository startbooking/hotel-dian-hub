import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const itemSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
});

type ItemForm = z.infer<typeof itemSchema>;

interface CatalogoItem extends ItemForm {
  id: string;
}

interface CatalogoCRUDProps {
  title: string;
  subtitle: string;
  initialData: CatalogoItem[];
}

export default function CatalogoCRUD({ title, subtitle, initialData }: CatalogoCRUDProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<CatalogoItem[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogoItem | null>(null);
  const { toast } = useToast();

  const form = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: { codigo: "", nombre: "", descripcion: "" },
  });

  const handleOpen = (item?: CatalogoItem) => {
    if (item) {
      setEditingItem(item);
      form.reset(item);
    } else {
      setEditingItem(null);
      form.reset({ codigo: "", nombre: "", descripcion: "" });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: ItemForm) => {
    if (editingItem) {
      setItems(items.map(i => (i.id === editingItem.id ? { ...i, ...data } : i)));
      toast({ title: "Actualizado", description: `${title} actualizado exitosamente` });
    } else {
      setItems([...items, { id: Date.now().toString(), ...data }]);
      toast({ title: "Creado", description: `${title} creado exitosamente` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast({ title: "Eliminado", description: `${title} eliminado exitosamente` });
  };

  const filtered = items.filter(i =>
    i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpen()}>
              <Plus className="h-4 w-4" /> Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? `Editar ${title}` : `Nuevo ${title}`}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="codigo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nombre" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="descripcion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">{editingItem ? "Actualizar" : "Crear"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{item.descripcion || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleOpen(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-12"><p className="text-muted-foreground">No se encontraron registros</p></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
