import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato XXX.XXX.XXX-XX"),
  cep: z.string()
    .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato XXXXX-XXX"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
