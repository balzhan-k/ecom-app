import { FieldError } from "react-hook-form";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

interface SelectFieldProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: FieldError;
}

export default function SelectField({
  label,
  id,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="text-cyan-700 font-semibold mb-2">
        {label}
      </label>
      <Listbox
        value={selectedOption ? selectedOption.value : null}
        onChange={onChange}
      >
        <div className="relative">
          <ListboxButton className="bg-slate-100 text-gray-800 rounded-lg border border-cyan-300 px-4 py-3 w-full text-left flex justify-between items-center focus:outline-none focus:border-cyan-500 transition">
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-gray-400">
                Select {label.toLowerCase()}
              </span>
            )}
            <svg
              className="w-4 h-4 ml-2 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg">
            {options.map((opt) => (
              <ListboxOption
                key={opt.value}
                value={opt.value}
                className={({ active }: { active: boolean }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? "bg-cyan-100 text-cyan-900" : "text-gray-800"
                  }`
                }
              >
                {opt.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
      {error && <p className="text-rose-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
