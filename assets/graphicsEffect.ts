const { ccclass, property } = cc._decorator;

@ccclass
export default class graphicsEffect extends cc.Component {
    @property(cc.Node)
    targerParent: cc.Node = null;


    private _graphics: cc.Graphics;

    start() {
        this._graphics = this.getComponent(cc.Graphics);
        this.draw();
    }

    draw() {
        this._graphics.clear();
        var object = this.targerParent.children;
        // 单个节点（测试）
        // this.circleDrow(object[0].width / 2, object[1].width / 2, [object[0].x, object[0].y], [object[1].x, object[1].y]);
        // this.circleDrow(object[1].width / 2, object[2].width / 2, [object[1].x, object[1].y], [object[2].x, object[2].y]);
        // this.circleDrow(object[0].width / 2, object[2].width / 2, [object[0].x, object[0].y], [object[2].x, object[2].y]);

        // this.circleDrow(object[0], object[1]);
        // this.circleDrow(object[0], object[2]);
        // this.circleDrow(object[0], object[3]);
        // this.circleDrow(object[1], object[2]);
        // this.circleDrow(object[1], object[2]);
        for (let index = 0; index < object.length; index++) {
            for (let count = index + 1; count < object.length; count++) {
                this.circleDrow(object[index], object[count]);
            }
        }

        // 填充;
        this._graphics.fillColor = cc.color(210, 72, 253);
        this._graphics.fill();
    }

    // circleDrow(radius1, radius2, center1, center2) {
    circleDrow(oneNode, twoNode) {
        const path = this.metaball(oneNode.width / 2, twoNode.width / 2, [oneNode.x, oneNode.y], [twoNode.x, twoNode.y]);

        if (path && path[8] == 1) {
            // 需要先给节点绑定cc.this._graphics组件
            this._graphics.moveTo(path[0][0], path[0][1]);
            this._graphics.lineTo(path[1][0], path[1][1]);
            this._graphics.bezierCurveTo(path[5][0], path[5][1], path[7][0], path[7][1], path[3][0], path[3][1]);
            this._graphics.lineTo(path[3][0], path[3][1]);
            this._graphics.lineTo(path[2][0], path[2][1]);
            this._graphics.bezierCurveTo(path[6][0], path[6][1], path[4][0], path[4][1], path[0][0], path[0][1]);
            this._graphics.lineTo(path[0][0], path[0][1]);
            this._graphics.close(); // 组成一个封闭的路径
        }
    }

    metaball(radius1, radius2, center1, center2, handleSize = 2.4, v = 0.5) {
        const HALF_PI = Math.PI / 2;
        // 求出两个圆的距离
        const d = this.dist(center1, center2);
        const maxDist = radius1 + radius2 * 2.5;
        let u1, u2;

        if (radius1 === 0 || radius2 === 0 || d > maxDist || d <= Math.abs(radius1 - radius2)) {
            return '';
        }

        if (d < radius1 + radius2) {
            u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d));
            u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d));
        }
        else {
            u1 = 0; u2 = 0;
        }

        const angleBetweenCenters = this.angle(center2, center1);
        const maxSpread = Math.acos((radius1 - radius2) / d);

        // 圆1（左）
        const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v;
        const angle2 = angleBetweenCenters - u1 - (maxSpread - u1) * v;
        // 圆2（右）
        const angle3 = angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v;
        const angle4 = angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v;

        // 点
        const p1 = this.getVector(center1, angle1, radius1);
        const p2 = this.getVector(center1, angle2, radius1);
        const p3 = this.getVector(center2, angle3, radius2);
        const p4 = this.getVector(center2, angle4, radius2);

        const totalRadius = radius1 + radius2;
        // 处理手柄长度的因子
        const d2Base = Math.min(v * handleSize, this.dist([p1[0], p1[1]], [p3[0], p3[1]]) / totalRadius);
        const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2));
        // 手柄长度
        const r1 = radius1 * d2;
        const r2 = radius2 * d2;

        const h1 = this.getVector([p1[0], p1[1]], angle1 - HALF_PI, r1);
        const h2 = this.getVector([p2[0], p2[1]], angle2 + HALF_PI, r1);

        const h3 = this.getVector([p3[0], p3[1]], angle3 + HALF_PI, r2);
        const h4 = this.getVector([p4[0], p4[1]], angle4 - HALF_PI, r2);




        return this.metaballToPath(p1, p2, p3, p4, h1, h2, h3, h4, d > radius1, radius2);
    }

    metaballToPath(p1, p2, p3, p4, h1, h2, h3, h4, escaped, r) {
        //C: 曲线  A：弧线  C 曲线
        // return ['M', p1, 'C', h1, h3, p3, 'A', r, r, 0, escaped ? 1 : 0, 0, p4, 'C', h4, h3, p4].join(' ');
        return [p1, p2, p3, p4, h1, h2, h3, h4, escaped ? 1 : 0, r];
    }

    dist([x1, y1], [x2, y2]) {
        return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
    }

    angle([x1, y1], [x2, y2]) {
        return Math.atan2(y1 - y2, x1 - x2);
    }

    getVector([cx, cy], a, r) {
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }

}
