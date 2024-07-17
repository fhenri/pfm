"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BarChart() {
  const svgRef = useRef();
  const data = [10, 30, 20, 50, 40];
  const width = 500;
  const height = 300;

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).select("svg").remove();

    // Create an SVG container
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    // Define scales
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, width])
      .padding(0.1);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height, 0]);
    // Add bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i))
      .attr('y', (d) => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d))
      .on('mouseover', (event, d) => {
        // Show tooltip on hover
        tooltip.html(`Value: ${d}`)
          .style('visibility', 'visible')
          .style('top', `${event.pageY}px`)
          .style('left', `${event.pageX}px`);
      })
      .on('mouseout', () => {
        // Hide tooltip on mouseout
        tooltip.style('visibility', 'hidden');
      });
    // Create tooltip element
    const tooltip = d3.select(svgRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('visibility', 'hidden');
    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale));
  }, []);


  return (
    <div>
      <h2>Bar Chart</h2>
      <div ref={svgRef}></div>
    </div>
  );
}

export default BarChart;