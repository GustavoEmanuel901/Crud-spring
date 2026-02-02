import Input from "@/components/Input";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { setTokens, clearTokens } from "@/utils/tokenManager";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginSchema } from "@/schemas/login.schema";
import { apiError } from "@/utils/apiError";

type LoginFormData = z.infer<typeof loginSchema>;

interface FormLoginProps {
  disableShowPasswordField?: boolean;
  showFooterLinks?: boolean;
}

const FormLogin = ({
  disableShowPasswordField ,
  showFooterLinks,
}: FormLoginProps) => {
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      senha: "",
    },
  });

  const usernameValue    = useWatch({
    control,
    name: "username",
  });

  // Valida o email e mostra/oculta o campo de senha
  useEffect(() => {
    const validateEmailAndShowPasswordField = async () => {
      if (disableShowPasswordField) {
        setShowPasswordField(true);

        if (!usernameValue) {
          setEmailIsValid(false);
          return;
        }
        const isValid = await trigger("username");
        setEmailIsValid(isValid);
      } else {
        if (!usernameValue) {
          setShowPasswordField(false);
          setEmailIsValid(false);
          return;
        }

        // Valida o email usando as regras do react-hook-form
        const isValid = await trigger("username");

        setEmailIsValid(isValid);

        // Se o email for válido, mostra o campo de senha
        if (isValid && !showPasswordField) {
          setShowPasswordField(true);
        }
        // Se o email for inválido e o campo de senha estiver visível, oculta
        else if (!isValid && showPasswordField) {
          setShowPasswordField(false);
          // Limpa o campo de senha quando o email é inválido
          clearErrors("senha");
        }
      }
    };
    const timeoutId = setTimeout(validateEmailAndShowPasswordField, 300);
    return () => clearTimeout(timeoutId);
  }, [
    usernameValue,
    trigger,
    showPasswordField,
    clearErrors,
    disableShowPasswordField,
  ]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await api.post("/auth/login", data);

      const { token, refreshToken } = response.data;
      setTokens(token, refreshToken);

      navigate("/cliente");
    } catch (err: unknown) {
      clearTokens();
      apiError(err, "Erro ao fazer login.");
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-6 px-4 border border-gray-200 rounded-lg sm:px-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome de usuário"
            name="username"
            register={register}
            required
            error={errors.username}
          />

          {showPasswordField && (
            <div className="animate-in fade-in duration-300">
              <Input
                type="password"
                label="Senha de acesso"
                name="senha"
                register={register}
                required
                placeholder="***********"
                error={errors.senha}
                showPasswordToggle={true}
              />
            </div>
          )}

          <div
            className={`transition-opacity duration-300 ${
              showPasswordField ? "opacity-100" : "opacity-50"
            }`}
          >
            <button
              type="submit"
              disabled={!emailIsValid || !showPasswordField}
              className={`
                  w-full flex justify-center p-2 border border-transparent rounded-md shadow-sm
                  text-sm font-medium text-white
                  transition duration-200
                  ${
                    !emailIsValid || !showPasswordField
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }
                `}
            >
              Acessar conta
            </button>
          </div>
        </form>
        {showFooterLinks && (
          <div className="mt-2 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Ainda não tem um cadastro?
              </p>
              <a
                href="/cadastro"
                className="inline-block font-semibold text-black-600 hover:text-black-800 transition duration-200 text-sm underline"
              >
                Cadastre-se
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormLogin;