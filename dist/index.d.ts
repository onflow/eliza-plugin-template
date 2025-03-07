import { Provider, IAgentRuntime, Memory, State, Service, ServiceType, HandlerCallback } from '@elizaos/core';
import { InjectableProvider, BaseInjectableAction, PluginOptions } from '@elizaos-plugins/plugin-di';
import { BaseFlowInjectableAction, ScriptQueryResponse } from '@elizaos-plugins/plugin-flow';

/**
 * Sample Provider
 */
declare class SampleProvider implements InjectableProvider<Record<string, string>>, Provider {
    private readonly dynamicData;
    private _sharedInstance;
    constructor(dynamicData: Record<string, string>);
    getInstance(_runtime: IAgentRuntime): Promise<Record<string, string>>;
    get(_runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<string>;
}

declare module "@elizaos/core" {
    enum ServiceType {
        SAMPLE = "sample"
    }
}
declare class SampleService extends Service {
    private readonly sampleProvider;
    private runtime;
    private intervalId;
    private readonly DEFAULT_INTERVAL;
    constructor(sampleProvider: SampleProvider);
    static get serviceType(): ServiceType;
    private static isInitialized;
    initialize(runtime: IAgentRuntime): Promise<void>;
    getGlobalActiveTaskCount(): number;
    private static activeTaskCount;
    private startPeriodicTask;
    private fetchSample;
    stop(): void;
    forceFetch(): Promise<void>;
}

/**
 * The content class for the action
 */
declare class CreateResourceContent {
    name: string;
    type: string;
    description: string;
    tags: string[];
}
/**
 * CreateResourceAction
 */
declare class CreateResourceAction extends BaseInjectableAction<CreateResourceContent> {
    private readonly sampleProvider;
    private readonly sampleService;
    constructor(sampleProvider: SampleProvider, sampleService: SampleService);
    validate(runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<boolean>;
    execute(content: CreateResourceContent | null, runtime: IAgentRuntime, message: Memory, state: State, callback?: HandlerCallback): Promise<void>;
}

/**
 * The generated content for the transfer action
 */
declare class ActionContentDef {
    vm: string;
}
/**
 * Get price action
 *
 * @category Actions
 * @description Get the current price of FLOW token or stFLOW token
 */
declare class SampleFlowAction extends BaseFlowInjectableAction<ActionContentDef> {
    constructor();
    /**
     * Validate if the action can be executed
     */
    validate(_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean>;
    /**
     * Execute the action
     *
     * @param content the content from processMessages
     * @param callback the callback function to pass the result to Eliza runtime
     * @returns the transaction response
     */
    execute(content: ActionContentDef | null, runtime: IAgentRuntime, _message: Memory, _state?: State, callback?: HandlerCallback): Promise<ScriptQueryResponse | null>;
}

declare const samplePlugin: PluginOptions;

declare const sampleFlowPlugin: PluginOptions;

export { ActionContentDef, CreateResourceAction, CreateResourceContent, SampleFlowAction, SampleProvider, SampleService, samplePlugin as default, sampleFlowPlugin, samplePlugin };
