const { ccclass, property } = cc._decorator;

/**字符串工具类 */
@ccclass
export default class StringUtils {
	/**
	 * 替换format字符串中的所有 %s
	 * 例如 printf('hello, %s!', 'dj') ==> 'hello, dj!'
	 */
	public static printf(format: string, ...params): string {
		var str: string = "";
		var subs: Array<string> = format.split(/%s/);

		var last: string = subs.pop();
		if (last != "") {
			subs.push(last);
		}

		let len: number = subs.length < params.length ? subs.length : params.length;
		let i = 0;
		for (i = 0; i < len; ++i) {
			str += subs[i] + params[i];
		}

		if (subs.length > len) {
			i = len;
			len = subs.length;
			for (; i < len; ++i) {
				str += subs[i];
			}
		}

		return str;
	}

	/**
	 * 忽略大小字母比较字符是否相等;
	 * */
	public static equalsIgnoreCase(char1: string, char2: string): boolean {
		return char1.toLowerCase() == char2.toLowerCase();
	}

	private static patternrtrim: RegExp = /\s*$/;

	/**
	 * 比较字符是否相等;
	 * */
	public static equals(char1: string, char2: string): boolean {
		return char1 == char2;
	}

	private static patternltrim: RegExp = /^\s*/;

	/**
	 * 去左右空格;
	 * */
	public static trim(char: string): string {
		if (char == null) {
			return null;
		}
		return StringUtils.rtrim(StringUtils.ltrim(char));
	}

	/**
	 * 去左空格;
	 * */
	public static ltrim(char: string): string {
		if (char == null) {
			return null;
		}

		return char.replace(StringUtils.patternltrim, "");
	}
	/**
	 * 去右空格;
	 * */
	public static rtrim(char: string): string {
		if (char == null) {
			return null;
		}

		return char.replace(StringUtils.patternrtrim, "");
	}

	/**
	 * 判断是否包含指定字符串
	 */
	public static searchString(char: string, str: string): boolean {
		if (char == null || str == null) {
			return false;
		}
		return char.search(str) != -1;
	}

	/**
	 * 是否是数值字符串;
	 * */
	public static isNumber(char: string): boolean {
		if (char == null) {
			return false;
		}
		return !isNaN(parseInt(char));
	}

	/**
	 * 替换指定位置字符;
	 * */
	public static replaceAt(
		char: string,
		value: string,
		beginIndex: number,
		endIndex: number
	): string {
		beginIndex = Math.max(beginIndex, 0);
		endIndex = Math.min(endIndex, char.length);
		var firstPart: String = char.substr(0, beginIndex);
		var secondPart: String = char.substr(endIndex, char.length);
		return firstPart + value + secondPart;
	}

	/**
	 * 删除指定位置字符;
	 * */
	public static removeAt(
		char: string,
		beginIndex: number,
		endIndex: number
	): string {
		return StringUtils.replaceAt(char, "", beginIndex, endIndex);
	}

	/**替换 */
	public static replace(
		char: string,
		replace: string,
		replaceWith: string
	): string {
		return char.split(replace).join(replaceWith);
	}

	/**移除 */
	public static remove(input: string, remove: string): String {
		return StringUtils.replace(input, remove, "");
	}

	/**富文本 颜色 */
	public static fontColor(info: string, color: string): string {
		return "<color=" + color + ">" + info + "</color>";
	}

	/**
	 * 通过时间获取时分秒（一般用来做倒计时）
	 * @param time 时间(单位秒)
	 * @param split 分割符（默认":"）
	 */
	public static doInverseTime(time: number, split: string = ":"): string {
		time = Math.round(time);
		var str: string = "";
		var second: number;
		var minute: number;
		var hour: number;
		if (time <= 0) {
			str = "00" + split + "00";
		} else {
			minute = Math.floor(time / 60);
			second = time % 60;
			if (minute <= 9) {
				str += "0" + minute + split;
			} else {
				str += minute + split;
			}
			if (second <= 9) {
				str += "0" + second;
			} else {
				str += second;
			}
		}
		return str;
	}

	/**
	 * 将Date默认格式化为  “2000年1月1日00:00:00的形式”
	 * @param time 时间戳(单位秒)
	 * @param splite  分隔符
	 */

	public static formateTimeTo(time: number, splite: string = ""): string {
		var date: Date = new Date();
		date.setTime(time * 1000);
		var hour: number = date.getHours();
		var minute: number = date.getMinutes();
		var second: number = date.getSeconds();
		var hourStr: string = hour < 10 ? "0" + hour : hour + "";
		var minuteStr: string = minute < 10 ? "0" + minute : minute + "";
		var secondStr: string = second < 10 ? "0" + second : second + "";
		if (splite == "") {
			return (
				date.getFullYear() +
				StringUtils.getNianStr() +
				(date.getMonth() + 1) +
				StringUtils.getYueStr() +
				date.getDate() +
				StringUtils.getRiStr() +
				" " +
				hourStr +
				":" +
				minuteStr +
				":" +
				secondStr
			);
		} else {
			return (
				date.getFullYear() +
				splite +
				(date.getMonth() + 1) +
				splite +
				date.getDate() +
				" " +
				hourStr +
				":" +
				minuteStr +
				":" +
				secondStr
			);
		}
		//return "";
	}

