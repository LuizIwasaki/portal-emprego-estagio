import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vaga } from "./Vaga";

@Entity("equipe", { schema: "db_pepvagas" })
export class Equipe {
  @PrimaryGeneratedColumn({ type: "int", name: "idEquipe" })
  idEquipe: number;

  @Column("varchar", { name: "nome", length: 45 })
  nome: string;

  @Column("varchar", { name: "email", length: 45 })
  email: string;

  @Column("text", { name: "senha" })
  senha: string;

  @Column("varchar", { name: "tipo", length: 45 })
  tipo: string;
  
 @DeleteDateColumn({ name: "deletedAt" })
  deletedAt: Date;

  @OneToMany(() => Vaga, (vaga) => vaga.idEquipe2)
  vagas: Vaga[];
}
