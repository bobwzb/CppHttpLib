import UserData from "../../data/userData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WxHttpRequest {
	public static HTTP_METHOD_GET: string = "GET";
	public static HTTP_METHOD_POST: string = "POST";
	public static HTTP_METHOD_PUT: string = "PUT";
	public static HTTP_METHOD_DELETE: string = "DELETE";
	public static HTTP_HEADER_PB: string = "headerPb";
	public static HTTP_HEADER_IDE: string = "headerIde";

	protected url: string = "";
	protected method: string = "GET";
	protected header: Object = {
		"content-type": "application/json",
		"X-Auth-Token": UserData.token
	};
	protected headerPb: Object = {
		"content-type": "application/x-protobuf",
		"X-Auth-Token": UserData.token
	};
	protected headerIde: Object = {
		"content-type": "application/json",
		"X-Auth-Token": UserData.token,
		"X-IDEMPOTENCY-TOKEN": "fd89dd"
	};

	randomString(len) {
		len = len || 32;
		var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
		var maxPos = $chars.length;
		var pwd = "";
		for (let i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	}

	protected data: any = {};

	onSuccess: (this: WxHttpRequest, result: any) => any;
	onFailed: (this: WxHttpRequest, errorMsg: any) => any;

	/**
	 * 请求成功回调
	 * @param result respones结果
	 */
	protected onSuccessHandle(result: any) {
		if (this.onSuccess) {
			this.onSuccess(result);
		}
	}

	/**
	 * 请求失败
	 * @param code 错误码
	 * @param errorMsg 错误信息
	 */
	protected onFailedHandle(errorMsg: any) {
		if (this.onFailed) {
			this.onFailed(errorMsg);
		}
	}

	/**
	 *
	 * @param url 请求地址
	 * @param method 方法，暂支持 GET / POST
	 * @param params 请求参数，json格式的string
	 */
	public start(
		url?: string,
		method?: string,
		data?: string | object | ArrayBuffer,
		header?: string
	) {
		// let thisObj: WxHttpRequest = this;
		let self = this;
		if (url) {
			this.url = url;
		}
		if (method) {
			this.method = method;
		}
		if (data) {
			this.data = data;
		}
		if (header == "headerPb") {
			this.header = self.headerPb;
		}
		if (header == "headerIde") {
			this.header = self.headerIde;

			this.header["X-IDEMPOTENCY-TOKEN"] = self.randomString(8);
		}

		// let self = this
		wx.request({
			url: this.url,
			data: this.data,
			header: this.header,
			method: this.method,
			success(res) {
				self.onSuccessHandle(res);
			},
			fail(res) {
				self.onFailedHandle(res);
			}
		});
	}
}
