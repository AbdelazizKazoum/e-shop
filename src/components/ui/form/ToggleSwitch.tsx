const ToggleSwitch = ({
  label,
  enabled,
  setEnabled,
}: {
  label: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label}
    </label>
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-700"
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          enabled ? "translate-x-5" : "translate-x-0"
        } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

export default ToggleSwitch;
