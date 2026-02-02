// Serviço para buscar informações de CEP
// Usando a API pública ViaCEP

interface CEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const fetchCEPData = async (cep: string): Promise<CEPData | null> => {
  try {
    // Remove caracteres especiais do CEP
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      return null;
    }

    const response = await fetch(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    );

    if (!response.ok) {
      return null;
    }

    const data: CEPData = await response.json();

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};

export const formatCEP = (cep: string): string => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length <= 5) {
    return cleanCep;
  }
  return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5, 8)}`;
};

export const formatEnderecoFromCEP = (data: CEPData): string => {
  return `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
};
