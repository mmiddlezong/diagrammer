import { useEffect, useRef, useState } from "react";
import "./App.css";
import * as d3 from "d3";

type Point = {
    name: string;
    x: number;
    y: number;
};
const viewWidth = 32;
const viewMaxX = viewWidth / 2;
const viewHeight = 18;
const viewMaxY = viewHeight / 2;
const pointFillRadius = 0.06;
function App() {
    const [points, setPoints] = useState<Point[]>([{ name: "A", x: 1, y: 1 }]);

    const [showAxes, setShowAxes] = useState<boolean>(true);
    const [showMajorGridLines, setShowMajorGridLines] = useState<boolean>(true);
    const [showMinorGridLines, setShowMinorGridLines] = useState<boolean>(false);
    const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
    const svgRef = useRef<SVGSVGElement>(null);

    // const viewHeight = viewWidth * window.innerHeight / window.innerWidth;
    // const viewMaxY = viewHeight / 2;

    useEffect(() => {
        if (svgRef.current) {
            const svgElement: SVGSVGElement = svgRef.current;
            const svg = d3.select(svgElement as any); // Type assertion here
            const zoomHandler = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
                setTransform(event.transform);
            });

            svg.call(zoomHandler);
        }
    }, []);

    function drawAxes() {
        // Dynamically calculate max values based on zoom and pan
        const maxX = (viewMaxX + Math.abs(transform.x)) / transform.k;
        const maxY = (viewMaxY + Math.abs(transform.y)) / transform.k;
        return (
            <>
                <line x1={-maxX} y1={0} x2={maxX} y2={0} strokeWidth={0.02 / transform.k} className="stroke-black" />;
                <line x1={0} y1={-maxY} x2={0} y2={maxY} strokeWidth={0.02 / transform.k} className="stroke-black" />;
            </>
        );
    }
    function drawMajorGridLines() {
        if (transform.k < 0.08) return <></>;
        const maxX = (viewMaxX + Math.abs(transform.x)) / transform.k;
        const maxY = (viewMaxY + Math.abs(transform.y)) / transform.k;
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let x = Math.ceil(-maxX); x <= maxX; x++) {
            xValues.push(x);
        }
        for (let y = Math.ceil(-maxY); y <= maxY; y++) {
            yValues.push(y);
        }

        return (
            <>
                {xValues.map((x) => {
                    return (
                        <line
                            x1={x}
                            y1={-maxY}
                            x2={x}
                            y2={maxY}
                            strokeWidth={0.02 / transform.k}
                            className="stroke-gray-300"
                        />
                    );
                })}
                {yValues.map((y) => {
                    return (
                        <line
                            x1={-maxX}
                            y1={y}
                            x2={maxX}
                            y2={y}
                            strokeWidth={0.02 / transform.k}
                            className="stroke-gray-300"
                        />
                    );
                })}
            </>
        );
    }
    function drawMinorGridLines() {
        if (transform.k < 0.4) return <></>;
        const maxX = (viewMaxX + Math.abs(transform.x)) / transform.k;
        const maxY = (viewMaxY + Math.abs(transform.y)) / transform.k;
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let x = Math.ceil(-maxX * 5); x <= maxX * 5; x++) {
            xValues.push(x / 5);
        }
        for (let y = Math.ceil(-maxY * 5); y <= maxY * 5; y++) {
            yValues.push(y / 5);
        }

        return (
            <>
                {xValues.map((x) => {
                    return (
                        <line
                            x1={x}
                            y1={-maxY}
                            x2={x}
                            y2={maxY}
                            strokeWidth={0.01 / transform.k}
                            className="stroke-gray-200"
                        />
                    );
                })}
                {yValues.map((y) => {
                    return (
                        <line
                            x1={-maxX}
                            y1={y}
                            x2={maxX}
                            y2={y}
                            strokeWidth={0.01 / transform.k}
                            className="stroke-gray-200"
                        />
                    );
                })}
            </>
        );
    }
    return (
        <>
            <div className="flex flex-col w-screen h-screen">
                <div className="flex flex-row w-full grow">
                    <div className="grow relative h-full">
                        <svg
                            ref={svgRef}
                            viewBox={`${-viewMaxX} ${-viewMaxY} ${viewWidth} ${viewHeight}`}
                            className="absolute left-0 top-0 w-full h-full"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <g transform={transform.toString()}>
                                <g transform="scale(1,-1)">
                                    {showMinorGridLines && drawMinorGridLines()}
                                    {showMajorGridLines && drawMajorGridLines()}
                                    {showAxes && drawAxes()}
                                    {points.map((point, index) => {
                                        return (
                                            <circle
                                                key={index}
                                                cx={point.x}
                                                cy={point.y}
                                                r={pointFillRadius / transform.k}
                                                fill="black"
                                            />
                                        );
                                    })}
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div className="flex flex-col w-64 h-full space-y-4 overflow-auto p-4 border-l border-blue-400">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showAxes"
                                checked={showAxes}
                                onChange={() => setShowAxes(!showAxes)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label htmlFor="showAxes" className="text-lg text-gray-800">
                                Show axes
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showMajorGridLines"
                                checked={showMajorGridLines}
                                onChange={() => setShowMajorGridLines(!showMajorGridLines)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label htmlFor="showMajorGridLines" className="text-lg text-gray-800">
                                Show major grid lines
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showMinorGridLines"
                                checked={showMinorGridLines}
                                onChange={() => setShowMinorGridLines(!showMinorGridLines)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label htmlFor="showMinorGridLines" className="text-lg text-gray-800">
                                Show minor grid lines
                            </label>
                        </div>
                    </div>
                </div>
                <div className="border-t border-blue-400 h-6">
                    <input autoFocus={true} type="text" className="w-full px-2 py-1 text-sm font-mono" />
                </div>
            </div>
        </>
    );
}

export default App;
