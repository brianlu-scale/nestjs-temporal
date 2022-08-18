import { OnApplicationShutdown, Provider } from '@nestjs/common';
import { TemporalModuleOptions } from './interfaces';
import { Connection, WorkflowClient } from '@temporalio/client';
import { getQueueToken } from './utils';

export function buildClient(option: TemporalModuleOptions): WorkflowClient {
  // console.log('logging options here');
  // console.log(option);
  const connection = Connection.lazy(option.connection);
  // console.log('connection options');
  // console.log(option.connection);
  // console.log('client options');
  // console.log({
  //   ...option.workflowOptions,
  //   connection,
  // });
  const client = new WorkflowClient({
    ...option.workflowOptions,
    connection,
  });

  (connection as any as OnApplicationShutdown).onApplicationShutdown = async function (
    this: Connection,
  ) {
    return await this.close();
  };
  // console.log('client has been built');
  // console.log(connection);
  // console.log(client);

  return client;
}

export function createClientProviders(
  options: TemporalModuleOptions[],
): Provider[] {
  return options.map((option) => ({
    provide: getQueueToken(option && option.name ? option.name : undefined),
    useFactory: () => {
      return buildClient(option || {});
    },
  }));
}
