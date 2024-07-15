import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "./auth.entity";

@Entity('logs')
export class Logs{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    accion:string;
    @Column()
    ip:string;
    @Column()
    url_solicitada:string;
    @Column()
    status:number;
    @Column()
    fecha: string;

    @ManyToOne(()=>Auth,auth => auth.logs)
    usuario:Auth;
}