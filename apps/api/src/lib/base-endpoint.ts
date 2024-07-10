import { Constructable } from 'typedi';
import { Context } from '../trpc/types';

export type EndpointParam<TInput, TContext extends Context = Context> = {
  input: TInput;
  ctx: TContext;
};

export abstract class BaseEndpoint {
  abstract execute(opts: EndpointParam<unknown, Context>): unknown;

  static createEndpoint<T extends BaseEndpoint>(
    constructable: Constructable<T>,
  ) {
    return (opts: Parameters<T['execute']>[0]) => {
      const instance = opts.ctx.container.get<T>(constructable);
      return instance.execute(opts) as ReturnType<T['execute']>;
    };
  }
}
