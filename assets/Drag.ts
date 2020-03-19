import graphicsEffect from "./graphicsEffect";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Drag extends cc.Component {

    drawNode: cc.Node = null;

    @property
    isWall: Boolean = true;

    onLoad() {
        this.drawNode = cc.find('Canvas/gr');
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
    }

    // 触摸事件
    touchMoveEvent(event) {
        var delta = event.getDelta();
        // 触摸点移动
        this.node.x += delta.x;
        this.node.y += delta.y;
    }

    update() {
        if (this.isWall) {
            this.drawNode.getComponent(graphicsEffect).draw();
        }
    }

}
