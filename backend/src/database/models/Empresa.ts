import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Contato } from "./Contato";
import { Area } from "./Area";
import { Representante } from "./Representante";
import { Vaga } from "./Vaga";

@Index("idArea", ["idArea"], {})
@Entity("empresa", { schema: "db_pepvagas" })
export class Empresa {
  @PrimaryGeneratedColumn({ type: "int", name: "idEmpresa" })
  idEmpresa: number;

  @Column("varchar", { name: "nome_empresa", length: 45 })
  nomeEmpresa: string;

  @Column("int", { name: "cnpj" })
  cnpj: number;

  @Column("varchar", { name: "email", length: 45 })
  email: string;

  @Column("text", { name: "senha" })
  senha: string;

  @Column("int", { name: "cep" })
  cep: number;

  @Column("varchar", { name: "uf", length: 2 })
  uf: string;

  @Column("varchar", { name: "cidade", length: 45 })
  cidade: string;

  @Column("varchar", { name: "logradouro", length: 255 })
  logradouro: string;

  @Column("varchar", { name: "numero", length: 6 })
  numero: string;

  @Column("varchar", { name: "complemento", nullable: true, length: 45 })
  complemento: string | null;

  @Column("varchar", { name: "tipo", length: 45 })
  tipo: string;

  @Column("varchar", { name: "site", nullable: true, length: 45 })
  site: string | null;

  @Column("timestamp", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("int", { name: "idArea" })
  idArea: number;

  @OneToMany(() => Contato, (contato) => contato.idEmpresa2)
  contatos: Contato[];

  @ManyToOne(() => Area, (area) => area.empresas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "idArea", referencedColumnName: "idArea" }])
  idArea2: Area;

  @OneToMany(() => Representante, (representante) => representante.idEmpresa)
  representantes: Representante[];

  @OneToMany(() => Vaga, (vaga) => vaga.idEmpresa2)
  vagas: Vaga[];
}
