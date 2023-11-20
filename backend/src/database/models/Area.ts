import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Empresa } from "./Empresa";
import { Vaga } from "./Vaga";

@Entity("area", { schema: "db_pepvagas" })
export class Area {
  @PrimaryGeneratedColumn({ type: "int", name: "idArea" })
  idArea: number;

  @Column("varchar", { name: "nome", length: 45 })
  nome: string;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Empresa, (empresa) => empresa.idArea2)
  empresas: Empresa[];

  @OneToMany(() => Vaga, (vaga) => vaga.idArea2)
  vagas: Vaga[];
}
