"use client";

type Props = {
    label?: string;
    value?: string; // ISO string e.g. "2023-04-01"
    onChange: (value: string) => void;
    fromYear?: number;
    toYear?: number;
};

const months = [
    { label: "Jan", value: "01" },
    { label: "Feb", value: "02" },
    { label: "Mar", value: "03" },
    { label: "Apr", value: "04" },
    { label: "May", value: "05" },
    { label: "Jun", value: "06" },
    { label: "Jul", value: "07" },
    { label: "Aug", value: "08" },
    { label: "Sep", value: "09" },
    { label: "Oct", value: "10" },
    { label: "Nov", value: "11" },
    { label: "Dec", value: "12" },
];

export default function MonthYearInput({
    label,
    value,
    onChange,
    fromYear = 1970,
    toYear = new Date().getFullYear() + 5,
}: Props) {
    const current = value ? new Date(value) : undefined;
    const selectedMonth = current ? String(current.getMonth() + 1).padStart(2, "0") : "";
    const selectedYear = current ? String(current.getFullYear()) : "";

    const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);

    const handleChange = (newMonth: string, newYear: string) => {
        if (newMonth && newYear) {
            onChange(`${newYear}-${newMonth}-01`);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-muted-foreground">{label}</label>}
            <div className="flex gap-2">
                <select
                    className="border rounded px-2 py-1 bg-background"
                    value={selectedMonth}
                    onChange={(e) => handleChange(e.target.value, selectedYear)}
                >
                    <option value="">MM</option>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>

                <select
                    className="border rounded px-2 py-1 bg-background"
                    value={selectedYear}
                    onChange={(e) => handleChange(selectedMonth, e.target.value)}
                >
                    <option value="">YYYY</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
