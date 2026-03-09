export const ExceptionMessage = {
  IsNotEmpty: (property: string) => `O Campo ${property} é obrigatório`,
  IsEmail: (property: string) => `O Campo ${property} deve ser um email`,
  IsString: (property: string) =>
    `O Campo ${property} deve deve estar no formato string`,
  MinLength: (min: number, property: string) =>
    `O Campo ${property} deve deve no minimo ${min} caracter${min > 1 ? 'es' : ''}`,
};