	/**
	 * 将时间转化为“01:00”的形式(time单位为毫秒)
	 * @param time
	 */
	public static formatTimeToMFromMs(time: number): string {
		var date: Date = new Date();
		date.setTime(time);
		var hour: number = date.getHours();
		var minute: number = date.getMinutes();
		var miao: number = date.getSeconds();
		var hourStr: string = hour < 10 ? "0" + hour : hour + "";
		var minuteStr: string = minute < 10 ? "0" + minute : minute + "";
		var miaoStr: string = miao < 10 ? "0" + miao : miao + "";
		return hourStr + ":" + minuteStr + ":" + miaoStr;
	}

	/**转换成中文数字 */
	public static num2Cn1(value: number): string {
		switch (value) {
			case 1: {
				return "一";
			}
			case 2: {
				return "二";
			}
			case 3: {
				return "三";
			}
			case 4: {
				return "四";
			}
			case 5: {
				return "五";
			}
			case 6: {
				return "六";
			}
			case 7: {
				return "七";
			}
			case 8: {
				return "八";
			}
			case 9: {
				return "九";
			}
			case 10: {
				return "十";
			}
			case 11: {
				return "十一";
			}
			case 12: {
				return "十二";
			}
			case 13: {
				return "十三";
			}
			case 14: {
				return "十四";
			}
			case 15: {
				return "十五";
			}
			case 16: {
				return "十六";
			}
		}
		return "";
	}

	public static getDotInt(num: string): string {
		let strArr: string[] = num.split(".");

		let str: string = strArr[0];
		let postfix: string =
			strArr.length > 1 && Number(strArr[1]) > 0 ? strArr[1] : "";
		let dotStr = "";
		let len = str.length;
		for (let i = len - 1; i >= 0; i--) {
			if ((len - i - 1) % 3 == 0 && len - i > 1) {
				dotStr = "," + dotStr;
			}
			dotStr = str.charAt(i) + dotStr;
		}

		if (postfix != "") {
			dotStr += "." + postfix;
		}
		return dotStr;
	}

	public static getNianStr(): string {
		return "年";
	}
	public static getYueStr(): string {
		return "月";
	}
	public static getRiStr(): string {
		return "日";
	}

	public static encode(str: string): Uint8Array {
		return new UTF8().encode(str);
	}

	/**
	 * 数字分隔
	 */
	public static ConvertInt2(num: any): string {
		let strMinus: string = num >= 0 ? "" : "-";
		num = Math.abs(Number(num));
		if (num > 100000000) {
			if (num % 10) {
				num = (num / 100000000).toFixed(2) + "万";
			} else {
				num = num / 100000000 + "万";
			}
		} else if (num >= 10000) {
			if (num % 10) {
				num = (num / 10000).toFixed(2) + "万";
			} else {
				num = num / 10000 + "万";
			}
		} else {
			num = num + "";
		}
		return strMinus + num;
	}
}

export class UTF8 {
	private EOF_byte: number = -1;
	private EOF_code_point: number = -1;
	private encoderError(code_point) {
		console.error("UTF8 encoderError", code_point);
	}
	private decoderError(fatal, opt_code_point?): number {
		if (fatal) console.error("UTF8 decoderError", opt_code_point);
		return opt_code_point || 0xfffd;
	}
	private inRange(a: number, min: number, max: number) {
		return min <= a && a <= max;
	}
	private div(n: number, d: number) {
		return Math.floor(n / d);
	}
	private stringToCodePoints(string: string) {
		/** @type {Array.<number>} */
		let cps = [];
		// Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
		let i = 0,
			n = string.length;
		while (i < string.length) {
			let c = string.charCodeAt(i);
			if (!this.inRange(c, 0xd800, 0xdfff)) {
				cps.push(c);
			} else if (this.inRange(c, 0xdc00, 0xdfff)) {
				cps.push(0xfffd);
			} else {
				// (inRange(c, 0xD800, 0xDBFF))
				if (i == n - 1) {
					cps.push(0xfffd);
				} else {
					let d = string.charCodeAt(i + 1);
					if (this.inRange(d, 0xdc00, 0xdfff)) {
						let a = c & 0x3ff;
						let b = d & 0x3ff;
						i += 1;
						cps.push(0x10000 + (a << 10) + b);
					} else {
						cps.push(0xfffd);
					}
				}
			}
			i += 1;
		}
		return cps;
	}

	public encode(str: string): Uint8Array {
		let pos: number = 0;
		let codePoints = this.stringToCodePoints(str);
		let outputBytes = [];

		while (codePoints.length > pos) {
			let code_point: number = codePoints[pos++];

			if (this.inRange(code_point, 0xd800, 0xdfff)) {
				this.encoderError(code_point);
			} else if (this.inRange(code_point, 0x0000, 0x007f)) {
				outputBytes.push(code_point);
			} else {
				let count = 0,
					offset = 0;
				if (this.inRange(code_point, 0x0080, 0x07ff)) {
					count = 1;
					offset = 0xc0;
				} else if (this.inRange(code_point, 0x0800, 0xffff)) {
					count = 2;
					offset = 0xe0;
				} else if (this.inRange(code_point, 0x10000, 0x10ffff)) {
					count = 3;
					offset = 0xf0;
				}

				outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);

				while (count > 0) {
					let temp = this.div(code_point, Math.pow(64, count - 1));
					outputBytes.push(0x80 + (temp % 64));
					count -= 1;
				}
			}
		}
		return new Uint8Array(outputBytes);
	}
}
