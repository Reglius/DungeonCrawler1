export default {
  name: "MainScene",
  children: [
    {
      gameObject: {
        name:"MainCamera",components:[
          {name:"WorldCameraComponent"}
        ]
      },sx:.5,sy:.5
    },
    {
      gameObject:{
        name:"ScreenCamera",components:[
          {name:"ScreenCameraComponent"}
        ],children:[
          
          { gameObject: { name: "ScreenTextShadow", components: [{ name: "ScreenTextComponent", args: ["Dungeon Crawler", { color: "gray" }] }] }, x: 102, y: 42 },
          { gameObject: { name: "ScreenText", components: [{ name: "ScreenTextComponent", args: ["Dungeon Crawler", { color: "white" }] }] }, x: 100, y: 40 },
        ]
      }
    },
    {
      gameObject: {
        name: "Ground",
        components: [
          { name: "DrawGeometryComponent", args: ["white"] },
          { name: "RectangleGeometryComponent", args: [960, 720] },
        ]
      }
    },
    {
      prefabName: "MainController"
    },
    { prefabName: "Hero"},
  ],
  // mapLayout: [
  //   [1, 0, 0],
  //   [0, 1, 0],
  //   [0, 0, 1],
  //  ]
  // mapLayout: [
  //   [1, 0, 0, 0],
  //   [0, 1, 0, 0],
  //   [0, 0, 1, 0],
  //   [0, 0, 0, 1]
  // ]
  mapLayout: [
    [ 1 , 1 ,"y", 1 , 1 ],
    [ 1 , 1 ,"r", 1 , 1 ],
    [ 0 , 0 , 0 , 0 , 0 ],
    [ 0 , 0 , 0 , 0 , 0 ],
    [ 1 , 1 , 1 , 1 , 1 ]
  ]

  // mapLayout: [
  //   [1,0,1],
  //   [0,0,0],
  //   [1,1,1],
  // ]
}