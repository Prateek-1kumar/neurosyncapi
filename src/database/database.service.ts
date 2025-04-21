import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private dataSource: DataSource) {}

  /**
   * Get the TypeORM data source
   */
  getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * Check if the database connection is alive
   */
  async isConnected(): Promise<boolean> {
    try {
      return this.dataSource.isInitialized;
    } catch (error) {
      this.logger.error('Error checking database connection:', error);
      return false;
    }
  }

  /**
   * Run a health check query on the database
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }
}
