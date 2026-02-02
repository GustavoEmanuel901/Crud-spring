import Input from "@/components/Input";
import api from "@/services/api";
import { clienteSchema, type ClienteFormData } from "@/schemas/cliente.schema";
import { fetchCEPData, formatEnderecoFromCEP } from "@/services/cepService";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useState, useEffect } from "react";
import { toast } from "sonner";

interface FormClienteEditProps {
  onSuccess?: () => void;
  clienteData?: {
    id: string;
    nome: string;
    cpf: string;
    endereco: string;
  };
}

interface FormClienteEditRef {
  submit: () => Promise<void>;
}

const FormClienteEdit = forwardRef<FormClienteEditRef, FormClienteEditProps>(
  ({ onSuccess, clienteData }, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCEP, setIsLoadingCEP] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
      setValue,
    } = useForm<ClienteFormData>({
      resolver: zodResolver(clienteSchema),
      mode: "onChange",
      defaultValues: {
        nome: clienteData?.nome || "",
        cpf: clienteData?.cpf || "",
        cep: "",
        endereco: clienteData?.endereco || "",
      },
    });

    const cepValue = useWatch({
      control,
      name: "cep",
    });

    // Busca endereço quando CEP é preenchido
    useEffect(() => {
      const buscarEndereco = async () => {
        if (!cepValue || cepValue.length < 9) return;

        setIsLoadingCEP(true);
        try {
          const cepData = await fetchCEPData(cepValue);
          if (cepData) {
            const enderecoFormatado = formatEnderecoFromCEP(cepData);
            setValue("endereco", enderecoFormatado);
          } else {
            toast.error("CEP não encontrado");
            setValue("endereco", "");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          toast.error("Erro ao buscar CEP");
        } finally {
          setIsLoadingCEP(false);
        }
      };

      const timeoutId = setTimeout(buscarEndereco, 500);
      return () => clearTimeout(timeoutId);
    }, [cepValue, setValue]);

    const onSubmit: SubmitHandler<ClienteFormData> = async (data) => {
      try {
        setIsSubmitting(true);
        // Remove o CEP antes de enviar para a API
        const { cep, ...dataWithoutCEP } = data;
        
        await api.put(`/clientes/${clienteData?.id}`, dataWithoutCEP);

        toast.success("Cliente atualizado com sucesso!");
        reset();
        onSuccess?.();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Erro ao atualizar cliente");
        } else {
          toast.error("Erro ao atualizar cliente");
        }
        console.error("Erro ao atualizar cliente:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit(onSubmit),
    }));

    return (
      <div className="space-y-4">
        <Input
          label="Nome"
          name="nome"
          placeholder="Digite o nome completo"
          register={register}
          required
          error={errors.nome}
        />

        <Input
          label="CPF"
          name="cpf"
          placeholder="000.000.000-00"
          register={register}
          required
          error={errors.cpf}
        />

        <Input
          label="CEP"
          name="cep"
          placeholder="00000-000"
          register={register}
          required
          error={errors.cep}
        />

        <Input
          label="Endereço"
          name="endereco"
          placeholder="Será preenchido automaticamente"
          register={register}
          required
          disabled={isLoadingCEP}
          error={errors.endereco}
        />
        {isLoadingCEP && (
          <p className="text-sm text-blue-500">Buscando endereço...</p>
        )}
      </div>
    );
  }
);

FormClienteEdit.displayName = "FormClienteEdit";

export default FormClienteEdit;
