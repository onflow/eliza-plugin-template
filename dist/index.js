var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/actions/sampleAction.ts
import { z } from "zod";
import { inject as inject3, injectable as injectable3 } from "inversify";
import { elizaLogger as elizaLogger3 } from "@elizaos/core";
import { property, globalContainer as globalContainer3, BaseInjectableAction } from "@elizaos-plugins/plugin-di";

// src/services/sampleService.ts
import { inject as inject2, injectable as injectable2 } from "inversify";
import { Service, elizaLogger as elizaLogger2, stringToUuid } from "@elizaos/core";
import { globalContainer as globalContainer2 } from "@elizaos-plugins/plugin-di";

// src/providers/sampleProvider.ts
import { inject, injectable } from "inversify";
import { elizaLogger } from "@elizaos/core";
import { globalContainer } from "@elizaos-plugins/plugin-di";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
function _ts_param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
__name(_ts_param, "_ts_param");
globalContainer.bind("DYNAMIC_DATA").toDynamicValue(async () => {
  return Promise.resolve({
    key: "value"
  });
});
var SampleProvider = class {
  static {
    __name(this, "SampleProvider");
  }
  dynamicData;
  _sharedInstance;
  constructor(dynamicData) {
    this.dynamicData = dynamicData;
  }
  // ---- Implementing the InjectableProvider interface ----
  async getInstance(_runtime) {
    if (!this._sharedInstance) {
      this._sharedInstance = {};
    }
    return this._sharedInstance;
  }
  // ---- Implementing the Provider interface ----
  async get(_runtime, _message, _state) {
    elizaLogger.log("Retrieving data in sampleProvider...");
    return `Shared instance data: ${JSON.stringify(this._sharedInstance)}
Dynamic data: ${JSON.stringify(this.dynamicData)}
`;
  }
};
SampleProvider = _ts_decorate([
  injectable(),
  _ts_param(0, inject("DYNAMIC_DATA")),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof Record === "undefined" ? Object : Record
  ])
], SampleProvider);
globalContainer.bind(SampleProvider).toSelf().inSingletonScope();

// src/services/sampleService.ts
function _ts_decorate2(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate2, "_ts_decorate");
function _ts_metadata2(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata2, "_ts_metadata");
function _ts_param2(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
__name(_ts_param2, "_ts_param");
var SampleService = class _SampleService extends Service {
  static {
    __name(this, "SampleService");
  }
  sampleProvider;
  runtime;
  intervalId;
  DEFAULT_INTERVAL;
  constructor(sampleProvider) {
    super(), this.sampleProvider = sampleProvider, this.runtime = null, this.intervalId = null, this.DEFAULT_INTERVAL = 15 * 60 * 1e3;
  }
  static get serviceType() {
    return "sample";
  }
  static isInitialized = false;
  async initialize(runtime) {
    if (_SampleService.isInitialized) {
      return;
    }
    this.runtime = runtime;
    this.startPeriodicTask();
    _SampleService.isInitialized = true;
    elizaLogger2.info("SampleService initialized and started periodic task");
  }
  // Method to get the number of active tasks
  getGlobalActiveTaskCount() {
    return _SampleService.activeTaskCount;
  }
  static activeTaskCount = 0;
  startPeriodicTask() {
    if (_SampleService.activeTaskCount > 0) {
      elizaLogger2.warn("SampleService: Periodic task already running, skipping");
      return;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    _SampleService.activeTaskCount++;
    elizaLogger2.info(`SampleService: Starting periodic task (active tasks: ${_SampleService.activeTaskCount})`);
    this.fetchSample();
    this.intervalId = setInterval(() => {
      this.fetchSample();
    }, this.DEFAULT_INTERVAL);
  }
  async fetchSample() {
    if (!this.runtime) {
      elizaLogger2.error("SampleService: Runtime not initialized");
      return;
    }
    try {
      const dummyMemory = {
        id: stringToUuid("sample-service-trigger"),
        userId: this.runtime.agentId,
        agentId: this.runtime.agentId,
        roomId: this.runtime.agentId,
        content: {
          text: "Periodic sample fetch"
        },
        createdAt: Date.now()
      };
      const dummyState = {
        userId: this.runtime.agentId,
        bio: "",
        lore: "",
        messageDirections: "",
        postDirections: "",
        roomId: this.runtime.agentId,
        actors: "",
        recentMessages: "",
        recentMessagesData: []
      };
      await this.sampleProvider.get(this.runtime, dummyMemory, dummyState);
      elizaLogger2.info("SampleService: Hello world");
      elizaLogger2.info("SampleService: Successfully fetched and processed sample");
    } catch (error) {
      elizaLogger2.error("SampleService: Error fetching sample:", error);
    }
  }
  // Method to stop the service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      _SampleService.activeTaskCount--;
      elizaLogger2.info(`SampleService stopped (active tasks: ${_SampleService.activeTaskCount})`);
    }
    _SampleService.isInitialized = false;
  }
  // Method to manually trigger a sample fetch (for testing)
  async forceFetch() {
    await this.fetchSample();
  }
};
SampleService = _ts_decorate2([
  injectable2(),
  _ts_param2(0, inject2(SampleProvider)),
  _ts_metadata2("design:type", Function),
  _ts_metadata2("design:paramtypes", [
    typeof SampleProvider === "undefined" ? Object : SampleProvider
  ])
], SampleService);
globalContainer2.bind(SampleService).toSelf().inSingletonScope();

