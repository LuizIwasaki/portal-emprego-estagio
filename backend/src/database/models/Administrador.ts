import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vaga } from "./Vaga";

@Entity("administrador", { schema: "db_pepvagas" })
export class Administrador {
  @PrimaryGeneratedColumn({ type: "int", name: "idAdministrador" })
  idAdministrador: number;

  @Column("varchar", { name: "nome", length: 45 })
  nome: string;

  @Column("varchar", { name: "email", length: 45 })
  email: string;

  @Column("text", { name: "senha" })
  senha: string;

  @Column("varchar", { name: "tipo", length: 45 })
  tipo: string;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Vaga, (vaga) => vaga.idAdministrador2)
  vagas: Vaga[];
}
