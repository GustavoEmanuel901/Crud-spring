import DataTable from '@/components/DataTable';
import DialogFormWrapper from '@/components/DialogFormWrapper';
import FormCliente from '@/components/FormCliente';
import FormClienteEdit from '@/components/FormClienteEdit';
import api from '@/services/api';
import { getClienteColumns } from '@/utils/columns';
import type { Client } from '@/types/types';
import { useEffect, useState, useRef } from 'react';

export default function Cliente() {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const formRef = useRef<{ submit: () => Promise<void> }>(null);
  const formEditRef = useRef<{ submit: () => Promise<void> }>(null);

  const clienteColumns = getClienteColumns({
    onEdit: (cliente) => {
      setSelectedCliente(cliente);
      setIsEditDialogOpen(true);
    },
    onDelete: () => {
      fetchClientes();
    },
  });

  const fetchClientes = async () => {
    try {
      setIsLoadingClientes(true);
      const response = await api.get('/clientes');
      const data = response.data;
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
    } finally {
      setIsLoadingClientes(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [])

  const handleClienteSuccess = () => {
    fetchClientes();
    setIsEditDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await formRef.current?.submit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await formEditRef.current?.submit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DataTable
        columns={clienteColumns}
        data={clientes}
        isLoading={isLoadingClientes}
      >
        <div className="flex gap-2">
          <DialogFormWrapper
            buttonName="+ Novo Cliente"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            title="Cadastro de Cliente"
            buttonSubmitName="Salvar"
          >
            <FormCliente ref={formRef} onSuccess={handleClienteSuccess} />
          </DialogFormWrapper>

          {isEditDialogOpen && selectedCliente && (
            <DialogFormWrapper
              buttonName="Editar"
              onSubmit={handleEditSubmit}
              isSubmitting={isSubmitting}
              title="Editar Cliente"
              buttonSubmitName="Atualizar"
            >
              <FormClienteEdit 
                ref={formEditRef} 
                onSuccess={handleClienteSuccess}
                clienteData={selectedCliente}
              />
            </DialogFormWrapper>
          )}
        </div>
      </DataTable>
    </div>
  )
}
