cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 玩家昵称
        var playerInfo = cc.sys.localStorage.getItem('playerInfo')
        this.node.getComponent('cc.Label').string = playerInfo.nickname + ''
    },

    // update (dt) {},
});
