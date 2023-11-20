import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCandidato1698560548931 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "candidato",
            columns: [
                { name: "idCandidato", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nome", type: "varchar", length: "45", isNullable: false },
                { name: "nome_social", type: "varchar", length: "45", isNullable: false },
                { name: "genero", type: "varchar", length: "20", isNullable: false },
                { name: "cpf", type: "bigint", isNullable: false },
                { name: "email", type: "varchar", length: "45", isNullable: false },
                { name: "senha", type: "text", isNullable: false },
                { name: "tipo", type: "varchar", length: "45", isNullable: false },
                { name: "pretensao_salarial", type: "float", precision: 12, isNullable: false },
                { name: "cep", type: "int", isNullable: false },
                { name: "cidade", type: "varchar", length: "45", isNullable: false },
                { name: "logradouro", type: "varchar", length: "255", isNullable: false },
                { name: "numero", type: "varchar", length: "6", isNullable: false},
                { name: "complemento", type: "varchar", length: "45", isNullable: true },
                { name: "uf", type: "varchar", length: "2", isNullable: false},
                { name: "disponibilidade", type: "varchar", length: "30", isNullable: false },
                { name: "cnh", type: "varchar", length: "3", isNullable: false },
                { name: "nivel_instrucao", type: "varchar", length: "75", isNullable: false },
                { name: "data_nascimento", type: "date", isNullable: false },
                { name: "tipo_vaga_interesse", type: "varchar", length: "45", isNullable: false },
                { name: "regiao_interesse", type: "boolean", isNullable: false, default: false},
                { name: "cep_interesse", type: "varchar", length: "45", isNullable: true },
                { name: "cidade_interesse", type: "varchar", length: "45", isNullable: true },
                { name: "uf_interesse", type: "varchar", length: "2", isNullable: true },
                { name: "regime_interesse", type: "varchar", length: "20", isNullable: false },
                { name: "modalidade_interesse", type: "varchar", length: "30", isNullable: false },
                { name: "areas", type: "text", isNullable: false },
                { name: "curriculo", type: "longblob", isNullable: true },
                { name: "pcd", type: "longblob", isNullable: true },
                { name: "deletedAt", type: "timestamp", isNullable: true }
            ]
        }));

        await queryRunner.query(`
                  INSERT INTO candidato (nome, nome_social, genero, cpf, email, senha, tipo, pretensao_salarial, cep, cidade, logradouro, numero, uf, disponibilidade, cnh, nivel_instrucao, data_nascimento, tipo_vaga_interesse, regiao_interesse, cep_interesse, cidade_interesse, uf_interesse, regime_interesse, modalidade_interesse, areas, curriculo, pcd)
                    VALUES ('Candidato1', 'Candidato1', 'Masculino', 12345678901, 'candidato@gmail.com', '$2b$10$NP2vw0k/IQPjPo0/00DhBeOpU4lZdnNT1j3zJCJkdG1JMYukgRL1i', 'Candidato', 1000, 12345678, 'Cidade', 'Logradouro', '66-13', 'SP', 'Manha', 'A', 'Superior Completo', '2000-01-01', 'Informática', false, '88540000', 'Presidente Epitacio', 'SP', 'PJ', 'Remoto', 'Construção Civil', 'Curriculo', 'PCD')
                `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("candidato");
    }
}
