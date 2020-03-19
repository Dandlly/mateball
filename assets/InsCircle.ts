const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    circlePrefab: cc.Prefab = null;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        for (let index = 0; index < 50; index++) {
            let circleNode = cc.instantiate(this.circlePrefab);
            this.node.addChild(circleNode);

        }
    }

}
