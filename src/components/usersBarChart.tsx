import * as d3 from 'd3';
import * as React from 'react';
import './usersBarChart.css';
import { ax } from '../plugins/axios';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = (theme: any) => ({
    container: {
        display: 'flex',
        // flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    root: {
        flexGrow: 1,
    },
    tableroot: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        // overflowX: 'auto',
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
    table: {
        minWidth: 100,
    },
    tableCell: {
        cursor: 'pointer'
    }
});
const margin = {
    bottom: 30,
    left: 50,
    right: 30,
    top: 20,
};
const width = 500 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom
interface IChartModel {
    id: number;
    name: string;
    value: number;
}
interface IAppState {
    deleteDialogOpen: boolean;
    editDialogOpen: boolean;
    data: IChartModel[];
    edit: IChartModel
}

class UsersBarChart extends React.Component<any, IAppState> {
    private deleteId: number;
    private xSclae: any;
    private yScale: any;
    constructor(props: any) {
        super(props);
        this.state = {
            deleteDialogOpen: false,
            editDialogOpen: false,
            data: [],
            edit: { id: 0, name: '', value: 0 }
        };
    }
    public render() {
        const { classes } = this.props;
        const { data, edit, editDialogOpen, deleteDialogOpen } = this.state;
        return (
            <div>
                <Grid container className={classes.root} spacing={16}>
                    <Grid item xs={6}>
                        <svg className="chart" />
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.tableroot}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell numeric>Value</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map(row => {
                                        return (
                                            <TableRow key={row.id}>
                                                <TableCell className={classes.tableCell} onClick={this.handleRowClick(row.id)}
                                                    component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell numeric>
                                                    {row.value}
                                                </TableCell>
                                                <TableCell>
                                                    <span>
                                                        <DeleteIcon onClick={this.openDeleteDialog(row.id)} />
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.control}>
                            <Grid container>
                                <Grid item>
                                    <FormLabel>Enter Values</FormLabel>
                                    <form className={classes.container} noValidate autoComplete="off">
                                        <TextField
                                            required
                                            id="name"
                                            label="Name"
                                            className={classes.textField}
                                            value={edit.name}
                                            onChange={this.handleChange('name')}
                                            margin="normal"
                                        />
                                        <TextField
                                            id="value"
                                            label="Value"
                                            value={edit.value}
                                            onChange={this.handleChange('value')}
                                            type="number"
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            margin="normal"
                                        />
                                    </form>
                                    <Button variant="flat" color="primary" onClick={this.saveFields}>
                                        Save
                                </Button>
                                    <Button variant="flat" color="primary" onClick={this.clearFields}>
                                        Clear
                                </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog
                    open={deleteDialogOpen}
                    onClose={this.handleCloseDelete(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Delete confirmation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you really want to delete this record ?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDelete(false)} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.handleCloseDelete(true)} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={editDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please edit the values associated with this person
                        </DialogContentText>
                        <form className={classes.container} noValidate autoComplete="off">
                            <TextField
                                required
                                id="name"
                                label="Name"
                                className={classes.textField}
                                value={edit.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                            />
                            <TextField
                                id="value"
                                label="Value"
                                value={edit.value}
                                onChange={this.handleChange('value')}
                                type="number"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.saveFields} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
    public componentDidMount() {
        this.getData();
    }
    private getData() {
        ax.get('users.json').then((resp: any) => {
            this.setState({ data: resp.data });
            this.drawChart();
        });
    }
    private handleRowClick = (id: number) => (event: any) => {
        const filter = this.state.data.filter(x => x.id === id);
        if (filter && filter.length > 0) {
            this.setState({
                edit: { id: filter[0].id, name: filter[0].name, value: filter[0].value },
                editDialogOpen: true
            })
        }
    }
    private handleClose = () => {
        this.setState({ editDialogOpen: false });
        this.clearFields();
    }
    private handleChange = (name: string) => (event: any) => {
        this.setState({
            edit: {
                ...this.state.edit,
                [name]: event.target.value || ''
            }
        });
    }
    private openDeleteDialog = (id: number) => (event: any) => {
        if (id !== 0) {
            this.deleteId = id;
            this.setState({
                deleteDialogOpen: true
            })
        }
    }
    private handleCloseDelete = (arg: boolean) => (event: any) => {
        if (arg) {
            this.deleteEntry();
        }
        this.setState({
            deleteDialogOpen: false
        });
        this.deleteId = 0;
    }
    private deleteEntry() {
        const filter = this.state.data.filter(x => x.id !== this.deleteId);
        this.setState({
            data: filter
        });
        setTimeout(() => {
            this.redrawChart();
        }, 10);
    }
    private saveFields = () => {
        const data: IChartModel[] = this.state.data
        const exist = this.state.data.filter(x => x.name === this.state.edit.name);
        if (exist.length === 0) {
            if (this.state.edit.id !== 0) {
                const filter: any = data.filter(x => x.id === this.state.edit.id);
                if (filter && filter.length > 0) {
                    filter[0].name = this.state.edit.name;
                    filter[0].value = this.state.edit.value;
                }
            } else {
                const maxId: number = data.reduce((prev, current) => {
                    if (current.id > prev) {
                        return current.id;
                    } else {
                        return prev;
                    }
                }, 0);
                data.push({ id: maxId + 1, name: this.state.edit.name, value: this.state.edit.value })
            }
            this.setState({
                editDialogOpen: false,
                data,
                edit: { id: 0, name: '', value: 0 }
            });
            setTimeout(() => {
                this.redrawChart();
            }, 10);
        } else {
            // alert existing
            alert('Name already existing');
        }
    }
    private clearFields = () => {
        this.setState({
            edit: { id: 0, name: '', value: 0 }
        });
    }
    private redrawChart() {
        d3.select('.chart').selectAll('*').remove();
        if (this.state.data.length > 0) {
            this.drawChart();
        }
    }
    private drawChart() {
        const self = this;
        this.xSclae = d3.scale.ordinal()
            .domain(this.state.data.map(d => d.name))
            .rangeRoundBands([0, width], 0.1);

        this.yScale = d3.scale.linear()
            .domain([0, d3.max(this.state.data, (d) => d.value)])
            .range([height, 0]);

        const xAxis = d3.svg.axis()
            .scale(this.xSclae)
            .orient('bottom');

        const yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient('left')
            .ticks(10, ",f");

        const chart = d3.select('.chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

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
            .text("Frequency");

        const bar = chart.selectAll('.bar')
            .data(this.state.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr("fill", "slategrey")
            .attr('x', (d: any) => this.xSclae(d.name))
            .attr('y', height)
            .attr('height', 0)
            .attr('width', this.xSclae.rangeBand() - 1);

        bar.transition()
            .duration(2000)
            .ease('linear')
            .attrTween('fill', function (this: any, d: any) {
                const node = this;
                const sFill = node.getAttribute('fill');
                const i = d3.interpolateRgb(sFill, "steelblue");
                return function (t) {
                    return i(t);
                }
            })
            .attrTween('y', function (this: any, d: any) {
                const node = this;
                const sY = node.getAttribute('y');
                return d3.interpolateNumber(sY, self.yScale(d.value))
            })
            .attrTween('height', function (this: any, d: any) {
                const node = this;
                const sHeight = node.getAttribute('height');
                return d3.interpolateNumber(sHeight, height - self.yScale(d.value))
            })


    }
}

export default withStyles(styles)(UsersBarChart);