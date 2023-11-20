import { Column, Entity } from "typeorm";

@Entity("ceps", { schema: "db_pepvagas" })
export class Ceps {
  @Column("int", { primary: true, name: "cep" })
  cep: number;

  @Column("varchar", { name: "uf", length: 2 })
  uf: string;

  @Column("varchar", { name: "cidade", length: 45 })
  cidade: string;

  @Column("varchar", { name: "logradouro", length: 45 })
  logradouro: string;

  @Column("varchar", { name: "numero", length: 6 })
  numero: string;
}
