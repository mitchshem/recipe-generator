import type { Appliance } from '../models/Appliance';

interface ApplianceSelectorProps {
  appliances: Appliance[];
  onToggle: (applianceId: string) => void;
}

export const ApplianceSelector = ({
  appliances,
  onToggle,
}: ApplianceSelectorProps) => {
  return (
    <div className="appliance-selector">
      <h3>Appliances</h3>
      {appliances.length === 0 ? (
        <p>No appliances added yet</p>
      ) : (
        <ul>
          {appliances.map((appliance) => (
            <li key={appliance.id}>
              <label>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => onToggle(appliance.id)}
                />
                {appliance.name} ({appliance.type})
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
