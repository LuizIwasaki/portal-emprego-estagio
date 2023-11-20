import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCeps1698806700510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "ceps",
            columns: [
                { name: "cep", type: "int", isPrimary: true },
                { name: "uf", type: "varchar", length: "2" },
                { name: "cidade", type: "varchar", length: "45" },
                { name: "logradouro", type: "varchar", length: "45",},
                { name: "numero", type: "varchar", length: "6",}
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("ceps");
    }

}
