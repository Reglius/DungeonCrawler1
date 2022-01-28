const SceneManager = Engine.SceneManager;

export default class MainControllerComponent extends Engine.Component {
  constructor(gameObject) {
    super(gameObject);
  }
  start() {
    this.hero = GameObject.Find("Hero");
    //this.hero = Engine.SceneManager.currentScene.getGameObject("Hero");
    
  }
  update() {

    let ground = GameObject.Find("Ground");
    let width = ground.getComponent("RectangleGeometryComponent").width;
    let height = ground.getComponent("RectangleGeometryComponent").height;
    
    this.heroX = this.hero.transform.position.x;
    this.heroY = this.hero.transform.position.y;
    let heroW = this.hero.getComponent("RectangleGeometryComponent").width;
    let heroH = this.hero.getComponent("RectangleGeometryComponent").height;
    this.speed = this.hero.getComponent("KeyboardMoveComponent").speed;

    // console.log("Ground x: " + ground.x + " y: " + ground.y + " width: " + width + " height: " + height);
    // console.log("Hero x: " + this.heroX + " y: " + this.heroY);
    
    if(this.heroX < -width/2 + heroW/2){
      //Move left
      if(SceneManager.currentScene.name == "MainScene") return SceneManager.changeScene("RedScene")
      if(SceneManager.currentScene.name == "BlueScene") return SceneManager.changeScene("MainScene")
      this.hero.transform.position.x += this.speed;
    }
    if(this.heroX > width/2 - heroW/2){
      //Move right
      if(SceneManager.currentScene.name == "MainScene") return SceneManager.changeScene("BlueScene")
      if(SceneManager.currentScene.name == "TrapScene") return SceneManager.changeScene("MainScene")

      this.hero.transform.position.x -= this.speed;
    }
    if(this.heroY < -height/2 + heroH/2){
      //Move up
      if(SceneManager.currentScene.name == "MainScene") return SceneManager.changeScene("WinScene")
      this.hero.transform.position.y += this.speed;
    }
    if(this.heroY > height/2 - heroH/2){
      //Move Down
      this.hero.transform.position.y -= this.speed;
    }
  
  }
}