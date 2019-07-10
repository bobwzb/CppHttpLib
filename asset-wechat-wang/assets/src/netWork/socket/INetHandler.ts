export interface INetHandler {
	handle(cmd: number, body?: any): boolean;

	name(): string;
}
