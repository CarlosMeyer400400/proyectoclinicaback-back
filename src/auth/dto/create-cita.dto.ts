export class CreateCitasDto {
    id_cita: number;
    fecha: Date;
    hora: string;
    motivo: string;
    dentista: string;
    usuario?: {
        id_usuario: number;
        nombre: string;
        apellidop: string;
        apellidom: string;
    };
}