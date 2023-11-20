import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTipoServico1698806680718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "tipo_servico",
            columns: [
                {
                    name: "idTipoServico",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true, generationStrategy: "increment"
                },
                {
                    name: "nome",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "deletedAt",
                    type: "datetime",
                    isNullable: true
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tipo_servico");
    }

}
