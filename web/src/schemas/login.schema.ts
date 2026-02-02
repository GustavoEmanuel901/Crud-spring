
import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username é obrigatório"),
  senha: z.string(),
});
export type LoginSchema = z.infer<typeof loginSchema>;