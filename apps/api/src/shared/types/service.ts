export interface Service<TInput = unknown, TOutput = unknown> {
    execute(input: TInput): Promise<TOutput>
}

export interface ServiceWithMultipleParams<
    TInput1 = unknown,
    TInput2 = unknown,
    TInput3 = unknown,
    TOutput = unknown,
> {
    execute(input1: TInput1, input2: TInput2, input3: TInput3): Promise<TOutput>
}

export interface SimpleService<TInput = unknown, TOutput = unknown> {
    execute(input: TInput): Promise<TOutput>
}

export interface NoInputService<TOutput = unknown> {
    execute(): Promise<TOutput>
}
