import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1725176013882 implements MigrationInterface {
  name = 'InitData1725176013882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "name" character varying NOT NULL, "describe" character varying, "tiers" integer NOT NULL, "permissions" text array NOT NULL, "enable" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0fcd8225d86d3bda963629683a" ON "role" ("updated") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d24badda3a795391b3b48d1f3" ON "role" ("deleted") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "name" character varying NOT NULL, "nickName" character varying, "avatar" character varying, "email" character varying NOT NULL, "phoneNum" character varying NOT NULL, "password" character varying NOT NULL, "enable" boolean NOT NULL DEFAULT true, "permissions" text array NOT NULL DEFAULT '{}', "initRoot" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5904a9d40152f354e4c7b0202f" ON "user" ("updated") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2a33d7f394763e171ef11acc5" ON "user" ("deleted") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4be2f7adf862634f5f803d246b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles_role"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2a33d7f394763e171ef11acc5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5904a9d40152f354e4c7b0202f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d24badda3a795391b3b48d1f3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0fcd8225d86d3bda963629683a"`,
    );
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
