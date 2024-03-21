import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

const GraficaDataTime = (props) =>{

<HighchartsReact
                highcharts={props.highcharts}
                options={props.options}
              />
}
export default GraficaDataTime;