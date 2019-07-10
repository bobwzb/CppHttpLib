export class LoadResData {
	public path: string;
	public modleName: string;
	public resType: any;
	public data: any;

	/**
	 * 释放资源
	 */
	public release() {
		cc.loader.releaseRes(this.path);
		this.data = null;
	}
}

// 加载列队
export class LoadResQueue {
	public datas: Array<LoadResData>;
	public progressCallback?: (percent: number) => void;
	public completeCallback?: (error: Error) => void;

	//同时加载的个数
	private static MaxLoadingCount: number = 2;
	private curIndex: number = 0;
	private curLoadingCount: number = 0;
	private completeCount: number = 0;

	/**
	 * 开始加载
	 */
	public start(): void {
		this.curIndex = 0;
		this.loadNext();
	}

	private onCompleteOne() {
		this.completeCount++;
		this.curLoadingCount--;

		if (this.completeCount >= this.datas.length) {
			if (this.completeCallback) {
				this.completeCallback(null);
			}

			return;
		}

		this.curIndex++;
		this.loadNext();
	}

	private loadNext(): void {
		let len: number = this.datas.length;
		if (this.curIndex < len) {
			let data: LoadResData = this.datas[this.curIndex];
			if (ResManager.instance.getRes(data.path)) {
				if (this.progressCallback) {
					this.progressCallback(1 / len + this.completeCount / len);
				}
				this.curLoadingCount++;
				this.onCompleteOne();
				return;
			} else {
				let self: LoadResQueue = this;

				const progressFunc = function(
					completedCount: number,
					totalCount: number,
					item: any
				): void {
					const percent: number =
						completedCount / totalCount / len + self.completeCount / len;
					if (self.progressCallback) {
						self.progressCallback(percent);
					}
				};

				const completeFunc = function(err: Error, res: any) {
					if (err) {
						if (self.completeCallback) {
							self.completeCallback(err);
						}
					} else {
						data.data = res;
						ResManager.instance.addRes(data);
						self.onCompleteOne();
					}
				};

				if (data.resType) {
					cc.loader.loadRes(
						data.path,
						data.resType,
						progressFunc,
						completeFunc
					);
				} else {
					cc.loader.loadRes(data.path, progressFunc, completeFunc);
				}
			}

			this.curLoadingCount++;
			if (this.curLoadingCount < LoadResQueue.MaxLoadingCount) {
				this.curIndex++;
				this.loadNext();
			}
		}
	}
}

export default class ResManager {
	public static DEFAULT_MODULE_NAME: string = "KD_DEFAULT_MODULE";

	private static _instance: ResManager;

	public static get instance(): ResManager {
		if (!ResManager._instance) {
			ResManager._instance = new ResManager();
		}
		return ResManager._instance;
	}

	////////////////////////////////////////
	////////////////////////////////////////

	private allRes: { [key: string]: LoadResData } = {};
	/**
	 * 获取资源
	 * @param resPath 资源路径
	 */
	public getRes(resPath: string): any {
		if (this.allRes[resPath] && this.allRes[resPath].data) {
			return this.allRes[resPath].data;
		}
		return null;
	}

	/**
	 * 添加已经加载好的资源
	 * @param data
	 */
	public addRes(data: LoadResData) {
		if (data.data) {
			if (this.allRes[data.path]) {
				return this.allRes[data.path].release();
			}
			this.allRes[data.path] = data;
		}
	}

	/**
	 * 获取纹理集
	 * @param name
	 */
	public getSpriteAtlas(name: string): cc.SpriteAtlas {
		if (
			this.allRes[name] &&
			this.allRes[name].resType == cc.SpriteAtlas &&
			this.allRes[name].data
		) {
			return this.allRes[name].data;
		}
		return null;
	}

	/**
	 * 批量加载资源，采用列队加载，此方法不加载spriteFrame
	 * @param paths 资源的路径
	 * @param moduleName 模块名
	 */
	public loadRes(
		paths: Array<string>,
		moduleName?: string,
		resType?: any,
		progressCallback?: (percent: number) => void,
		completeCallback?: (error: Error) => void
	): void {
		const datas: Array<LoadResData> = [];
		moduleName = moduleName ? moduleName : ResManager.DEFAULT_MODULE_NAME;
		for (let i = 0; i < paths.length; i++) {
			const path = paths[i];
			const data: LoadResData = new LoadResData();
			data.path = path;
			data.modleName = moduleName;
			data.resType = resType;
			datas.push(data);
		}

		const queue: LoadResQueue = new LoadResQueue();
		queue.datas = datas;
		queue.progressCallback = progressCallback;
		queue.completeCallback = completeCallback;
		queue.start();
	}
}
