cc.Class({
    extends: cc.Component,

    properties: {
        coin_content: {
            type: cc.Node,
            default: null,
            tooltip: '金币总节点'
        },
        coins_fab: {
            type: cc.Prefab,
            default: null,
            tooltip: '所有金币预置体'
        },
        profit_node: {
            type: cc.Node,
            default:　null,
            tooltip: '盈利节点'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    onEnable () {
        this.coinItemList = []
        // 金币
        this.coin_action()
        
        // 2秒后把金币去掉 // 盈利闪现
        this.scheduleOnce(function () {
            this.coin_content.removeAllChildren()

            this.on_profit() // 盈利
        }.bind(this), 1.5)
    },

    coin_action: function () {
        var self = this
        for (var j = 0; j < 20; j++) {
			var node = cc.instantiate(this.coins_fab);
			node.active = false;
			this.coinItemList.push(node);
			this.coin_content.addChild(node);
        }
        //  = this.seatCtrl.playerSeats[0].node.position;
		// var formWorldPoint = cc.Vec2(-244, 467)
		var len = this.coinItemList.length;
		// var tempNode: cc.Node;
		// var toPoint: cc.Vec2;
        // var rotate: number = 0;
        var tempNode
		var toPoint
		var rotate = 0
		// var self: gameScene = this;
		for (var i = 0; i < len; i++) {
			tempNode = this.coinItemList[i];
			tempNode.active = true;
			tempNode.stopAllActions();
			toPoint = cc.v2(Math.random() * 300, Math.random() * 100 - 50);
			tempNode.position = toPoint;
			rotate = Math.random() * 90 - 45;
			tempNode.runAction(
				cc.spawn(
					cc.moveTo(1, cc.v2(-216, 530)),
					cc.rotateTo(1, rotate),
					// cc.scavaro(1, 0)
				)
			);
			tempNode.runAction(
				cc.sequence(
					cc.delayTime(1.1),
					cc.callFunc(function() {
						tempNode.removeFromParent();
						// tempNode.destroy();
						self.coinItemList = [];
					})
				)
			);
		}
    },

    on_profit: function () {
        // console.log(this.profit_node)
        this.profit_node.active = true
        var move = cc.fadeOut(0.8);

        this.scheduleOnce(function () {
            this.profit_node.runAction(move)
        }.bind(this), 1)

        this.scheduleOnce(function () {
            this.profit_node.active = false
            this.node.active = false
        }.bind(this), 2)
    },

    onDisable () {
        this.profit_node.opacity = 255;
    }

    // update (dt) {},
});
