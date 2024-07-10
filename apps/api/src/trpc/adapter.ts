import { Constructable } from 'typedi';
import { Context } from './types';

type ResolveOptions<TInput, TContext extends Context> = {
  input: TInput;
  ctx: TContext;
};

type RunServiceFn = <
  TService,
  TResolveOptions extends ResolveOptions<unknown, Context>,
  TServiceCallFn extends (
    service: TService,
    opts: TResolveOptions,
  ) => ReturnType<TServiceCallFn>,
>(
  service: Constructable<TService>,
  serviceCall: TServiceCallFn,
) => (opts: TResolveOptions) => ReturnType<TServiceCallFn>;

/**
 * Resolver for running a serviceCall of a service managed by dependency injection
 * @param serviceType
 * @param serviceCall
 */
export const runEndpoint: RunServiceFn = (serviceType, serviceCall) => {
  return (opts) => {
    const serviceInstance = opts.ctx.container.get(serviceType);
    return serviceCall(serviceInstance, opts);
  };
};
