import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Area } from "./Area";
import { Administrador } from "./Administrador";
import { Empresa } from "./Empresa";
import { Equipe } from "./Equipe";
import { Candidato } from "./Candidato";

@Index("idArea", ["idArea"], {})
@Index("idAdministrador", ["idAdministrador"], {})
@Index("idEmpresa", ["idEmpresa"], {})
@Index("idEquipe", ["idEquipe"], {})
@Entity("vaga", { schema: "db_pepvagas" })
export class Vaga {
  @PrimaryGeneratedColumn({ type: "int", name: "idVaga" })
  idVaga: number;

  @Column("varchar", { name: "tipo_vaga", length: 45 })
  tipo_vaga: string;

  @Column("varchar", { name: "regime", length: 20 })
  regime: string;

  @Column("varchar", { name: "modalidade", length: 45 })
  modalidade: string;

  @Column("varchar", { name: "titulo_vaga", length: 45 })
  titulo_vaga: string;

  @Column("text", { name: "descricao" })
  descricao: string;

  @Column("float", { name: "salario", precision: 12 })
  salario: number;

  @Column("varchar", { name: "cep", length: 45 })
  cep: string;

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

  @Column("tinyint", { name: "pcd" })
  pcd: number;
  
  @Column("date", { name: "data_limite", nullable: true })
  data_limite: Date | null;

  @Column("varchar", { name: "cnh", length: 45 })
  cnh: string;

  @Column("longblob", { name: "imagem", nullable: true })
  imagem: Buffer | null;

  @Column("varchar", { name: "email_curriculo", nullable: true, length: 45 })
  email_curriculo: string | null;

  @Column("varchar", { name: "contato", nullable: true, length: 45 })
  contato: string | null;

  @Column("varchar", { name: "site", nullable: true, length: 45 })
  site: string | null;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @Column("int", { name: "idAdministrador", nullable: true })
  idAdministrador: number | null;

  @Column("int", { name: "idEquipe", nullable: true })
  idEquipe: number | null;

  @Column("int", { name: "idEmpresa", nullable: true })
  idEmpresa: number | null;

  @Column("int", { name: "idAdministradorExcluiu", nullable: true })
  idAdministradorExcluiu: number | null;

  @Column("int", { name: "idEquipeExcluiu", nullable: true })
  idEquipeExcluiu: number | null;

  @Column("int", { name: "idRepresentanteExcluiu", nullable: true })
  idRepresentanteExcluiu: number | null;

  @Column("int", { name: "idArea", nullable: true })
  idArea: number | null;
  
  @ManyToOne(() => Area, (area) => area.vagas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "idArea", referencedColumnName: "idArea" }])
  idArea2: Area;

  @ManyToOne(() => Administrador, (administrador) => administrador.vagas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "idAdministrador", referencedColumnName: "idAdministrador" },
  ])
  idAdministrador2: Administrador;

  @ManyToOne(() => Empresa, (empresa) => empresa.vagas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "idEmpresa", referencedColumnName: "idEmpresa" }])
  idEmpresa2: Empresa;

  @ManyToOne(() => Equipe, (equipe) => equipe.vagas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "idEquipe", referencedColumnName: "idEquipe" }])
  idEquipe2: Equipe;

  @ManyToMany(() => Candidato, (candidato) => candidato.vagas)
  @JoinTable({
    name: "vaga_has_candidato",
    joinColumns: [{ name: "idVaga", referencedColumnName: "idVaga" }],
    inverseJoinColumns: [
      { name: "idCandidato", referencedColumnName: "idCandidato" },
    ],
    schema: "db_pepvagas",
  })
  candidatos: Candidato[];
}
