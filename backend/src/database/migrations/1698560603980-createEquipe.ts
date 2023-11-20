import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateEquipe1698560603980 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "equipe",
            columns: [
                { name: "idEquipe", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nome", type: "varchar", length: "45", isNullable: false },
                { name: "email", type: "varchar", length: "45", isNullable: false },
                { name: "senha", type: "text", isNullable: false },
                { name: "tipo", type: "varchar", length: "45" },
                { name: "deletedAt", type: "timestamp", isNullable: true }
            ],
        }));

        queryRunner.query(`
        INSERT INTO equipe (nome, email, senha, tipo)
        VALUES ('Equipe', 'eq@gmail.com', '$2b$08$tAu5eFlkMTL8c634RxbpSuWQ5fVkpDuEc9Du/XZi6rTqEHbDgii7a', 'Equipe')
    `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("equipe");
    }
}
