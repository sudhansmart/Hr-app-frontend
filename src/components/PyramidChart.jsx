import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
// var CanvasJSReact = require('@canvasjs/react-charts');

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const PyramidChart = () => {
    const [options, setOptions] = useState({
        animationEnabled: true,
        title: {
            text: "Sales via Advertisement"
        },
        legend: {
            horizontalAlign: "right",
            verticalAlign: "center",
            reversed: true
        },
        data: [{
            type: "pyramid",
            showInLegend: true,
            legendText: "{label}",
            indexLabel: "{label} - {y} ({percentage}%)",
            toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
            dataPoints: [
                { label: "You Have Achieved", y: 3000 },
                { label: "You Have Achieved", y: 3000 },
                { label: "You Have Achieved", y: 3000 },
                { label: "You Have Achieved", y: 2000 },
                { label: "You Have Achieved", y: 1000 }
            ]
        }]
    });

    useEffect(() => {
        // Calculate the total to compute percentages
        const dataPoints = options.data[0].dataPoints;
        const total = dataPoints.reduce((sum, point) => sum + point.y, 0);

        // Calculate and update percentages
        const updatedDataPoints = dataPoints.map(point => ({
            ...point,
            percentage: ((point.y / total) * 100).toFixed(2)
        }));

        // Update the options with the calculated percentages
        setOptions(prevOptions => ({
            ...prevOptions,
            data: [{
                ...prevOptions.data[0],
                dataPoints: updatedDataPoints
            }]
        }));
    }, []);

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default PyramidChart;
