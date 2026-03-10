import { fr } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Department {
    id: number;
    libelle_departement: string;
}

interface Class {
    classe_id: number;
    classe_name: string;
}

interface DashboardFiltersProps {
    departments: Department[];
    classes: Class[];
    selectedDepartment: number | null;
    selectedClass: number | null;
    selectedDate: Date;
    onDepartmentChange: (departmentId: number) => void;
    onClassChange: (classId: number | null) => void;
    onDateChange: (date: Date) => void;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onToday: () => void;
}

export default function DashboardFilters({
    departments,
    classes,
    selectedDepartment,
    selectedClass,
    selectedDate,
    onDepartmentChange,
    onClassChange,
    onDateChange,
    onPreviousWeek,
    onNextWeek,
    onToday,
}: DashboardFiltersProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-col gap-4">
                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Département */}
                    <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Département
                        </label>
                        <select
                            value={selectedDepartment || ''}
                            onChange={(e) => onDepartmentChange(Number(e.target.value))}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-white"
                        >
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.libelle_departement}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Classe */}
                    <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Classe
                        </label>
                        <select
                            value={selectedClass || ''}
                            onChange={(e) => onClassChange(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-white"
                        >
                            <option value="">Toutes les classes</option>
                            {classes.map((cls) => (
                                <option key={cls.classe_id} value={cls.classe_id}>
                                    {cls.classe_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Picker */}
                    <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Semaine du
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => date && onDateChange(date)}
                            dateFormat="dd/MM/yyyy"
                            locale={fr}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Navigation semaine */}
                <div className="flex items-center justify-center sm:justify-end gap-2">
                    <button
                        onClick={onPreviousWeek}
                        className="p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        title="Semaine précédente"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={onToday}
                        className="px-5 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 active:bg-blue-950 transition-colors"
                    >
                        Aujourd'hui
                    </button>
                    <button
                        onClick={onNextWeek}
                        className="p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        title="Semaine suivante"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
