import { EngineComponents } from "./engine.js";
import GameObject from "./game-object.js"
import SceneManager from "./scene-manager.js"
import Keys from "./keys.js"

export default class Scene {

    children = [];
    sceneName;

    static deserializeObject(objectDefinition, sceneStart = true) {
        let gameObject;
        let gameObjectDefinition;
        if (objectDefinition.prefabName) //It's a prefab
            gameObjectDefinition = SceneManager.allPrefabs.find(i => i.name == objectDefinition.prefabName);
        else //It's a one-off game object 
            gameObjectDefinition = objectDefinition.gameObject;

        if (!gameObjectDefinition) throw "Could not find a prefab or game object description (deserializeObject) in " + JSON.stringify(objectDefinition, null, 2)
        
        gameObject = GameObject.deserialize(gameObjectDefinition); //Deserialize the object
        
        if (gameObject.name === "Hero" && this.sceneName === "TrapScene") {        
            gameObject.transform.position.x = -200; //Set the x or default to 0. This is already the default, so this is redundant but very clear
        } else {
            gameObject.transform.position.x = objectDefinition.x || 0; //Set the x or default to 0. This is already the default, so this is redundant but very clear
        }
        
        gameObject.transform.position.y = objectDefinition.y || 0; //Set the y or default to 0
        gameObject.transform.scale.x = objectDefinition.sx || 1; //Set the x or default to 0. This is already the default, so this is redundant but very clear
        gameObject.transform.scale.y = objectDefinition.sy || 1; //Set the y or default to 0
        gameObject.transform.rotation = objectDefinition.r || 0; //Set the y or default to 0
        gameObject.drawLayer = objectDefinition.drawLayer || "default";

        if (objectDefinition.enabled == true || objectDefinition.enabled == false) {
            //Funny, round about way to check defined v truthy
            //Notice we are setting the "private" version of the variable, so we don't trigger onEnable quite yet
            gameObject._enabled = objectDefinition.enabled;
        }
        else
            //Notice we are setting the "private" version of the variable, so we don't trigger onEnable quite yet
            gameObject._enabled = true; //Default 

        //Call awake if the object is enabled. Note that other game objects in the scene may not have had their awake() called.
        //start() is called after all game objects in a scene are initialized and called awake().
        //For details, see https://docs.unity3d.com/Manual/ExecutionOrder.html
        if (gameObject.enabled && !sceneStart) {

            gameObject.callMethod("awake");
            gameObject.callMethod("onEnable");
            gameObject.callMethod("start");
        }
        return gameObject
    }

    static deserialize(sceneDefinition) {
        let toReturn = new Scene(); //Create a new Scene
        toReturn.name = sceneDefinition.name; //Set the scene's name (for reference later when we are changing scenes)
        this.sceneName = sceneDefinition.name; //Set the scene's name (for reference later when we are changing scenes)
        if (sceneDefinition.children)
            for (let objectDefinition of sceneDefinition.children) { //Loop over all the children.
                let gameObject = this.deserializeObject(objectDefinition)
                toReturn.addChild(gameObject);
            }

        //adding custom map layout here
        if (sceneDefinition.mapLayout){
            let diagram = sceneDefinition.mapLayout;
            
            let colors = new Map();
            colors.set(1,"black");
            colors.set("r", "red");
            colors.set("w", "white");
            colors.set("b", "blue");
            colors.set("y", "yellow");
            colors.set("g", "green");
            colors.set("k1", "yellow");
            colors.set("k2", "red");

            // console.log(JSON.stringify(diagram, null, 2));

            //in the scenes the first child will be a ground game object
            //since the game object hasnt been created yet we are going to have to parse arrays
            var sizeX = sceneDefinition.children.find(e => {return e.gameObject.name ==="Ground"}).gameObject.components.find(e => {return e.name === "RectangleGeometryComponent"}).args[0];
            var sizeY = sceneDefinition.children.find(e => {return e.gameObject.name ==="Ground"}).gameObject.components.find(e => {return e.name === "RectangleGeometryComponent"}).args[1];
            var name = sceneDefinition.children[0].gameObject.name;

            var width = (sizeX / diagram[0].length);
            var height = (sizeY / diagram.length);

            let boundry = 0;      

            for (var i = 0; i < diagram.length; i++){
                for (var j = 0; j < diagram[0].length; j++){
                    if (diagram[i][j] !== 0){
                        boundry++;
                        
                        let color = colors.get(diagram[i][j])
                        //console.log(color);
                        let name;

                        if (diagram[i][j] === "y"){
                            if (Keys.key1) continue;
                        }
                        if (diagram[i][j] === "r"){
                            if (Keys.key2) continue;
                        }

                        if (diagram[i][j] === "k1"){
                            if (Keys.key1) continue;
                            name = "k1";
                        }
                        else if (diagram[i][j] === "k2") {
                            if (Keys.key2) continue;
                            name = "k2";
                        }
                        else if (diagram[i][j] === "w") {
                            name = "home";
                        }
                        else if (diagram[i][j] === "b") {
                            name = "move" + boundry;
                        }
                        else {
                            name = "boundry" + boundry
                        }

                        let gameObjectDef = this.deserializeObject({
                            gameObject: {
                              name,
                              components: [
                                { name: "DrawGeometryComponent", args: [color] },
                                { name: "RectangleGeometryComponent", args: [width, height] },
                              ]
                            }
                          });
                        
                        if (Math.floor(diagram.length / 2) !== (diagram.length / 2)){
                            gameObjectDef.transform.position.x = -((Math.floor(diagram[i].length / 2) - j) * width);
                            gameObjectDef.transform.position.y = -((Math.floor(diagram.length / 2) - i) * height);
                        } else {
                            gameObjectDef.transform.position.x = -((diagram[i].length / 2 - j) * width) + (width * .5);
                            gameObjectDef.transform.position.y = -(((diagram.length / 2) - i) * height) + (height * .5);
                        }
                        
                        toReturn.addChild(gameObjectDef);

                    }
                }
            }

        } else {console.log("No diagrams for the current scene! This is OK!");}

        return toReturn;
    }

