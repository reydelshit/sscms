import BGPage from '@/assets/bg-page.png';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  Bar,
  BarChart,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';

const Dashboard = () => {
  const data = [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ];

  const monthlyVisits = [
    { name: 'Jan', total: 4000 },
    { name: 'Feb', total: 3000 },
    { name: 'Mar', total: 2000 },
    { name: 'Apr', total: 2780 },
    { name: 'May', total: 1890 },
    { name: 'Jun', total: 2390 },
    { name: 'Jul', total: 3490 },
    { name: 'Aug', total: 3490 },
    { name: 'Sep', total: 3490 },
    { name: 'Oct', total: 3490 },
    { name: 'Nov', total: 3490 },
    { name: 'Dec', total: 3490 },
  ];

  const dataLineCHart = [
    { name: 'Page A', uv: 1000 },
    { name: 'Page B', uv: 3000 },
    { name: 'Page C', uv: 2000 },
    { name: 'Page D' },
    { name: 'Page E', uv: 1890 },
    { name: 'Page F', uv: 2390 },
    { name: 'Page G', uv: 3490 },
  ];

  return (
    <div
      className="h-full min-h-screen w-full overflow-y-hidden bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-[1rem] h-fit w-full rounded-3xl bg-transparent bg-opacity-75 p-4 text-center">
        <div className="rounded-3xl bg-[#95CCD5] p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              width={500}
              height={200}
              data={dataLineCHart}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid stroke="black" strokeDasharray="3 3" />
              <XAxis stroke="black" dataKey="name" />
              <YAxis stroke="black" />
              <Tooltip />
              <Line
                connectNulls
                type="linear"
                dataKey="uv"
                stroke="white"
                fill="white"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl bg-[#95CCD5] p-4">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={monthlyVisits}>
              <XAxis
                dataKey="name"
                stroke="black"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="black"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => `${value}`}
              />
              <Bar dataKey="total" fill="white" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl bg-white">
          <PieChart
            series={[
              {
                data: data,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,
                cx: 150,
                cy: 150,
              },
            ]}
            width={450}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
