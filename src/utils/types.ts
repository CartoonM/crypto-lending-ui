export interface EthereumProvider {
  request: (args: { method: string; params?: any[] | object }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
  [key: string]: any;
}
