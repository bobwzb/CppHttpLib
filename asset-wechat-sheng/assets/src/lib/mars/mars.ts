import { pb } from "../../asset.pb";

export const HEAD_LENGTH = 20;
const CLIENT_VERSION = 1;

export enum ParseErrorKind {
	// 如果 buffer 大小还不到 HEAD_LENGTH 的话，就会抛出这个错误
	HEADER_LENGTH_NOT_ENOUGH,
	// 如果 BUFFER 大小 > HEAD_LENGTH 但是小于 HEAD_LENGTH + bodyLength 的话
	// 就会抛出这个错误
	INCORRECT_BUFFER_LENGTH
}

export class ParseError extends Error {
	kind: ParseErrorKind;

	constructor(kind: ParseErrorKind, msg?: string) {
		super(msg);
		this.kind = kind;
	}
}

export class Header {
	readonly headLength: number;
	readonly clientVersion: number;
	readonly cmdId: pb.common.CmdID;
	readonly seq: number;
	readonly bodyLength: number;

	constructor(
		clientVersion: number,
		cmdId: pb.common.CmdID,
		seq: number,
		bodyLength: number
	) {
		this.headLength = HEAD_LENGTH;
		this.clientVersion = clientVersion;
		this.cmdId = cmdId;
		this.seq = seq;
		this.bodyLength = bodyLength;
	}

	// 把这个 header 写入对应 buffer
	// 会修改 buffer 前 20 个字节的数据
	writeToBuf(buf: ArrayBuffer): void {
		let view = new DataView(buf);
		view.setInt32(0, this.headLength);
		view.setInt32(4, this.clientVersion);
		view.setInt32(4 * 2, this.cmdId);
		view.setInt32(4 * 3, this.seq);
		view.setInt32(4 * 4, this.bodyLength);
	}

	// 从 array buffer 尝试解析 Mars 消息头，
	// buffer 至少应该有 20 bytes，如果没有 20 bytes 抛出 ParseError 错误，且 Kind
	// 为 HEADER_LENGTH_NOT_ENOUGH
	// 否则返回 Header 对象
	static parse(buf: ArrayBuffer): Header | null {
		if (buf.byteLength < 20) {
			throw new ParseError(ParseErrorKind.HEADER_LENGTH_NOT_ENOUGH);
		}
		let view = new DataView(buf);
		let clientVersion = view.getInt32(4);
		let cmdId = view.getInt32(4 * 2);
		let seq = view.getInt32(4 * 3);
		let bodyLength = view.getInt32(4 * 4);
		return new Header(clientVersion, cmdId, seq, bodyLength);
	}
}

export class Message {
	readonly header: Header;
	readonly body: Uint8Array;

	constructor(header: Header, body: Uint8Array) {
		this.header = header;
		this.body = body;
	}

	// 返回这个消息的长度，单位为 byte
	length(): number {
		return HEAD_LENGTH + this.header.bodyLength;
	}

	// 把 Message 转成二进制模式
	encode(): ArrayBuffer {
		let buf = new ArrayBuffer(this.length());
		this.header.writeToBuf(buf);
		let u8arr = new Uint8Array(buf, HEAD_LENGTH).set(this.body);
		return buf;
	}

	// 从一个 ArrayBuffer 里面解码 header 和 body
	// 解码出错抛出 ParseError
	static decode(buf: ArrayBuffer): Message | null {
		if (buf.byteLength < 20) {
			throw new ParseError(ParseErrorKind.HEADER_LENGTH_NOT_ENOUGH);
		}
		let header = Header.parse(buf);
		if (header === null) {
			return null;
		}
		if (buf.byteLength !== HEAD_LENGTH + header.bodyLength) {
			return null;
		}
		return new Message(header, new Uint8Array(buf).slice(HEAD_LENGTH));
	}
}

export type MarsEventHandler = (msg: MarsEvent) => void;

interface MessageEvent {
	data: string | ArrayBuffer;
}

export interface IMarsConn {
	close(code?: number, reason?: string): void;
	onmessage(handle: MarsEventHandler): void;
	sendRequest(cmdId: pb.common.CmdID, content: Uint8Array): Promise<Message>;
	sendHeartBeat(): void;
}

enum MarsConnEventType {
	MESSAGE = "message"
}

export class MarsEvent extends cc.Event {
	message: Message;

	constructor(type: string, msg: Message) {
		super(type, false);
		this.message = msg;
	}
}

export class MarsConn implements IMarsConn {
	private wsConn: WebSocket;
	private seq: number;
	private eventTarget: cc.EventTarget;

	constructor(wsConn: WebSocket) {
		this.wsConn = wsConn;
		this.seq = 0;
		this.eventTarget = new cc.EventTarget();
		this.wsConn.onmessage = e => {
			this.handleWSMsgThenDispatch(e);
		};
	}

	close(code?: number, reason?: string): void {
		return this.wsConn.close(code, reason);
	}

	// 注册一个收到消息的回调，
	// 可以同时注册多个回调
	onmessage(handle: MarsEventHandler): void {
		this.eventTarget.on(MarsConnEventType.MESSAGE, handle);
	}

	// 发送心跳包，每调用一次发一个，
	// 心跳间隔不能大于 45s （推荐 10s 发一个心跳）
	sendHeartBeat(): void {
		this.sendRequest(pb.common.CmdID.HEARBEAT, new Uint8Array(0));
	}

	sendRequest(cmdId: pb.common.CmdID, content: Uint8Array): Promise<Message> {
		let header = new Header(
			CLIENT_VERSION,
			cmdId,
			this.seq,
			content.byteLength
		);
		return this.send(new Message(header, content));
	}

	private handleWSMsgThenDispatch(event: MessageEvent): Message {
		if (typeof event.data === "string") {
			console.error("expected binary message");
			return;
		}
		try {
			let message = Message.decode(event.data);
			let e = new MarsEvent(MarsConnEventType.MESSAGE, message);
			this.eventTarget.dispatchEvent(e);
		} catch (e) {
			console.error(e);
			return;
		}
	}

	// 请使用上面的 sendRequest 方法
	private send(msg: Message): Promise<Message> {
		return new Promise((resolve, _) => {
			let handle = (event: MarsEvent) => {
				if (event.message.header.seq !== msg.header.seq) {
					return;
				}
				// 收到对应 seq 事件的 message，先把自己从 EventHandler 里面移除
				this.eventTarget.off(MarsConnEventType.MESSAGE, handle);
				resolve(event.message);
			};
			this.eventTarget.on(MarsConnEventType.MESSAGE, handle);
			this.wsConn.send(msg.encode());
			this.seq += 1;
		});
	}
}
