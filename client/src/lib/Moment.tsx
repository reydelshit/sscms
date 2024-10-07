import moment from 'moment';

export default function Moment({ time }: { time: string }) {
  return <>{moment(time).format('ll')}</>;
}
