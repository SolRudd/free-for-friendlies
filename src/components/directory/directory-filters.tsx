import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FilterField = {
  label: string;
  name: string;
  options?: string[];
  placeholder?: string;
  type?: "select" | "text";
};

type DirectoryFiltersProps = {
  action: string;
  fields: FilterField[];
  resultsLabel: string;
  totalCount: number;
  filteredCount: number;
  values: Record<string, string>;
};

export function DirectoryFilters({
  action,
  fields,
  resultsLabel,
  totalCount,
  filteredCount,
  values,
}: DirectoryFiltersProps) {
  const hasActiveFilters = Object.values(values).some(Boolean);

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_18px_44px_rgba(22,37,30,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Filter the board
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {filteredCount} of {totalCount} {resultsLabel}
          </p>
        </div>
        {hasActiveFilters ? (
          <Link
            href={action}
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      <form
        action={action}
        method="get"
        className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5"
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`filter-${field.name}`}
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              {field.label}
            </label>
            {field.type === "text" ? (
              <Input
                id={`filter-${field.name}`}
                name={field.name}
                defaultValue={values[field.name] ?? ""}
                placeholder={field.placeholder}
              />
            ) : (
              <Select
                id={`filter-${field.name}`}
                name={field.name}
                defaultValue={values[field.name] ?? ""}
              >
                <option value="">{field.placeholder ?? `All ${field.label}`}</option>
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </div>
        ))}

        <div className="md:col-span-2 xl:col-span-5 flex justify-start">
          <button type="submit" className={buttonStyles({ size: "sm" })}>
            Apply filters
          </button>
        </div>
      </form>
    </section>
  );
}
