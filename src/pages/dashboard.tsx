import useDepartementStore from "../stores/departement.store"
import useScheduleStore from "../stores/schedule.store"
import { useEffect, useState, useMemo } from "react"
import { startOfWeek, endOfWeek, format, addWeeks } from "date-fns"
import { fr } from "date-fns/locale"
import DashboardFilters from "../components/dashboard/DashboardFilters"
import WeeklyCalendar from "../components/calendar/WeeklyCalendar"

interface Schedule {
    id: number;
    name: string;
    teacher: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    type: string;
    status: string;
    backgroundColor: string;
    statut_annule: number;
}

interface Class {
    classe_id: number;
    classe_name: string;
    schedules: Schedule[];
}

export default function Dashboard(){
    const { departements } = useDepartementStore()
    const { bootSchedule, schedule, getScheduleByDepartementIdAndByDate } = useScheduleStore()
    
    const [state, setState] = useState({
        selectedDepartment: null as number | null,
        selectedClass: null as number | null,
        currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
        loading: false
    })

    // Initialisation
    useEffect(() => {
        if (departements?.length > 0 && !schedule) {
            bootSchedule()
        }
    }, [departements, schedule, bootSchedule])

    // Définir le département par défaut
    useEffect(() => {
        if (schedule && departements && !state.selectedDepartment) {
            setState(prev => ({
                ...prev,
                selectedDepartment: schedule.department_id || departements[0]?.id
            }))
        }
    }, [schedule, departements, state.selectedDepartment])

    // Charger les données quand le département ou la semaine change
    useEffect(() => {
        if (state.selectedDepartment) {
            const startDate = format(state.currentWeekStart, 'yyyy-MM-dd')
            const endDate = format(endOfWeek(state.currentWeekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd')
            
            setState(prev => ({ ...prev, loading: true }))
            getScheduleByDepartementIdAndByDate(state.selectedDepartment, startDate, endDate)
                .finally(() => setState(prev => ({ ...prev, loading: false })))
        }
    }, [state.selectedDepartment, state.currentWeekStart, getScheduleByDepartementIdAndByDate])

    // Classes disponibles
    const classes = useMemo(() => {
        return schedule?.classes || []
    }, [schedule])

    // Filtrer les emplois du temps
    const filteredSchedules = useMemo(() => {
        if (!schedule?.classes) return []
        
        let allSchedules: Schedule[] = []
        
        // Si une classe est sélectionnée, ne prendre que ses emplois du temps
        if (state.selectedClass) {
            const selectedClassData = schedule.classes.find(
                (cls: Class) => cls.classe_id === state.selectedClass
            )
            if (selectedClassData) {
                allSchedules = selectedClassData.schedules
            }
        } else {
            // Sinon, prendre tous les emplois du temps
            schedule.classes.forEach((cls: Class) => {
                allSchedules = [...allSchedules, ...cls.schedules]
            })
        }
        
        return allSchedules
    }, [schedule, state.selectedClass])

    // Handlers
    const handleDepartmentChange = (departmentId: number) => {
        setState(prev => ({ ...prev, selectedDepartment: departmentId, selectedClass: null }))
    }

    const handleClassChange = (classId: number | null) => {
        setState(prev => ({ ...prev, selectedClass: classId }))
    }

    const handleDateChange = (date: Date) => {
        setState(prev => ({ 
            ...prev, 
            currentWeekStart: startOfWeek(date, { weekStartsOn: 1 })
        }))
    }

    const handlePreviousWeek = () => {
        setState(prev => ({
            ...prev,
            currentWeekStart: addWeeks(prev.currentWeekStart, -1)
        }))
    }

    const handleNextWeek = () => {
        setState(prev => ({
            ...prev,
            currentWeekStart: addWeeks(prev.currentWeekStart, 1)
        }))
    }

    const handleToday = () => {
        setState(prev => ({
            ...prev,
            currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 })
        }))
    }

    // Format de la période affichée
    const weekPeriod = useMemo(() => {
        const start = state.currentWeekStart
        const end = endOfWeek(start, { weekStartsOn: 1 })
        return `${format(start, 'd MMMM', { locale: fr })} - ${format(end, 'd MMMM yyyy', { locale: fr })}`
    }, [state.currentWeekStart])

    if (!departements || departements.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des départements...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
            <div className="max-w-[1920px] mx-auto">
                {/* En-tête */}
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">
                        Emploi du temps
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        {weekPeriod}
                    </p>
                </div>

                {/* Filtres */}
                <DashboardFilters
                    departments={departements}
                    classes={classes}
                    selectedDepartment={state.selectedDepartment}
                    selectedClass={state.selectedClass}
                    selectedDate={state.currentWeekStart}
                    onDepartmentChange={handleDepartmentChange}
                    onClassChange={handleClassChange}
                    onDateChange={handleDateChange}
                    onPreviousWeek={handlePreviousWeek}
                    onNextWeek={handleNextWeek}
                    onToday={handleToday}
                />

                {/* Calendrier */}
                {state.loading ? (
                    <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Chargement de l'emploi du temps...</p>
                        </div>
                    </div>
                ) : (
                    <WeeklyCalendar 
                        schedules={filteredSchedules}
                        currentWeekStart={state.currentWeekStart}
                    />
                )}
            </div>
        </div>
    )
}