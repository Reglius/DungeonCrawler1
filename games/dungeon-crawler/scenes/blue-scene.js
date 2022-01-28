export default {
  name: "BlueScene",
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
        ]
      }
    },
    {
      gameObject: {
        name: "Ground",
        components: [
          { name: "DrawGeometryComponent", args: ["blue"] },
          { name: "RectangleGeometryComponent", args: [1008, 720] },
        ]
      }
    },
    {
      prefabName:"MainController"
    },
    { prefabName: "Hero" }, 
  ],
  mapLayout: [
    ["w", 0 , 1 , 0 , 0 , 0 , 0 , 1 ,"k2"],
    [ 1 , 0 , 1 , 1 , 0 , 1 , 1 , 1 , 0 ],
    [ 1 , 0 , 1 , 0 , 0 , 0 , 0 , 1 , 0 ],
    [ 1 , 0 , 0 , 1 , 0 , 1 , 0 , 1 , 0 ],
    [ 1 , 1 , 0 , 0 , 0 , 0 , 0 , 1 , 0 ],
    [ 1 , 1 , 1 , 1 , 0 , 1 , 0 , 0 , 0 ],
    [ 1 , 0 , 0 , 1 , 0 , 1 , 0 , 1 , 1 ],
    [ 1 , 1 , 0 , 1 , 0 , 0 , 0 , 1 , 0 ],
    [ 1 , 1 , 0 , 0 , 0 , 1 , 0 , 0 , 0 ],

  ]
}