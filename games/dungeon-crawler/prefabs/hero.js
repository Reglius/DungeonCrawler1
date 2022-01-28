export default {
  name: "Hero", components: [
    {
      name: "KeyboardMoveComponent", args: [5]
    },
    { name: "DrawGeometryComponent", args: ["green"] },
    { name: "RectangleGeometryComponent", args: [75, 75] },
  ], children: [
    {
      gameObject: {
        name: "YellowKey",
        components: [
          { name: "RectangleGeometryComponent", args: [30,30] },
          { name: "DrawGeometryComponent", args: ["yellow"] }
        ]

      },sx:.5, sy:.5,x:-15,y:15
    },
    {
      gameObject: {
        name: "RedKey",
        components: [
          { name: "RectangleGeometryComponent", args: [30,30] },
          { name: "DrawGeometryComponent", args: ["Red"] }
        ]

      },sx:.5, sy:.5,x:15,y:15
    }
  ]
} 