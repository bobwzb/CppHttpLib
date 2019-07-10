import C2S from "../netWork/socket/C2S";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class investSelect extends cc.Component {
	onLoad() {}

	show() {
		this.node.active = true;
		RemoteAudio.getAudioByName(SoundName.CHOOSE_CHANCE).then(clip => {
			cc.audioEngine.playEffect(clip, false);
		});
	}

	hide() {
		this.node.active = false;
	}

	onBtLeft() {
		C2S.ChooseChanceReq(4);
	}

	onBtRight() {
		C2S.ChooseChanceReq(3);
	}

	onDestroy() {}
}
