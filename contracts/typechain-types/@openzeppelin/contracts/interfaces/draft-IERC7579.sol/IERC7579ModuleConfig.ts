/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../../common";

export interface IERC7579ModuleConfigInterface extends Interface {
  getFunction(
    nameOrSignature: "installModule" | "isModuleInstalled" | "uninstallModule"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "ModuleInstalled" | "ModuleUninstalled"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "installModule",
    values: [BigNumberish, AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isModuleInstalled",
    values: [BigNumberish, AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "uninstallModule",
    values: [BigNumberish, AddressLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "installModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isModuleInstalled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uninstallModule",
    data: BytesLike
  ): Result;
}

export namespace ModuleInstalledEvent {
  export type InputTuple = [moduleTypeId: BigNumberish, module: AddressLike];
  export type OutputTuple = [moduleTypeId: bigint, module: string];
  export interface OutputObject {
    moduleTypeId: bigint;
    module: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ModuleUninstalledEvent {
  export type InputTuple = [moduleTypeId: BigNumberish, module: AddressLike];
  export type OutputTuple = [moduleTypeId: bigint, module: string];
  export interface OutputObject {
    moduleTypeId: bigint;
    module: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IERC7579ModuleConfig extends BaseContract {
  connect(runner?: ContractRunner | null): IERC7579ModuleConfig;
  waitForDeployment(): Promise<this>;

  interface: IERC7579ModuleConfigInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  installModule: TypedContractMethod<
    [moduleTypeId: BigNumberish, module: AddressLike, initData: BytesLike],
    [void],
    "nonpayable"
  >;

  isModuleInstalled: TypedContractMethod<
    [
      moduleTypeId: BigNumberish,
      module: AddressLike,
      additionalContext: BytesLike
    ],
    [boolean],
    "view"
  >;

  uninstallModule: TypedContractMethod<
    [moduleTypeId: BigNumberish, module: AddressLike, deInitData: BytesLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "installModule"
  ): TypedContractMethod<
    [moduleTypeId: BigNumberish, module: AddressLike, initData: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "isModuleInstalled"
  ): TypedContractMethod<
    [
      moduleTypeId: BigNumberish,
      module: AddressLike,
      additionalContext: BytesLike
    ],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "uninstallModule"
  ): TypedContractMethod<
    [moduleTypeId: BigNumberish, module: AddressLike, deInitData: BytesLike],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "ModuleInstalled"
  ): TypedContractEvent<
    ModuleInstalledEvent.InputTuple,
    ModuleInstalledEvent.OutputTuple,
    ModuleInstalledEvent.OutputObject
  >;
  getEvent(
    key: "ModuleUninstalled"
  ): TypedContractEvent<
    ModuleUninstalledEvent.InputTuple,
    ModuleUninstalledEvent.OutputTuple,
    ModuleUninstalledEvent.OutputObject
  >;

  filters: {
    "ModuleInstalled(uint256,address)": TypedContractEvent<
      ModuleInstalledEvent.InputTuple,
      ModuleInstalledEvent.OutputTuple,
      ModuleInstalledEvent.OutputObject
    >;
    ModuleInstalled: TypedContractEvent<
      ModuleInstalledEvent.InputTuple,
      ModuleInstalledEvent.OutputTuple,
      ModuleInstalledEvent.OutputObject
    >;

    "ModuleUninstalled(uint256,address)": TypedContractEvent<
      ModuleUninstalledEvent.InputTuple,
      ModuleUninstalledEvent.OutputTuple,
      ModuleUninstalledEvent.OutputObject
    >;
    ModuleUninstalled: TypedContractEvent<
      ModuleUninstalledEvent.InputTuple,
      ModuleUninstalledEvent.OutputTuple,
      ModuleUninstalledEvent.OutputObject
    >;
  };
}
