import BGPage from '@/assets/bg-page.png';
import { PieChart } from '@mui/x-charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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

interface PieChartData {
  value: number;
  label: string;
}

interface DispensedData {
  name: string;
  total: number;
}

interface VisitsData {
  name: string;
  total: number;
}

const useFetchPieChartData = () => {
  return useQuery<PieChartData[]>({
    queryKey: ['PieChartData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/dashboard/pie-chart`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const useFetchDispensedData = () => {
  return useQuery<DispensedData[]>({
    queryKey: ['DispensedData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/dashboard/dispensed`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const useFetchVisitsData = () => {
  return useQuery<VisitsData[]>({
    queryKey: ['VisitsData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/dashboard/visits`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const Dashboard = () => {
  const { data: pieChartData = [] } = useFetchPieChartData();
  const { data: dispensedData = [] } = useFetchDispensedData();
  const { data: visitsData = [] } = useFetchVisitsData();

  return (
    <div
      className="h-full min-h-screen w-full overflow-y-hidden bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${BGPage})` }}
    >
      <div className="mt-2 flex w-full items-center gap-4 rounded-3xl bg-transparent bg-opacity-75 p-4 text-center">
        <div className="flex w-full flex-col gap-4">
          <div className="rounded-3xl bg-[#95CCD5] p-4">
            <div className="flex items-center justify-center gap-4">
              <span className="block h-[2rem] w-[2rem] bg-white"></span>
              <h1 className="font-semibold">
                PATIENTS VISITS WEEK 2 (DECEMBER 2024){' '}
              </h1>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                width={500}
                height={200}
                data={visitsData}
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
                  dataKey="total"
                  stroke="white"
                  fill="white"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-[#95CCD5] p-4">
            <div className="flex items-center justify-center gap-4">
              <span className="block h-[2rem] w-[2rem] bg-white"></span>
              <h1 className="font-semibold">MOST DISPENSED MEDICINE</h1>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dispensedData}>
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
        </div>

        <div className="grid h-[70%] w-[60%] place-content-center rounded-3xl bg-white p-2">
          <h1 className="text-2xl">FREQUENT HEALTH ISSUES ENCOUNTERED</h1>
          <PieChart
            series={[
              {
                arcLabel: (item) => `${item.value}`,
                data: pieChartData,
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
