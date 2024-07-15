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
    ip:string;
    fecha_log?:string;
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
    id_preguntas: number;
    preguntas: string;
    respuestas: string;
}

export class CreateServiciosDto{  
    id_servicio: number;
    nombre: string;
    costo: string;
    descripcion: string;
}

