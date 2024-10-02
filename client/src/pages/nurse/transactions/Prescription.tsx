import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Prescription = () => {
  return (
    <div className="mt-[2rem] h-[70%] rounded-3xl bg-[#526C71]">
      <form>
        <div>
          <div>
            <Label>Prescription No.</Label>
            <Input disabled placeholder="AUTO GENERATED" />
          </div>

          <div>
            <Label>Date</Label>
            <Input type="date" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Prescription;
