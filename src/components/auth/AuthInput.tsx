interface AuthInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  id: string; // Add id prop
}

export function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  id,
}: AuthInputProps) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="font-semibold mb-2 text-cyan-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-slate-100 text-gray-800 placeholder:italic placeholder:text-gray-400 rounded-lg border border-cyan-300 px-4 py-3 focus:outline-none focus:border-cyan-500 transition"
      />
    </div>
  );
}
