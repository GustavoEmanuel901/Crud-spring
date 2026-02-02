import type { ColumnDef } from "@tanstack/react-table";


export type Client = {
  id: string;
  nome: string;
  cpf: string;
  endereco: string;
  cep?: string;
};

export type Columns<T> = ColumnDef<T> & {
  accessorKey?: string;
  header: string;
  type: "normal" | "object" | "badge" | "action";
  objectKeys?: string[]; // Only for type "object"
  variant?:
    | "secondary"
    | "default"
    | "destructive"
    | "outline"
    | null
    | undefined;

  isOrderable?: boolean;
};

export type ApiResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
};

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
  erro?: boolean;
}

export interface DataTableFilters {
  search?: string;
  filterDate?: string;
  page?: number;
  order?: string | undefined;
  sort?: "asc" | "desc";
}

export interface TimeBlocks {
  id: string;
  minutes: number;
}

export interface ApiError {
  status: number;
  response: {
    data: {
      message: string;
    };
  };
}
// Vou ter que criar types para cada tabela ou mandar do backend já pronto?