// src/actions/sampleAction.ts
function _ts_decorate3(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate3, "_ts_decorate");
function _ts_metadata3(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata3, "_ts_metadata");
function _ts_param3(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
__name(_ts_param3, "_ts_param");
var CreateResourceContent = class {
  static {
    __name(this, "CreateResourceContent");
  }
  name;
  type;
  description;
  tags;
};
_ts_decorate3([
  property({
    description: "Name of the resource",
    schema: z.string()
  }),
  _ts_metadata3("design:type", String)
], CreateResourceContent.prototype, "name", void 0);
_ts_decorate3([
  property({
    description: "Type of resource (document, image, video)",
    schema: z.string()
  }),
  _ts_metadata3("design:type", String)
], CreateResourceContent.prototype, "type", void 0);
_ts_decorate3([
  property({
    description: "Description of the resource",
    schema: z.string()
  }),
  _ts_metadata3("design:type", String)
], CreateResourceContent.prototype, "description", void 0);
_ts_decorate3([
  property({
    description: "Array of tags to categorize the resource",
    schema: z.array(z.string())
  }),
  _ts_metadata3("design:type", Array)
], CreateResourceContent.prototype, "tags", void 0);
var options = {
  name: "CREATE_RESOURCE",
  similes: [],
  description: "Create a new resource with the specified details",
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Create a new resource with the name 'Resource1' and type 'TypeA'"
        }
      },
      {
        user: "{{agentName}}",
        content: {
          text: `Resource created successfully:
- Name: Resource1
- Type: TypeA`
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Create a new resource with the name 'Resource2' and type 'TypeB'"
        }
      },
      {
        user: "{{agentName}}",
        content: {
          text: `Resource created successfully:
- Name: Resource2
- Type: TypeB`
        }
      }
    ]
  ],
  contentClass: CreateResourceContent
};
var CreateResourceAction = class extends BaseInjectableAction {
  static {
    __name(this, "CreateResourceAction");
  }
  sampleProvider;
  sampleService;
  constructor(sampleProvider, sampleService) {
    super(options), this.sampleProvider = sampleProvider, this.sampleService = sampleService;
  }
  async validate(runtime, _message, _state) {
    return runtime.getSetting("API_KEY") !== void 0;
  }
  async execute(content, runtime, message, state, callback) {
    if (!content) {
      const error = "No content provided for the action.";
      elizaLogger3.warn(error);
      await callback?.({
        text: error
      }, []);
      return;
    }
    try {
      const taskCount = this.sampleService.getGlobalActiveTaskCount();
      elizaLogger3.info("Active task count:", taskCount);
      const result = await this.sampleProvider.get(runtime, message, state);
      if (!result) {
        elizaLogger3.warn("Provider did not return a result.");
      } else {
        elizaLogger3.info("Privder result:", result);
      }
    } catch (error) {
      elizaLogger3.error("Provider error:", error);
    }
    callback?.({
      text: `Resource created successfully:
- Name: ${content.name}
- Type: ${content.type}
- Description: ${content.description}
- Tags: ${content.tags.join(", ")}

Resource has been stored in memory.`
    }, []);
  }
};
CreateResourceAction = _ts_decorate3([
  injectable3(),
  _ts_param3(0, inject3(SampleProvider)),
  _ts_param3(1, inject3(SampleService)),
  _ts_metadata3("design:type", Function),
  _ts_metadata3("design:paramtypes", [
    typeof SampleProvider === "undefined" ? Object : SampleProvider,
    typeof SampleService === "undefined" ? Object : SampleService
  ])
], CreateResourceAction);
globalContainer3.bind(CreateResourceAction).toSelf().inRequestScope();

