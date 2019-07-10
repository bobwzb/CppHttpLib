const { ccclass, property } = cc._decorator;

@ccclass
export default class HttpRequest {
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
		// "X-Auth-Token": cc.sys.localStorage.getItem("X-Auth-Token")
		"X-Auth-Token": "e92b4c950f514d99846f41bb28b9ffc0"
	};
	protected headerPb: Object = {
		"content-type": "application/x-protobuf",
		// "X-Auth-Token": cc.sys.localStorage.getItem("X-Auth-Token")
		"X-Auth-Token": "e92b4c950f514d99846f41bb28b9ffc0"
	};
	protected headerIde: Object = {
		"content-type": "application/x-json",
		// "X-Auth-Token": cc.sys.localStorage.getItem("X-Auth-Token"),
		"X-Auth-Token": "e92b4c950f514d99846f41bb28b9ffc0",
		"X-IDEMPOTENCY-TOKEN": `fd89dd`
	};
	protected params: any = {};

	protected xhr: XMLHttpRequest;

	onSuccess: (this: HttpRequest, result: any) => any;
	onFailed: (this: HttpRequest, errorMsg: string) => any;

	/**
	 *
	 * @param url 请求地址
	 * @param method 方法，暂支持 GET / POST
	 */
	constructor(
		url?: string,
		method?: string,
		params?: string | object | ArrayBuffer
	) {
		this.url = url ? url : this.url;
		this.method = method ? method : HttpRequest.HTTP_METHOD_GET;
		this.params = params ? params : this.params;

		this.xhr = new XMLHttpRequest();

		let thisObj: HttpRequest = this;
		this.xhr.onreadystatechange = function() {
			// 这里的this 是xhr，而不是HttpRequest
			if (this.readyState == 4) {
				if (this.status >= 200 && this.status < 400) {
					var response = this.responseText;
					thisObj.onSuccessHandle(this.responseText);
				} else {
					thisObj.onFailedHandle(this.status, this.responseText);
				}
			}
		};
	}

	/**
	 * 请求成功回调
	 * @param result respones结果
	 */
	protected onSuccessHandle(result: string) {
		if (this.onSuccess) {
			this.onSuccess(result);
		}
	}

	/**
	 * 请求失败
	 * @param code 错误码
	 * @param errorMsg 错误信息
	 */
	protected onFailedHandle(code?: number, errorMsg?: string) {
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
		params?: string | object | ArrayBuffer,
		header?: string
	) {
		if (url) {
			this.url = url;
		}
		if (method) {
			this.method = method;
		}
		if (params) {
			this.params = JSON.stringify(params);
		}

		this.xhr.open(this.method, this.url, true);
		this.xhr.setRequestHeader("Content-Type", "application/json");
		this.xhr.setRequestHeader(
			"X-Auth-Token",
			"e92b4c950f514d99846f41bb28b9ffc0"
		);
		this.xhr.send(this.params);
	}
}
