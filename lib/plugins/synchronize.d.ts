import { Compiler } from 'webpack';
export declare const synchronize: () => Promise<void>;
export declare function watching(callback?: () => void): void;
export declare class SynchronizePlugin {
    apply(compiler: Compiler): void;
}
