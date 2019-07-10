cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 玩家头像
        var playerInfo = cc.sys.localStorage.getItem('playerInfo')
        this.node.getComponent('avatarContainer').setAvatarImageFromUrl(playerInfo.avatar)
    },

    // update (dt) {},
});
