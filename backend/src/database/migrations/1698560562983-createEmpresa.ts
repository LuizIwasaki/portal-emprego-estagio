import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateEmpresa1698560562983 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "empresa",
            columns: [
                { name: "idEmpresa", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nome_empresa", type: "varchar", length: "45", isNullable: false },
                { name: "cnpj", type: "int", isNullable: false },
                { name: "email", type: "varchar", length: "45", isNullable: false },
                { name: "senha", type: "text", isNullable: false },
                { name: "cep", type: "int", isNullable: false },
                { name: "uf", type: "varchar", length: "2", isNullable: false },
                { name: "cidade", type: "varchar", length: "45", isNullable: false },
                { name: "logradouro", type: "varchar", length: "45", isNullable: false },
                { name: "numero", type: "varchar", length: "6", isNullable: false },
                { name: "complemento", type: "varchar", length: "45", isNullable: true },
                { name: "tipo", type: "varchar", length: "45", isNullable: false },
                { name: "site", type: "varchar", length: "45", isNullable: true },
                { name: "deletedAt", type: "timestamp", isNullable: true },
                { name: "idArea", type: "int", isNullable: false },
            ],
        }));

        queryRunner.query(`
            INSERT INTO empresa (nome_empresa, cnpj, email, senha, cep, uf, cidade, logradouro, numero, tipo, idArea)
            VALUES ('Empresa1', '123456789', 'emp@gmail.com', '$2b$10$NP2vw0k/IQPjPo0/00DhBeOpU4lZdnNT1j3zJCJkdG1JMYukgRL1i', '19470000', 'SP', '112' , 'Cidade1', 'Rua', 'Empresa', 1)
        `);

        await queryRunner.createForeignKey("empresa", new TableForeignKey({
            columnNames: ["idArea"],
            referencedTableName: "area",
            referencedColumnNames: ["idArea"],
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("empresa");
    }
}
