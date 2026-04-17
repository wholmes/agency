export default function AdminToggle({
  id,
  name,
  label,
  description,
  defaultChecked = false,
}: {
  id: string;
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/30 hover:bg-white/[0.02]"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && (
          <span className="text-xs text-text-tertiary">{description}</span>
        )}
      </div>

      {/* Track — uses has-[:checked] to drive knob position via CSS */}
      <div className="toggle-track relative h-5 w-9 shrink-0 rounded-full border border-border bg-white/5 transition-colors">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="toggle-input peer absolute inset-0 z-10 cursor-pointer opacity-0"
        />
        {/* Knob */}
        <span className="pointer-events-none absolute top-0.5 left-0.5 size-3.5 rounded-full bg-text-tertiary shadow-sm transition-all duration-200 peer-checked:left-[18px] peer-checked:bg-accent" />
        {/* Track highlight when checked */}
        <span className="pointer-events-none absolute inset-0 rounded-full transition-colors duration-200 peer-checked:border-accent/60 peer-checked:bg-accent/20" />
      </div>
    </label>
  );
}
