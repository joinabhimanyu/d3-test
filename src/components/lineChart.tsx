import * as React from 'react';
import * as d3 from 'd3';
import { ax } from '../plugins/axios';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = (theme: any) => ({
  root: {
    flexGrow: 1,
  },
})

const margin = {
  bottom: 30,
  left: 50,
  right: 30,
  top: 20,
};
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom

interface ILineChartModel {
  date: Date;
  value: number;
}
interface ILineChartState {
  data: ILineChartModel[];
}

class LineChart extends React.Component<any, ILineChartState>{
  constructor(props: any) {
    super(props);
    this.state = {
      data: []
    }
  }
  public render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={6}>
            <svg className="chart" />
          </Grid>
        </Grid>
      </div>
    );
  }
  public componentDidMount() {
    this.getData();
  }
  private getData() {
    ax.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01`)
      .then((resp: any) => {
        this.setState({
          data: this.parseData(resp.data)
        });
        setTimeout(() => {
          this.drawChart();
        }, 10);
      });
  }
  private parseData(data: any) {
    return Object.keys(data.bpi).map((i) => ({
      date: new Date(i),
      value: +data.bpi[i]
    }))
  }
  private transition = (path: any) => {
    function tweenDash(this: any) {
      const l = this.getTotalLength();
      const i = d3.interpolateString("0," + l, l + "," + l);
      return function (t: any) { return i(t); };
    }
    path.transition()
      .duration(2000)
      .attrTween("stroke-dasharray", tweenDash);
  }
  private drawChart() {
    const chart = d3.select('.chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.time.scale()
      .domain(d3.extent(this.state.data, (d) => d.date))
      .rangeRound([0, width]);
    const y = d3.scale.linear()
      .domain(d3.extent(this.state.data, (d) => d.value))
      .rangeRound([height, 0]);
    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');
    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(10, ",f");
    const line = d3.svg.line<any>()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.value));
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);
    chart.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    chart
      .append("path")
      .datum(this.state.data)
      .attr("class", "data")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line)
      .call(this.transition);
  }
}

export default withStyles(styles)(LineChart);