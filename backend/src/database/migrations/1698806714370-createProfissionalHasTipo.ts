import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateProfissionalHasTipo1698806714370 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crie a tabela de associação
        await queryRunner.createTable(new Table({
            name: "profissional_has_tipo",
            columns: [
                {
                    name: "idProfissionalLiberal",
                    type: "int",
                    isPrimary: true,
                },
                {
                    name: "idTipoServico",
                    type: "int",
                    isPrimary: true,
                },
            ]
        }));

        await queryRunner.createForeignKey("profissional_has_tipo", new TableForeignKey({
            columnNames: ["idProfissionalLiberal"],
            referencedTableName: "profissional_liberal",
            referencedColumnNames: ["idProfissionalLiberal"],
            onDelete: "CASCADE", // Ou outra ação desejada
        }));

        await queryRunner.createForeignKey("profissional_has_tipo", new TableForeignKey({
            columnNames: ["idTipoServico"],
            referencedTableName: "tipo_servico",
            referencedColumnNames: ["idTipoServico"],
            onDelete: "CASCADE", // Ou outra ação desejada
        }));
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("profissional_has_tipo");
    }

}
