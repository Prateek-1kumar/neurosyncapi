import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAssessmentsTable1719154857400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'assessments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'data',
            type: 'simple-json',
          },
          {
            name: 'analysis',
            type: 'simple-json',
          },
        ],
      }),
      true,
    );

    // Add foreign key if profiles table exists
    const profilesTableExists = await queryRunner.hasTable('profiles');
    if (profilesTableExists) {
      await queryRunner.createForeignKey(
        'assessments',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['uid'],
          referencedTableName: 'profiles',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('assessments');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('userId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('assessments', foreignKey);
      }
    }
    await queryRunner.dropTable('assessments');
  }
}
