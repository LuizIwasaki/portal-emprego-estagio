import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Empresa } from "./Empresa";

@Entity("representante", { schema: "db_pepvagas" })
export class Representante {
  @PrimaryGeneratedColumn({ type: "int", name: "idRepresentante" })
  idRepresentante: number;

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

  @Column("int", { name: "idEmpresa", nullable: true })
  idEmpresa: number | null;

  @ManyToOne(() => Empresa, (empresa) => empresa.representantes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "idEmpresa", referencedColumnName: "idEmpresa" }])
  idEmpresa2: Empresa;
}
