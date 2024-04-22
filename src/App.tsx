import "./App.css";

type Point = {
    name: string;
    x: number;
    y: number;
};
const viewHeight = 15;
const viewWidth = 20;
const viewMaxX = viewWidth / 2;
const viewMaxY = viewHeight / 2;
const pointFillRadius = 0.06;
function App() {
    const points: Point[] = [];
    points.push({ name: "A", x: 1, y: 1 }, { name: "B", x: 2, y: 2 }, { name: "C", x: 2, y: 1 });
  
    function drawAxes() {
      return (
          <>
              <line x1={-viewMaxX} y1={0} x2={viewMaxX} y2={0} className="stroke-black stroke-[0.02px]" />
              <line x1={0} y1={-viewMaxY} x2={0} y2={viewMaxY} className="stroke-black stroke-[0.02px]" />
          </>
      );
    }
    function drawMajorGridLines() {
      const xValues: number[] = [];
      const yValues: number[] = [];
      for (let x = Math.ceil(-viewMaxX); x <= viewMaxX; x++) {
        if (x !== 0) {
          xValues.push(x);
        }
      }      
      for (let y = Math.ceil(-viewMaxY); y <= viewMaxY; y++) {
        if (y !== 0) {
          yValues.push(y);
        }
      }      

      return <>
        {xValues.map((x) => {
          return <line x1={x} y1={-viewMaxY} x2={x} y2={viewMaxY} className="stroke-gray-300 stroke-[0.02px]" />;
        })} 
        {yValues.map((y) => {
          return <line x1={-viewMaxX} y1={y} x2={viewMaxX} y2={y} className="stroke-gray-300 stroke-[0.02px]" />;
        })} 
      </>
    }
    return (
        <>
            <svg height="100vh" viewBox={`${-viewMaxX} ${-viewMaxY} ${viewWidth} ${viewHeight}`} className="border">
                <g transform="scale(1, -1)">
                    {drawAxes()}
                    {drawMajorGridLines()}
                    {points.map((point, index) => {
                        return <circle key={index} cx={point.x} cy={point.y} r={pointFillRadius} fill="black" />;
                    })}
                </g>
            </svg>
        </>
    );
}

export default App;
