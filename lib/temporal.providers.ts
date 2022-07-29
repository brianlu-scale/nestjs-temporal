import { OnApplicationShutdown, Provider } from '@nestjs/common';
import { TemporalModuleOptions } from './interfaces';
import { Connection, WorkflowClient } from '@temporalio/client';
import { getQueueToken } from './utils';

export async function buildClient(option: TemporalModuleOptions): Promise<WorkflowClient> {
  const connection = await Connection.connect(option.connection);
  const client = new WorkflowClient({
    ...option.workflowOptions,
    connection,
  });

  (connection as any as OnApplicationShutdown).onApplicationShutdown = async function (
    this: Connection,
  ) {
    return await this.close();
  };
  console.log('client has been built');
  console.log(connection);
  console.log(client);
  return client;
}

export function createClientProviders(
  options: TemporalModuleOptions[],
): Provider[] {
  return options.map((option) => ({
    provide: getQueueToken(option && option.name ? option.name : undefined),
    useFactory: async () => {
      return await buildClient(option || {});
    },
  }));
}
