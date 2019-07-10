/**
 * @public
 */
export class BinaryDecoder {
	private dataView: DataView;
	constructor(public arrayBuffer: ArrayBuffer, public index = 0) {
		this.dataView = new DataView(arrayBuffer);
	}

	public getInt8() {
		const result = this.dataView.getInt8(this.index);
		this.index += 1;
		return result;
	}
	public getUint8() {
		const result = this.dataView.getUint8(this.index);
		this.index += 1;
		return result;
	}

	public getInt16(littleEndian = true) {
		const result = this.dataView.getInt16(this.index, littleEndian);
		this.index += 2;
		return result;
	}
	public getUint16(littleEndian = true) {
		const result = this.dataView.getUint16(this.index, littleEndian);
		this.index += 2;
		return result;
	}

	public getInt32(littleEndian = true) {
		const result = this.dataView.getInt32(this.index, littleEndian);
		this.index += 4;
		return result;
	}
	public getUint32(littleEndian = true) {
		const result = this.dataView.getUint32(this.index, littleEndian);
		this.index += 4;
		return result;
	}
	public getFloat32(littleEndian = true) {
		const result = this.dataView.getFloat32(this.index, littleEndian);
		this.index += 4;
		return result;
	}
	public getFloat64(littleEndian = true) {
		const result = this.dataView.getFloat64(this.index, littleEndian);
		this.index += 8;
		return result;
	}

	public getString(length?: number) {
		const binary = this.getBinary(length);
		const array = [].slice.call(binary);
		return String.fromCharCode(...array);
	}

	public getBinary(length?: number) {
		if (length === undefined) {
			const result = new Uint8Array(this.arrayBuffer, this.index);
			this.index = this.arrayBuffer.byteLength;
			return result;
		} else {
			const result = new Uint8Array(this.arrayBuffer, this.index, length);
			this.index += length;
			return result;
		}
	}
}

/**
 * @public
 */
export const BinaryEncoder = {
	fromInt8(...values: number[]) {
		return new Uint8Array(new Int8Array(values).buffer);
	},
	fromUint8(...values: number[]) {
		return new Uint8Array(values);
	},
	fromInt16(littleEndian: boolean, ...values: number[]) {
		const offset = 2;
		const dataView = new DataView(
			new Uint8Array(values.length * offset).buffer
		);
		for (let i = 0; i < values.length; i++) {
			dataView.setInt16(i * offset, values[i], littleEndian);
		}
		return new Uint8Array(dataView.buffer);
	},
	fromUint16(littleEndian: boolean, ...values: number[]) {
		const offset = 2;
		const dataView = new DataView(
			new Uint8Array(values.length * offset).buffer
		);
		for (let i = 0; i < values.length; i++) {
			dataView.setUint16(i * offset, values[i], littleEndian);
		}
		return new Uint8Array(dataView.buffer);
	},
	fromInt32(littleEndian: boolean, ...values: number[]) {
		const offset = 4;
		const dataView = new DataView(
			new Uint8Array(values.length * offset).buffer
		);
		for (let i = 0; i < values.length; i++) {
			dataView.setInt32(i * offset, values[i], littleEndian);
		}
		return new Uint8Array(dataView.buffer);
	},
	fromUint32(littleEndian: boolean, ...values: number[]) {
		const offset = 4;
		const dataView = new DataView(
			new Uint8Array(values.length * offset).buffer
		);
		for (let i = 0; i < values.length; i++) {
			dataView.setUint32(i * offset, values[i], littleEndian);
		}
		return new Uint8Array(dataView.buffer);
	},
	fromFloat32(littleEndian: boolean, ...values: number[]) {
		const offset = 4;
		const dataView = new DataView(
			new Uint8Array(values.length * offset).buffer
		);
		for (let i = 0; i < values.length; i++) {
			dataView.setFloat32(i * offset, values[i], littleEndian);
		}
		return new Uint8Array(dataView.buffer);
	},
	fromFloat64(littleEndian: boolean, ...values: number[]) {
		const offset = 8;
		const dataView = new DataView(
			new Uint8Array(values.length * offset).buffer
		);
		for (let i = 0; i < values.length; i++) {
			dataView.setFloat64(i * offset, values[i], littleEndian);
		}
		return new Uint8Array(dataView.buffer);
	},
	fromString(unicode: string) {
		const uint8Array = new Uint8Array(unicode.length);
		for (let i = 0; i < unicode.length; i++) {
			uint8Array[i] = unicode.charCodeAt(i);
		}
		return uint8Array;
	},
	concat(...uint8Arrays: Uint8Array[]) {
		const length = uint8Arrays.reduce((p, c) => p + c.length, 0);
		const result = new Uint8Array(length);
		let index = 0;
		for (const uint8Array of uint8Arrays) {
			result.set(uint8Array, index);
			index += uint8Array.length;
		}
		return result;
	}
};
