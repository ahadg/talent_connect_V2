import { winstonLogger } from '@ahadg/jobber-shared';
import { Logger } from 'winston';
import { config } from './config';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatsDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('Chats service successfully connected to database.');
  } catch (error) {
    log.log('error', 'ChatsService databaseConnection() method error:', error);
  }
};

export { databaseConnection };