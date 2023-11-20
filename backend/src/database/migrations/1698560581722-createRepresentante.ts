import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRepresentante1698560581722 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "representante",
            columns: [
                { name: "idRepresentante", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nome", type: "varchar", length: "45", isNullable: false },
                { name: "email", type: "varchar", length: "45", isNullable: false },
                { name: "senha", type: "text", isNullable: false },
                { name: "tipo", type: "varchar", length: "45", isNullable: false },
                { name: "deletedAt", type: "timestamp", isNullable: true },
                { name: "idEmpresa", type: "int", isNullable: false },
            ],
        }));

        // Adicionar uma chave estrangeira para a tabela "empresa"
        await queryRunner.createForeignKey("representante", new TableForeignKey({
            columnNames: ["idEmpresa"],
            referencedTableName: "empresa",
            referencedColumnNames: ["idEmpresa"],
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));

        queryRunner.query(`
            INSERT INTO representante (nome, email, senha, tipo, idEmpresa)
            VALUES ('Representante 1', 'rep@gmail.com', '$2b$10$NP2vw0k/IQPjPo0/00DhBeOpU4lZdnNT1j3zJCJkdG1JMYukgRL1i', 'Representante', 1)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a chave estrangeira
        await queryRunner.dropTable("representante");
    }
}
