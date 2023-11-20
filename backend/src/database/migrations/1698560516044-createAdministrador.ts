import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAdministrador1698560516044 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "administrador",
            columns: [
                { name: "idAdministrador", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nome", type: "varchar", length: "45" },
                { name: "email", type: "varchar", length: "45" },
                { name: "senha", type: "text" },
                { name: "tipo", type: "varchar", length: "45" },
                { name: "deletedAt", type: "timestamp", isNullable: true },
            ],
        }));

        queryRunner.query(`
            INSERT INTO administrador (nome, email, senha, tipo)
            VALUES ('Administrador1', 'admin@admin.com', '$2b$10$NP2vw0k/IQPjPo0/00DhBeOpU4lZdnNT1j3zJCJkdG1JMYukgRL1i', 'Administrador')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("administrador");
    }
}
