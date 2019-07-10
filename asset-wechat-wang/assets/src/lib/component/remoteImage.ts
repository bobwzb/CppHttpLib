import HttpControl from "../../netWork/http/HttpControl";

const { ccclass, property } = cc._decorator;

@ccclass
export class RemoteImage extends cc.Component {
	@property(cc.Sprite)
	imageSprite: cc.Sprite = null;

	public setImage(tex: cc.Texture2D) {
		this.imageSprite.spriteFrame = new cc.SpriteFrame(tex);
	}

	public getImageFromUrl(url: string): Promise<cc.Texture2D> {
		return new Promise((resolve, rejects) => {
			console.log("loading image from url", url);
			cc.loader.load(url, (err, tex) => {
				if (err !== null) {
					rejects(err);
					return;
				}
				resolve(tex);
			});
		});
	}

	public getImageForScenario(name: string): Promise<cc.Texture2D> {
		return this.getImageFromUrl(HttpControl.getScenarioImageUrl(name));
	}

	start() {}

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	// update (dt) {}
}