// src/actions/sampleFlowAction.ts
import { z as z2 } from "zod";
import { injectable as injectable4 } from "inversify";
import { elizaLogger as elizaLogger4 } from "@elizaos/core";
import { globalContainer as globalContainer4, property as property2 } from "@elizaos-plugins/plugin-di";
import { BaseFlowInjectableAction, scripts as defaultFlowScripts } from "@elizaos-plugins/plugin-flow";
function _ts_decorate4(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate4, "_ts_decorate");
function _ts_metadata4(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata4, "_ts_metadata");
var ActionContentDef = class {
  static {
    __name(this, "ActionContentDef");
  }
  vm;
};
_ts_decorate4([
  property2({
    description: "This field should be Cadence or EVM",
    examples: [
      "If use mentioned Flow native token or smart contract, the field should be Cadence",
      "Otherwise, the field should be EVM"
    ],
    schema: z2.string()
  }),
  _ts_metadata4("design:type", String)
], ActionContentDef.prototype, "vm", void 0);
var actionOpts = {
  name: "CREATE_RESOURCE_FOR_FLOW",
  similes: [],
  description: "Create a new resource with the specified details",
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Create a new resource on Flow Cadence with the following details",
          action: "CREATE_RESOURCE_FOR_FLOW"
        }
      }
    ]
  ],
  contentClass: ActionContentDef,
  suppressInitialMessage: false
};
var SampleFlowAction = class extends BaseFlowInjectableAction {
  static {
    __name(this, "SampleFlowAction");
  }
  constructor() {
    super(actionOpts);
  }
  /**
   * Validate if the action can be executed
   */
  async validate(_runtime, message, _state) {
    const keywords = [
      "resource",
      "\u8D44\u6E90"
    ];
    return keywords.some((keyword) => message.content.text.toLowerCase().includes(keyword.toLowerCase()));
  }
  /**
   * Execute the action
   *
   * @param content the content from processMessages
   * @param callback the callback function to pass the result to Eliza runtime
   * @returns the transaction response
   */
  async execute(content, runtime, _message, _state, callback) {
    if (!content) {
      elizaLogger4.warn("No content generated");
      return;
    }
    elizaLogger4.log(`Starting ${this.name} handler...`);
    const resp = {
      ok: false
    };
    const agentWalletAddress = runtime.getSetting("FLOW_ADDRESS");
    let data;
    try {
      data = await this.walletSerivce.executeScript(defaultFlowScripts.mainGetAccountInfo, (arg, t) => [
        arg(agentWalletAddress, t.Address)
      ], "");
    } catch (err) {
      resp.error = err.message;
    }
    if (data) {
      resp.ok = true;
      resp.data = JSON.stringify(data);
    } else {
      resp.error = resp.error ?? "Unknown error";
    }
    if (!resp.ok) {
      elizaLogger4.error("Error:", resp.error);
      callback?.({
        text: `Unable to load balance of wallet ${agentWalletAddress}`,
        content: {
          error: resp.error ?? "Unknown error"
        },
        source: "FlowBlockchain"
      });
    }
    callback?.({
      text: `Resource created successfully at VM: ${content.vm}`,
      source: "FlowBlockchain"
    });
    elizaLogger4.log(`Finished ${this.name} handler.`);
  }
};
SampleFlowAction = _ts_decorate4([
  injectable4(),
  _ts_metadata4("design:type", Function),
  _ts_metadata4("design:paramtypes", [])
], SampleFlowAction);
globalContainer4.bind(SampleFlowAction).toSelf().inRequestScope();

// src/samplePlugin.ts
var samplePlugin = {
  name: "sample",
  description: "Enables creation and management of generic resources",
  actions: [
    CreateResourceAction
  ],
  providers: [
    SampleProvider
  ],
  services: [
    SampleService
  ],
  evaluators: [],
  clients: []
};

// src/sampleFlowPlugin.ts
import { FlowWalletService } from "@elizaos-plugins/plugin-flow";
var sampleFlowPlugin = {
  name: "sample",
  description: "Enables creation and management of generic resources",
  actions: [
    CreateResourceAction,
    SampleFlowAction
  ],
  providers: [
    SampleProvider
  ],
  services: [
    SampleService,
    FlowWalletService
  ],
  evaluators: [],
  clients: []
};

// src/index.ts
var index_default = samplePlugin;
export {
  ActionContentDef,
  CreateResourceAction,
  CreateResourceContent,
  SampleFlowAction,
  SampleProvider,
  SampleService,
  index_default as default,
  sampleFlowPlugin,
  samplePlugin
};
//# sourceMappingURL=index.js.map