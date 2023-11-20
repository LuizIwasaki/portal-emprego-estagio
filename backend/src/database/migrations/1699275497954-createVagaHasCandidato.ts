import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateVagaHasCandidato1699275497954 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crie a tabela de associação
        await queryRunner.createTable(new Table({
            name: "vaga_has_candidato",
            columns: [
                {
                    name: "idVaga",
                    type: "int",
                    isPrimary: true,
                },
                {
                    name: "idCandidato",
                    type: "int",
                    isPrimary: true,
                },
            ]
        }), true);

        await queryRunner.createForeignKey("vaga_has_candidato", new TableForeignKey({
            columnNames: ["idVaga"],
            referencedTableName: "vaga",
            referencedColumnNames: ["idVaga"],
            onDelete: "CASCADE", // Ou outra ação desejada
        }));

        await queryRunner.createForeignKey("vaga_has_candidato", new TableForeignKey({
            columnNames: ["idCandidato"],
            referencedTableName: "candidato",
            referencedColumnNames: ["idCandidato"],
            onDelete: "CASCADE", // Ou outra ação desejada
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("vaga_has_candidato");
    }

}
