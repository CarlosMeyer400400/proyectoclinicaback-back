export class CreateFeedbackDto{  
    id_feedback: number;
    respuesta: string;
    usuario?: {
        id_usuario: number;
        nombre: string;
        apellidop: string;
        apellidom: string;
    };
}
