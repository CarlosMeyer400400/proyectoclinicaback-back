export class CreateAuthDto {
    id_usuario: number;
    nombre: string;
    email: string;
    apellidop: string;
    apellidom: string;
    sexo: string;
    fecha?: Date | null;
    nombreu: string;
    contrasena: string;
    telefono: string;
    pregunta: string;
    respuesta: string;
}
export class CreateCitaDto {
    id_cita: number;
    fecha?: Date | null;
    hora: string;
    dentista: string;
    id_usuario: number;
}
export class CreateInformacionDto{
    id_informacion: number;
    quienessomos: string;
    vision: string;
    mision: string;
}

export class CreatePreguntasDto{  
    id_pregunta: number;
    pregunta: string;
    respuesta: string;
}
