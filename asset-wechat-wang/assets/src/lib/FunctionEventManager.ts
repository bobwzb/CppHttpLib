const { ccclass, property } = cc._decorator;
/**简单封装的handler,一般用来做回调使用 */
export class KdHandler {
	/**
	 * 构造
	 * @param func 回调函数
	 * @param target thisArg
	 * @param args 	附带参数
	 */
	constructor(func: Function, target: any, ...args) {
		this.func = func;
		this.target = target;
		this.args = args;
	}

	/**处理方法 */
	public func: Function;
	/**附带参数 */
	public args: any[];
	/**thisArg */
	public target: any;

	/**执行处理 */
	public execute() {
		if (this.func != null) {
			this.func.apply(this.target, this.args);
		}
	}

	/**执行处理(增加数据参数)*/
	public executeWith(data?: any[]) {
		if (data == null || data == undefined) {
			return this.execute();
		}
		if (this.func != null) {
			this.func.apply(this.target, this.args ? this.args.concat(data) : data);
		}
	}
}

@ccclass
export default class FunctionEventManager {
	/**
	 * 单例对象
	 * */
	private static _instance: FunctionEventManager;

	/**
	 * 刷新管理类对象
	 * */
	public static get instance(): FunctionEventManager {
		if (this._instance == null) {
			this._instance = new FunctionEventManager();
		}
		return this._instance;
	}

	constructor() {
		this.funDic = new Object();
	}

	/****************************方法调用模式********************************/
	/**方法调用模式是指：对于一个事件虽然可以有多个触发者，但是同时只能有一个
	 * 响应者，响应者需要在接到消息触发后完成操作并给出返回值。
	 * 简单理解就是：A告诉B事件触发了，并等待B的返回值。**/

	/**
	 * 带返回值的方法列表
	 * */
	protected funDic: Object;

	/**
	 * 注册一个带返回值的方法,相同方法只允许注册一个!
	 * @param notify 事件类型
	 * @param fun 带返回值的方法
	 * @param target 一般传this过来
	 * */
	public addReturnEvent(notify: string, fun: Function, target: any) {
		if (fun == null || notify == null || notify == "") {
			return;
		}
		var f: KdHandler = this.funDic[notify] as KdHandler;
		if (f != null) {
			if (f.func == fun) {
				return;
			}
			console.log(
				"事件[" + notify + "]已经有一个注册方法了，现在又注册一个方法！"
			);
		} else {
			f = new KdHandler(fun, target);
		}
		this.funDic[notify] = f;
	}

	/**
	 * 注销一个带返回值的方法
	 * @param notify 事件类型
	 * @param fun 带返回值的方法
	 * @param target 可有可无(只是方便复制粘贴)
	 * */
	public removeReturnEvent(notify: string, fun: Function, target: any = null) {
		if (fun == null || notify == null || notify == "") {
			return;
		}
		var f: KdHandler = this.funDic[notify] as KdHandler;
		if (f == null || f.func == fun) {
			this.funDic[notify] = null;
			delete this.funDic[notify];
		}
	}

	/**
	 * 触发带返回值的方法
	 * @param notify 事件类型
	 * @param args 调用方法传递的参数
	 * */
	public notifyReturnFun(notify: string, ...args): any {
		if (notify == null || notify == "") {
			return null;
		}
		var fun: KdHandler = this.funDic[notify] as KdHandler;
		if (fun != null) {
			return fun.func.apply(fun.target, args);
		}
		return null;
	}
}
