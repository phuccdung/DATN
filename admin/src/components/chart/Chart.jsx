import "./chart.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ title, data, dataKey, grid,line }) {

  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      {
        line?
          <ResponsiveContainer width="100%" aspect={4 / 1}>
            <LineChart data={data}>
              <XAxis  dataKey="name" stroke="#5550bd" />
              <YAxis/>
              <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
              {
                title==="User Analytics"?
                null:
               <Line type="monotone" dataKey="Sale By Link" stroke="#82ca9d" />

              }
               {
                data.Title?
                <Line  dataKey="Title" stroke="#0000" />: null
               }
              <Tooltip />
              <Legend />
              {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
            </LineChart>
          </ResponsiveContainer>
          :
          <ResponsiveContainer width="100%" aspect={4 / 1}>
            <BarChart width={730}
              height={250}
              data={data}
              margin={{ top: 20, right: 100, left: 20, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {
                title==="KeyWord Analytics"?
                <XAxis  dataKey="name" stroke="#5550bd" label ={"Keyword"} />
                  :
                <XAxis  dataKey="name" stroke="#5550bd" label ={"ID of Product"} />
              }
              <YAxis label ={"Count"}/>
              <Bar   dataKey={dataKey} fill="#5550bd" />
              <Bar  dataKey="Sale By Link" fill="#82ca9d"  />
              <Bar  dataKey="Title" fill="#00008B"  />
              <Tooltip />
              <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />
            </BarChart>
          </ResponsiveContainer>
      }
      
    </div>
  );
}
