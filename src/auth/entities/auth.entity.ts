import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"; 
import { Logs } from "./logs.entity";
@Entity({ name: 'usuarios' })
export class Auth {
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    email: string;

    @Column()
    apellidop: string;

    @Column()
    apellidom: string;

    @Column()
    sexo: string;

    @Column({ type: "date", nullable: true })
    fecha: Date | null;

    @Column({ unique: true })
    nombreu: string;

    @Column()
    contrasena: string;

    @Column()
    telefono: string;

    @Column()
    pregunta: string;

    @Column()
    respuesta: string;

    @Column({ nullable: true })
    intentos?: number | null;

    @OneToMany(() => Cita, cita => cita.usuario)
    citas: Cita[];

    @OneToMany(() => Logs, logs => logs.usuario)
    logs:Logs[];
}

//--------------------
@Entity({ name: 'servicios' })
export class Servicios {
    @PrimaryGeneratedColumn()
    id_servicio: number;

    @Column()
    nombre: string;

    @Column()
    costo: string;

    @Column()
    descripcion: string;

    @Column()
    imagen:string;
 
}
//--------------------

@Entity({ name: 'citas' })
export class Cita {
    @PrimaryGeneratedColumn()
    id_cita: number;

    @Column({ type: "date",nullable:true })
    fecha: Date;

    @Column({ type: "time" })
    hora: string;

    @Column()
    motivo: string;

    @Column()
    dentista: string;

    @ManyToOne(() => Auth, auth => auth.citas) 
    @JoinColumn({ name: "id_usuario" })  
    usuario: Auth;

}


@Entity({ name: 'informacion' })
export class Informacion {
    @PrimaryGeneratedColumn()
    id_informacion: number;

    @Column({ type: 'text' })
    mision: string;

    @Column({ type: 'text' })
    vision: string;

    @Column({ type: 'text' })
    quienessomos: string;
}


@Entity({ name: 'preguntas' })
export class Preguntas {
    @PrimaryGeneratedColumn()
    id_preguntas: number;

    @Column()
    preguntas: string;

    @Column()
    respuestas: string;
}
