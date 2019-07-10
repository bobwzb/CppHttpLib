const { ccclass, property, executionOrder } = cc._decorator;

@ccclass
@executionOrder(1)
export default class BasicScene extends cc.Component {
	onLoad() {
		// init logic
	}
}
