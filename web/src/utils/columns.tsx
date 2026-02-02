import type { Client, Columns } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

interface GetClienteColumnsProps {
  onEdit?: (cliente: Client) => void;
  onDelete?: () => void;
}

export const getClienteColumns = ({ onEdit, onDelete }: GetClienteColumnsProps = {}): Columns<Client>[] => [
    {
        header: "Nome",
        accessorKey: "nome",
        type: "normal",
    } ,
    {
        header: "Cpf",
        accessorKey: "cpf",
        type: "normal", 
    },
    {
        header: "Endereço",
        accessorKey: "endereco",
        type: "normal",
    },
    {
        accessorKey: "id",
        header: "Ações",
        type: "action",
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        className="rounded-full"
                        size="icon"
                        onClick={() => {
                            onEdit?.(row.original);
                        }}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        className="rounded-full"
                        size="icon"
                        onClick={async () => {
                            if (!window.confirm("Tem certeza que deseja deletar este cliente?")) {
                                return;
                            }
                            try {
                                await api.delete(`/clientes/${row.original.id}`);
                                toast.success("Cliente deletado com sucesso!");
                                onDelete?.();
                            } catch (error) {
                                toast.error("Erro ao deletar cliente");
                                console.error(error);
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];

export const clienteColumns: Columns<Client>[] = getClienteColumns();