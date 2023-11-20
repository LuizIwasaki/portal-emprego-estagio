import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateVaga1698560665485 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "vaga",
            columns: [
                {
                    name: "idVaga",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "tipo_vaga",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "regime",
                    type: "varchar",
                    length: "20"
                },
                {
                    name: "modalidade",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "titulo_vaga",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "descricao",
                    type: "text"
                },
                {
                    name: "salario",
                    type: "float",
                    precision: 12
                },
                {
                    name: "cep",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "uf",
                    type: "varchar",
                    length: "2"
                },
                {
                    name: "cidade",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "logradouro",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "numero",
                    type: "varchar",
                    length: "6"
                },
                {
                    name: "complemento",
                    type: "varchar",
                    length: "45",
                    isNullable: true
                },
                {
                    name: "pcd",
                    type: "tinyint"
                },
                {
                    name: "data_limite",
                    type: "date"
                },
                {
                    name: "cnh",
                    type: "varchar",
                    length: "45"
                },
                {
                    name: "imagem",
                    type: "longblob",
                    isNullable: true
                },
                {
                    name: "email_curriculo",
                    type: "varchar",
                    length: "45",
                    isNullable: true
                },
                {
                    name: "contato",
                    type: "varchar",
                    length: "45",
                    isNullable: true
                },
                {
                    name: "site",
                    type: "varchar",
                    length: "45",
                    isNullable: true
                },
                {
                    name: "deletedAt",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "createdAt",
                    type: "timestamp"
                },
                {
                    name: "idAdministrador",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idEquipe",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idEmpresa",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idAdministradorExcluiu",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idEquipeExcluiu",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idRepresentanteExcluiu",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "idArea",
                    type: "int",
                    isNullable: true
                },
            ]
        }), true);

        await queryRunner.createForeignKey("vaga", new TableForeignKey({
            columnNames: ["idArea"],
            referencedColumnNames: ["idArea"],
            referencedTableName: "area",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));

        await queryRunner.createForeignKey("vaga", new TableForeignKey({
            columnNames: ["idAdministrador"],
            referencedColumnNames: ["idAdministrador"],
            referencedTableName: "administrador",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));

        await queryRunner.createForeignKey("vaga", new TableForeignKey({
            columnNames: ["idEmpresa"],
            referencedColumnNames: ["idEmpresa"],
            referencedTableName: "empresa",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));

        await queryRunner.createForeignKey("vaga", new TableForeignKey({
            columnNames: ["idEquipe"],
            referencedColumnNames: ["idEquipe"],
            referencedTableName: "equipe",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("vaga", "idArea");
        await queryRunner.dropForeignKey("vaga", "idAdministrador");
        await queryRunner.dropForeignKey("vaga", "idEmpresa");
        await queryRunner.dropForeignKey("vaga", "idEquipe");

        await queryRunner.dropColumn("vaga", "idArea");
        await queryRunner.dropColumn("vaga", "idAdministrador");
        await queryRunner.dropColumn("vaga", "idEmpresa");
        await queryRunner.dropColumn("vaga", "idEquipe");

        await queryRunner.dropTable("vaga");
    }

}
