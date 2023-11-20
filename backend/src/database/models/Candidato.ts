import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Contato } from "./Contato";
import { Vaga } from "./Vaga";

@Entity("candidato", { schema: "db_pepvagas" })
export class Candidato {
  @PrimaryGeneratedColumn({ type: "int", name: "idCandidato" })
  idCandidato: number;

  @Column("varchar", { name: "nome", length: 45 })
  nome: string;

  @Column("varchar", { name: "nome_social", length: 45 })
  nomeSocial: string;

  @Column("varchar", { name: "genero", length: 20 })
  genero: string;

  @Column("int", { name: "cpf" })
  cpf: number;

  @Column("varchar", { name: "email", length: 45 })
  email: string;

  @Column("text", { name: "senha" })
  senha: string;

  @Column("varchar", { name: "tipo", length: 45 })
  tipo: string;

  @Column("float", { name: "pretensao_salarial", precision: 12 })
  pretensaoSalarial: number;

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

  @Column("varchar", { name: "disponibilidade", length: 30 })
  disponibilidade: string;

  @Column("varchar", { name: "cnh", length: 3 })
  cnh: string;

  @Column("varchar", { name: "nivel_instrucao", length: 50 })
  nivelInstrucao: string;

  @Column("date", { name: "data_nascimento" })
  dataNascimento: string;

  @Column("varchar", { name: "tipo_vaga_interesse", length: 45 })
  tipoVagaInteresse: string;

  @Column("tinyint", {
    name: "regiao_interesse",
    width: 1,
    default: () => "'0'",
  })
  regiaoInteresse: boolean;

  @Column("varchar", { name: "cep_interesse", nullable: true, length: 45 })
  cepInteresse: string | null;

  @Column("varchar", { name: "cidade_interesse", nullable: true, length: 45 })
  cidadeInteresse: string | null;

  @Column("varchar", { name: "uf_interesse", nullable: true, length: 2 })
  ufInteresse: string | null;

  @Column("varchar", { name: "regime_interesse", length: 20 })
  regimeInteresse: string;

  @Column("varchar", { name: "modalidade_interesse", length: 30 })
  modalidadeInteresse: string;

  @Column("text", { name: "areas" })
  areas: string;

  @Column("blob", { name: "curriculo", nullable: true })
  curriculo: Buffer | null;

  @Column("blob", { name: "pcd", nullable: true })
  pcd: Buffer | null;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Contato, (contato) => contato.idCandidato2)
  contatos: Contato[];

  @ManyToMany(() => Vaga, (vaga) => vaga.candidatos)
  vagas: Vaga[];
}
