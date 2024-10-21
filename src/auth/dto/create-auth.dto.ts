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
    rol: string;
    ip?: string;
    fecha_log?: string;
}

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

export class CreateInformacionDto {
    id_informacion: number;
    quienessomos: string;
    vision: string;
    mision: string;
}

export class CreatePreguntasDto {
    id_preguntas: number;
    preguntas: string;
    respuestas: string;
}

export class CreateServiciosDto {
    id_servicio: number;
    nombre: string;
    costo: string;
    descripcion: string;
}

export class CreateContactoDto {
    id_contacto: number;
    nombre: string;
    email: string;
    mensaje: string;
}

export class CreateFeedbackDto {
    id_feedback: number;
    respuesta: string;
    usuario?: {
        id_usuario: number;
        nombre: string;
        apellidop: string;
        apellidom: string;
    };
}
