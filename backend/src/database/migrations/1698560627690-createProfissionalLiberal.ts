import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProfissionalLiberal1698560627690 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "profissional_liberal",
            columns: [
                { name: "idProfissionalLiberal", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nome", type: "varchar", length: "45" },
                { name: "email", type: "varchar", length: "45" },
                { name: "senha", type: "text" },
                { name: "tipo", type: "varchar", length: "45" },
                { name: "cep", type: "int", isNullable: false },
                { name: "uf", type: "varchar", length: "2", isNullable: false },
                { name: "cidade", type: "varchar", length: "45", isNullable: false },
                { name: "logradouro", type: "varchar", length: "45", isNullable: false },
                { name: "numero", type: "varchar", length: "6", isNullable: false },
                { name: "complemento", type: "varchar", length: "45", isNullable: true },
                { name: "descricao", type: "text" },
                { name: "arquivo_pdf", type: "longblob", isNullable: true },
                { name: "arquivo_imagem", type: "longblob", isNullable: true },
                { name: "deletedAt", type: "timestamp", isNullable: true },
            ]

        }));

        queryRunner.query(`
            INSERT INTO profissional_liberal (nome, email, senha, tipo, cep, uf, cidade, logradouro, numero, descricao, arquivo_pdf, arquivo_imagem)
            VALUES ('Profissional 1', 'prof@gmail.com', '$2b$10$NP2vw0k/IQPjPo0/00DhBeOpU4lZdnNT1j3zJCJkdG1JMYukgRL1i', 'ProfissionalLiberal', 12345678, 'SP', 'Cidade', 'Presidente Vargas', '66-13', 'Descricao', 'PDF', 'imagem')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("profissional_liberal");
    }
}
