import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateArea1698560527490 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "area",
            columns: [
                { name: "idArea", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nome", type: "varchar", length: "45" },
                { name: "deletedAt", type: "timestamp", isNullable: true },
            ]
        }));

        await queryRunner.query(`INSERT INTO area (nome) VALUES ('Informática')`);
        await queryRunner.query(`INSERT INTO area (nome) VALUES ('Construção Civil')`);
        await queryRunner.query(`INSERT INTO area (nome) VALUES ('Química')`);
        
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("area");
    }
}
