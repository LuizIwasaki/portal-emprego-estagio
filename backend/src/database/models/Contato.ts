import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Empresa } from "./Empresa";
import { Candidato } from "./Candidato";
import { ProfissionalLiberal } from "./ProfissionalLiberal";

@Index("idEmpresa", ["idEmpresa"], {})
@Index("idCandidato", ["idCandidato"], {})
@Index("idProfissionalLiberal", ["idProfissionalLiberal"], {})
@Entity("contato", { schema: "db_pepvagas" })
export class Contato {
  @PrimaryGeneratedColumn({ type: "int", name: "idContato" })
  idContato: number;

  @Column("varchar", { name: "tipo_contato", length: 20 })
  tipoContato: string;

  @Column("varchar", { name: "contato", length: 45 })
  contato: string;

  @Column("int", { name: "idEmpresa", nullable: true })
  idEmpresa: number | null;

  @Column("int", { name: "idCandidato", nullable: true })
  idCandidato: number | null;

  @Column("int", { name: "idProfissionalLiberal", nullable: true })
  idProfissionalLiberal: number | null;

  @ManyToOne(() => Empresa, (empresa) => empresa.contatos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "idEmpresa", referencedColumnName: "idEmpresa" }])
  idEmpresa2: Empresa;

  @ManyToOne(() => Candidato, (candidato) => candidato.contatos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "idCandidato", referencedColumnName: "idCandidato" }])
  idCandidato2: Candidato;

  @ManyToOne(
    () => ProfissionalLiberal,
    (profissionalLiberal) => profissionalLiberal.contatos,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    {
      name: "idProfissionalLiberal",
      referencedColumnName: "idProfissionalLiberal",
    },
  ])
  idProfissionalLiberal2: ProfissionalLiberal;
}
