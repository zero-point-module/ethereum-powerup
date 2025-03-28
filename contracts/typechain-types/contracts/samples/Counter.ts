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
} from "../../common";

export interface CounterInterface extends Interface {
  getFunction(nameOrSignature: "getNumber" | "setNumber"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "NumberChanged"): EventFragment;

  encodeFunctionData(functionFragment: "getNumber", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setNumber",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "getNumber", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setNumber", data: BytesLike): Result;
}

export namespace NumberChangedEvent {
  export type InputTuple = [oldNumber: BigNumberish, newNumber: BigNumberish];
  export type OutputTuple = [oldNumber: bigint, newNumber: bigint];
  export interface OutputObject {
    oldNumber: bigint;
    newNumber: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Counter extends BaseContract {
  connect(runner?: ContractRunner | null): Counter;
  waitForDeployment(): Promise<this>;

  interface: CounterInterface;

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

  getNumber: TypedContractMethod<[], [bigint], "view">;

  setNumber: TypedContractMethod<
    [newNumber: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getNumber"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "setNumber"
  ): TypedContractMethod<[newNumber: BigNumberish], [void], "nonpayable">;

  getEvent(
    key: "NumberChanged"
  ): TypedContractEvent<
    NumberChangedEvent.InputTuple,
    NumberChangedEvent.OutputTuple,
    NumberChangedEvent.OutputObject
  >;

  filters: {
    "NumberChanged(uint256,uint256)": TypedContractEvent<
      NumberChangedEvent.InputTuple,
      NumberChangedEvent.OutputTuple,
      NumberChangedEvent.OutputObject
    >;
    NumberChanged: TypedContractEvent<
      NumberChangedEvent.InputTuple,
      NumberChangedEvent.OutputTuple,
      NumberChangedEvent.OutputObject
    >;
  };
}
