import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1719466719906 implements MigrationInterface {
    name = 'InitialMigration1719466719906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY, 
                "email" varchar NOT NULL, 
                "password" varchar NOT NULL, 
                "admin" boolean NOT NULL DEFAULT false)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
