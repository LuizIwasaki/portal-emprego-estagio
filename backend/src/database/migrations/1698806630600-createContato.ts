import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateContato1698806630600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "contato",
            columns: [
                {
                    name: "idContato",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true, generationStrategy: "increment"
                },
                {
                    name: "tipo_contato",
                    type: "varchar",
                    length: "20"
                },
                {
                    name: "contato",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "idEmpresa",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idCandidato",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idProfissionalLiberal",
                    type: "int",
                    isNullable: true
                }
            ]
        }), true);

        await queryRunner.createForeignKey("contato", new TableForeignKey({
            columnNames: ["idEmpresa"],
            referencedColumnNames: ["idEmpresa"],
            referencedTableName: "empresa",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));

        await queryRunner.createForeignKey("contato", new TableForeignKey({
            columnNames: ["idCandidato"],
            referencedColumnNames: ["idCandidato"],
            referencedTableName: "candidato",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));

        await queryRunner.createForeignKey("contato", new TableForeignKey({
            columnNames: ["idProfissionalLiberal"],
            referencedColumnNames: ["idProfissionalLiberal"],
            referencedTableName: "profissional_liberal",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("contato", "idEmpresa");
        await queryRunner.dropForeignKey("contato", "idCandidato");
        await queryRunner.dropForeignKey("contato", "idProfissionalLiberal");

        await queryRunner.dropTable("contato");
    }

}
