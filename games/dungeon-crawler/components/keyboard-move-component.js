import Engine from "../../../engine/engine.js"
import Collider from "../../../engine/geometry/collisions.js"
import Rectangle from "../../../engine/components/rectangle-geometry-component.js"
import DrawGeometryComponent from "../../../engine/components/draw-geometry-component.js";
import Keys from "../../../engine/keys.js";

export default  class KeyboardMoveComponent extends Engine.Component {
  constructor(gameObject, speed = 1) {
    super(gameObject);
    this.speed = speed;

  }

  update() {
    let rectangles = Engine.SceneManager.currentScene.children
                      .filter(element => {return element.name.startsWith("boundry") || element.name.startsWith("k") || element.name.startsWith("move")});

    let heroRectangle = this.gameObject.components.find(e => {return e instanceof Rectangle});

    if (Engine.Input.getKey("ArrowLeft") || Engine.Input.getKey('a')) {
      this.gameObject.transform.position.x -= 1 * this.speed;
      for (let r of rectangles){
        let boundry = r.components.find(e => {return e instanceof Rectangle})
        if (Collider.collision(boundry, heroRectangle)) {
          this.gameObject.transform.position.x += 1 * this.speed;

          if (boundry.gameObject.name.startsWith("move")){
            if (Engine.Input.getKey(" ")){
              boundry.gameObject.transform.position.x += 1 * this.speed;
              this.gameObject.transform.position.x += 1 * this.speed;
            } else {
              boundry.gameObject.transform.position.x += -1 * this.speed;
            }
          }
        }
      }

    }
    if (Engine.Input.getKey("ArrowRight") || Engine.Input.getKey('d')){
      this.gameObject.transform.position.x += 1 * this.speed;
      for (let r of rectangles){
        let boundry = r.components.find(e => {return e instanceof Rectangle})
        if (Collider.collision(boundry, heroRectangle)) {
          this.gameObject.transform.position.x -= 1 * this.speed;

          if (boundry.gameObject.name.startsWith("move")){
            if (Engine.Input.getKey(" ")){
              boundry.gameObject.transform.position.x += -1 * this.speed;
              this.gameObject.transform.position.x -= 1 * this.speed;
            } else {
              boundry.gameObject.transform.position.x += 1 * this.speed;
            }
          }
        }
      }

    }
    if (Engine.Input.getKey("ArrowUp") || Engine.Input.getKey('w')) {
      this.gameObject.transform.position.y -= 1 * this.speed;
      for (let r of rectangles){
        let boundry = r.components.find(e => {return e instanceof Rectangle})
        if (Collider.collision(boundry, heroRectangle)) {
          this.gameObject.transform.position.y += 1 * this.speed;
          
          if (boundry.gameObject.name.startsWith("move")){
            if (Engine.Input.getKey(" ")){
              boundry.gameObject.transform.position.y += 1 * this.speed;
              this.gameObject.transform.position.y += 1 * this.speed;
            } else {
              boundry.gameObject.transform.position.y += -1 * this.speed;
            }
          }
        }
      }


    }
    if (Engine.Input.getKey("ArrowDown") || Engine.Input.getKey('s')) {
      this.gameObject.transform.position.y += 1 * this.speed;
      for (let r of rectangles){
        let boundry = r.components.find(e => {return e instanceof Rectangle})
        if (Collider.collision(boundry, heroRectangle)) {
          this.gameObject.transform.position.y -= 1 * this.speed;

          if (boundry.gameObject.name.startsWith("move")){
            if (Engine.Input.getKey(" ")){
              boundry.gameObject.transform.position.y += -1 * this.speed;
              this.gameObject.transform.position.y -= 1 * this.speed;
            } else {
              boundry.gameObject.transform.position.y += 1 * this.speed;
            }
          }
        }
      }


    }
  }

}