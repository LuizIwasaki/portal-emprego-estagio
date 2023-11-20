import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Contato } from "./Contato";
import { TipoServico } from "./TipoServico";

@Entity("profissional_liberal", { schema: "db_pepvagas" })
export class ProfissionalLiberal {
  @PrimaryGeneratedColumn({ type: "int", name: "idProfissionalLiberal" })
  idProfissionalLiberal: number;

  @Column("varchar", { name: "nome", length: 45 })
  nome: string;

  @Column("varchar", { name: "email", length: 45 })
  email: string;

  @Column("text", { name: "senha" })
  senha: string;

  @Column("varchar", { name: "tipo", length: 45 })
  tipo: string;

  @Column("int", { name: "cep" })
  cep: number;

  @Column("varchar", { name: "uf", length: 2 })
  uf: string;

  @Column("varchar", { name: "cidade", length: 45 })
  cidade: string;

  @Column("varchar", { name: "logradouro", length: 255 })
  logradouro: string;

  @Column("varchar", { name: "numero", length: 45 })
  numero: string;

  @Column("varchar", { name: "complemento", nullable: true, length: 45 })
  complemento: string | null;

  @Column("text", { name: "descricao" })
  descricao: string;

  @Column("longblob", { name: "arquivo_pdf", nullable: true })
  arquivoPdf: Buffer | null;

  @Column("longblob", { name: "arquivo_imagem", nullable: true })
  arquivoImagem: Buffer | null;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => Contato, (contato) => contato.idProfissionalLiberal2)
  contatos: Contato[];

  @ManyToMany(
    () => TipoServico,
    (tipoServico) => tipoServico.profissionalLiberals
  )
  @JoinTable({
    name: "profissional_has_tipo",
    joinColumns: [
      {
        name: "idProfissionalLiberal",
        referencedColumnName: "idProfissionalLiberal",
      },
    ],
    inverseJoinColumns: [
      { name: "idTipoServico", referencedColumnName: "idTipoServico" },
    ],
    schema: "db_pepvagas",
  })
  tipoServicos: TipoServico[];
}
