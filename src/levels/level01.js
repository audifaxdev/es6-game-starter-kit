export default (config) => {
  let {xMax, yMax} = config;

  let middleX = xMax/2;
  let middleY = yMax/2;
  let zero = [0, 0];
  let degree = Math.PI / 180;

  return [
    {
      type: "box",
      position: [middleX+3, 3],
      width: 5,
      height: 1,
      angle: 25*degree,
      mass: 0
    },
    {
      type: "box",
      position: [middleX-2, 9],
      width: 5,
      height: 1,
      angle: -25*degree,
      mass: 0
    },
    {
      type: "box",
      position: [middleX+2, 15],
      width: 5,
      height: 1,
      angle: 25*degree,
      mass: 0
    },
    {
      type: "box",
      position: [middleX-3, 21],
      width: 5,
      height: 1,
      angle: -25*degree,
      mass: 0
    },
    {
      type: "box",
      position: [middleX+2, 27],
      width: 5,
      height: 1,
      angle: 25*degree,
      mass: 0
    },
    {
      type: "box",
      position: [middleX-2, 33],
      width: 5,
      height: 1,
      angle: -25*degree,
      mass: 0
    },
    {
      type: "circle",
      position: [middleX, yMax-3],
      radius: 1,
      mass: 10,
      angle: -25*degree
    }
  ];
}