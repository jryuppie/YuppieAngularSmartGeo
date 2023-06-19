export interface Usuario {
    id?: number;
    usuario?: string;
    nome?: string;
    funcao?: string;
    unidade?: string;
    autorizacao?: string;   
    email?: string;  
    matricula?: string;   
    avatar?: string;
    status?:boolean;
    habilitado?: boolean
}