    /**
     * Return a reference to the children in this scene
     * @return {Array} the array of child GameObjects
     */
    getChildren() {
        return this.children;
    }

    /**
     * 
     * @param {GameObject} child the GameObject child to add to the scene
     */
    addChild(child) {
        this.children.push(child)
        //child.callMethod("start", []);
    }

    /**
     * 
     * @param {2D Rendering Context from a Canvas} ctx the 2D context to which we draw
     */
    draw(layers) {
        //Clear the screen
        layers.forEach(l => l.ctx.clearRect(0, 0, l.ctx.canvas.width, l.ctx.canvas.height));
        bctx.clearRect(0, 0, bctx.canvas.width, bctx.canvas.height);
        bbctx.clearRect(0, 0, bbctx.canvas.width, bbctx.canvas.height);
        let dctx = layers.find(i => i.name == "default").ctx


        dctx.fillStyle = this.camera.getComponent("WorldCameraComponent").color;
        dctx.fillRect(0, 0, dctx.canvas.width, dctx.canvas.height);
        dctx.save();

        //Loop through all the game objects and render them.
        for (let layer of layers) {
            if(layer.name=="screen") continue;
            let ctx = layer.ctx;

            ctx.save();
            ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
            ctx.translate(this.camera.transform.position.x, this.camera.transform.position.y)
            ctx.scale(this.camera.transform.scale.x, this.camera.transform.scale.y)
            ctx.rotate(this.camera.transform.rotation);
        }
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.name == "ScreenCamera") continue;
            child.draw(layers);
        }
        for (let layer of layers) {
            let ctx = layer.ctx;

            if (this.name === "BlueScene") {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(this.getGameObject("Hero").transform.position.x, this.getGameObject("Hero").transform.position.y, 100, 0, 2 * Math.PI);
                let ground = this.getGameObject("Ground");
                ctx.rect(-ground.components[2].width/2 , -ground.components[2].height/2, ground.components[2].width, ground.components[2].height);
                ctx.fill("evenodd");
            }

            ctx.restore();
        }

        dctx.restore();

        //Now draw the screen camera
        dctx.save();
        this.screenCamera.draw(layers)
        dctx.restore();

        //Now compose the layers
        let mainCtx = layers[0].ctx;
        let mainCanvas = mainCtx.canvas;

        // let bctx = Engine.bctx;
        // let bbctx = Engine.bbctx;
        for (let i = 1; i < layers.length; i++) {
            let thisCtx = layers[i].ctx;
            let thisCanvas = thisCtx.canvas
            let mw = mainCanvas.width;
            let mh = mainCanvas.height;
            let mw2 = mw / 2
            let mh2 = mh / 2
            let th2 = thisCanvas.height / 2;
            let tw2 = thisCanvas.width / 2;
            let cx = mw2 - tw2;
            let cy = mh2 - th2;

            //Add a glow to the layer
            if (layers[i].name == "wrap") {

                bctx.drawImage(thisCanvas, cx, cy)
                bctx.drawImage(thisCanvas, cx - mw, cy) //x left
                bctx.drawImage(thisCanvas, cx + mw, cy) //x right
                bctx.drawImage(thisCanvas, cx, cy + mh) //y down
                bctx.drawImage(thisCanvas, cx, cy - mh) //y up


                bctx.drawImage(thisCanvas, cx - mw, cy + mh) //x left + y down
                bctx.drawImage(thisCanvas, cx - mw, cy - mh) //x left + y up
                bctx.drawImage(thisCanvas, cx + mw, cy + mh) //x right + y down
                bctx.drawImage(thisCanvas, cx + mw, cy - mh) //x right + y up


                bctx.drawImage(thisCanvas, cx - mw, cy + mh) //y down + x left
                bctx.drawImage(thisCanvas, cx + mw, cy + mh) //y down + x right

                bctx.drawImage(thisCanvas, cx - mw, cy - mh) //y up + x left
                bctx.drawImage(thisCanvas, cx + mw, cy - mh) //y up + x Right


                //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
                //This technology is not supported by safari as of 4/6/21
                //Check https://caniuse.com/?search=canvas%20filter for updates
                //bbctx.filter = 'blur(10px)'
                bbctx.drawImage(bufferCanvas, 0, 0);
                //bbctx.filter = 'none'
                bbctx.drawImage(bufferCanvas, 0, 0);

                layers[0].ctx.drawImage(blurCanvas, 0, 0);
            }
            else {
                layers[0].ctx.drawImage(layers[i].ctx.canvas, 0, 0)
            }
        }

        //Debug the layers
        // let debugLayerWidth = 70;
        // for (let i = 0; i < layers.length; i++) {
        //     let thisCtx = layers[i].ctx;
        //     let thisCanvas = thisCtx.canvas
        //     let renderedHeight = debugLayerWidth * thisCanvas.height / thisCanvas.width;
        //     layers[0].ctx.fillStyle = "rgba(128, 128, 128, .5)"
        //     layers[0].ctx.fillRect(0, (i) * debugLayerWidth, debugLayerWidth, debugLayerWidth * thisCanvas.height / thisCanvas.width)
        //     layers[0].ctx.drawImage(thisCanvas, 0, (i) * debugLayerWidth, debugLayerWidth, debugLayerWidth * thisCanvas.height / thisCanvas.width)

        //     layers[0].ctx.strokeStyle = "blue";
        //     if (layers[i].name == "wrap") {
        //         layers[0].ctx.strokeRect(debugLayerWidth/4, (i) * debugLayerWidth + renderedHeight * .25, debugLayerWidth/2, .5 * renderedHeight)
        //     }

        //     layers[0].ctx.strokeRect(0, (i) * debugLayerWidth, debugLayerWidth, debugLayerWidth * thisCanvas.height / thisCanvas.width)

        //     layers[0].ctx.fillStyle = "white"
        //     let measure = layers[0].ctx.measureText(layers[i].name).width
        //     layers[0].ctx.fillText(layers[i].name,  + debugLayerWidth/2 - measure/2, (i+.4)*debugLayerWidth)

        // }

    }
    //Getter does 2 things. 1) I call camera not getCamera().
    //2) Since there is no setter, this variable is read-only
    get camera() {
        return this.getGameObject("MainCamera");
    }
    get screenCamera() {
        return this.getGameObject("ScreenCamera")
    }

    /**
     * Update all the Gamebjects
     */
    update() {
        //Use an extended for loop to call update on all gameObjects
        for (let child of this.children) {
            child.update();
        }
    }

    /**
     * Remove any game objects marked to be destroyed
     */
    cullDestroyed() {
        let newChildren = [];
        for (let child of this.children) {
            if (!child.markedDestroy)
                newChildren.push(child);
        }
        this.children = newChildren;
    }

    /**
     * Get a game object by name
     */
    getGameObject(name) {
        for (let child of this.children) {
            if (child.name == name) return child;
            let foundChild = child.getGameObject(name);
            if (foundChild) return foundChild;
        }
        //console.error("Couldn't find game component " + name)
    }

    /**
     * Create a new game object based on the prefab name
     */
    instantiate(objectDescription) {
        let newObject = Scene.deserializeObject(objectDescription, false);
        this.addChild(newObject)
        return newObject;

    }

    /**
    * Call method on all children and their children
     */
    callMethod(name, args) {
        for (let child of this.children) {
            child.callMethod(name, args);
        }
    }
}