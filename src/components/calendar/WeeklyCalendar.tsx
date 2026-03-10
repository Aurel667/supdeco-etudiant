import { useMemo, useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

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

interface WeeklyCalendarProps {
    schedules: Schedule[];
    currentWeekStart: Date;
}

const HOUR_HEIGHT = 60;
const HOUR_HEIGHT_MOBILE = 70;
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7h à 21h
const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return isMobile;
}

export default function WeeklyCalendar({ schedules, currentWeekStart }: WeeklyCalendarProps) {
    const isMobile = useIsMobile();
    const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
        // Default to today if it's in the current week, otherwise Monday
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            if (isSameDay(addDays(currentWeekStart, i), today)) return i;
        }
        return 0;
    });

    // Reset selected day when week changes
    useEffect(() => {
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            if (isSameDay(addDays(currentWeekStart, i), today)) {
                setSelectedDayIndex(i);
                return;
            }
        }
        setSelectedDayIndex(0);
    }, [currentWeekStart]);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
    }, [currentWeekStart]);

    const schedulesByDate = useMemo(() => {
        const map = new Map<string, Schedule[]>();
        schedules.forEach((schedule) => {
            const existing = map.get(schedule.date) || [];
            map.set(schedule.date, [...existing, schedule]);
        });
        return map;
    }, [schedules]);

    const isToday = (date: Date) => isSameDay(date, new Date());
    const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

    const hourHeight = isMobile ? HOUR_HEIGHT_MOBILE : HOUR_HEIGHT;

    const getCourseStyle = (schedule: Schedule) => {
        const [startH, startM] = schedule.startTime.split(':').map(Number);
        const [endH, endM] = schedule.endTime.split(':').map(Number);
        const startMinutes = (startH - 7) * 60 + startM;
        const endMinutes = (endH - 7) * 60 + endM;
        const duration = endMinutes - startMinutes;
        return {
            top: (startMinutes / 60) * hourHeight,
            height: Math.max((duration / 60) * hourHeight, isMobile ? 56 : 40),
        };
    };

    const getTypeColor = (schedule: Schedule): string => {
        if (schedule.statut_annule === 1) return 'bg-red-500';
        switch (schedule.type?.toLowerCase()) {
            case 'cours': return 'bg-blue-900';
            case 'evenement': case 'examen': return 'bg-green-600';
            case 'devoirs ou controle continue': return 'bg-yellow-500';
            case 'conferences': return 'bg-purple-600';
            case 'activités': return 'bg-orange-500';
            default: return 'bg-gray-600';
        }
    };

    const getTypeDot = (schedule: Schedule): string => {
        if (schedule.statut_annule === 1) return 'bg-red-400';
        switch (schedule.type?.toLowerCase()) {
            case 'cours': return 'bg-blue-400';
            case 'evenement': case 'examen': return 'bg-green-400';
            case 'devoirs ou controle continue': return 'bg-yellow-400';
            case 'conferences': return 'bg-purple-400';
            case 'activités': return 'bg-orange-400';
            default: return 'bg-gray-400';
        }
    };

    // Mobile: jours à afficher (1 seul jour sélectionné)
    const mobileDays = useMemo(() => {
        return [weekDays[selectedDayIndex]];
    }, [weekDays, selectedDayIndex]);

    const visibleDays = isMobile ? mobileDays : weekDays;

    // Nombre de cours par jour (pour les badges mobiles)
    const courseCountByDay = useMemo(() => {
        return weekDays.map(date => {
            const key = formatDateKey(date);
            return schedulesByDate.get(key)?.length || 0;
        });
    }, [weekDays, schedulesByDate]);

    return (
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile: sélecteur de jour horizontal */}
            {isMobile && (
                <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto px-2 py-2 gap-1">
                    {weekDays.map((date, index) => {
                        const active = index === selectedDayIndex;
                        const today = isToday(date);
                        const count = courseCountByDay[index];
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDayIndex(index)}
                                className={`flex flex-col items-center flex-1 min-w-[48px] py-2 px-1 rounded-xl transition-all ${
                                    active
                                        ? 'bg-blue-900 text-white shadow-md'
                                        : today
                                            ? 'bg-blue-100 text-blue-900'
                                            : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    {DAYS_SHORT[date.getDay()]}
                                </span>
                                <span className="text-lg font-bold mt-0.5">
                                    {format(date, 'd')}
                                </span>
                                {count > 0 && (
                                    <div className={`flex gap-0.5 mt-1`}>
                                        {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white/70' : 'bg-blue-900/40'}`} />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Mobile: titre du jour sélectionné */}
            {isMobile && (
                <div className="px-4 py-2.5 bg-white border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                        {format(weekDays[selectedDayIndex], 'EEEE d MMMM', { locale: fr })}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {courseCountByDay[selectedDayIndex]} cours programmé{courseCountByDay[selectedDayIndex] > 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {/* Desktop: header des jours */}
            {!isMobile && (
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <div className="w-16 flex-shrink-0"></div>
                    <div className="flex-1 flex">
                        {weekDays.map((date, index) => (
                            <div 
                                key={index} 
                                className="flex-1 flex flex-col items-center py-3 border-l border-gray-200"
                            >
                                <span className={`text-xs font-semibold uppercase tracking-wide ${
                                    isToday(date) ? 'text-blue-900' : 'text-gray-500'
                                }`}>
                                    {DAYS_SHORT[date.getDay()]}
                                </span>
                                <span className={`mt-1 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                                    isToday(date) 
                                        ? 'bg-blue-900 text-white' 
                                        : 'text-gray-700'
                                }`}>
                                    {format(date, 'd')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grille du calendrier */}
            <div className="flex overflow-auto">
                {/* Colonne des heures */}
                <div className={`${isMobile ? 'w-12' : 'w-16'} flex-shrink-0 border-r border-gray-200`}>
                    {HOURS.map((hour) => (
                        <div 
                            key={hour} 
                            className={`text-xs text-gray-500 text-right pr-2 ${isMobile ? 'text-[11px]' : ''}`}
                            style={{ height: `${hourHeight}px` }}
                        >
                            {`${hour}h`}
                        </div>
                    ))}
                </div>

                {/* Colonnes des jours */}
                <div className="flex-1 flex relative">
                    {visibleDays.map((date, dayIndex) => {
                        const dateKey = formatDateKey(date);
                        const daySchedules = schedulesByDate.get(dateKey) || [];
                        
                        return (
                            <div 
                                key={dayIndex} 
                                className={`flex-1 relative border-l border-gray-200 ${
                                    isToday(date) ? 'bg-blue-50/30' : ''
                                }`}
                            >
                                {/* Lignes de grille */}
                                {HOURS.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="border-b border-gray-100"
                                        style={{ height: `${hourHeight}px` }}
                                    />
                                ))}
                                
                                {/* Cours */}
                                {daySchedules.map((schedule) => {
                                    const position = getCourseStyle(schedule);
                                    const colorClass = getTypeColor(schedule);
                                    
                                    return (
                                        <div
                                            key={schedule.id}
                                            className={`absolute left-1 right-1 ${colorClass} rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${
                                                isMobile ? 'rounded-lg left-1.5 right-1.5' : ''
                                            }`}
                                            style={{
                                                top: `${position.top}px`,
                                                height: `${position.height}px`,
                                            }}
                                            title={schedule.name}
                                        >
                                            {/* Mobile: contenu plus riche */}
                                            {isMobile ? (
                                                <div className="p-2.5 h-full flex flex-col text-white">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-2 h-2 rounded-full ${getTypeDot(schedule)}`} />
                                                        <span className="text-xs font-bold">
                                                            {schedule.startTime} - {schedule.endTime}
                                                        </span>
                                                    </div>
                                                    <div className={`text-sm font-semibold mt-1 leading-snug ${
                                                        schedule.statut_annule === 1 ? 'line-through opacity-75' : ''
                                                    }`}>
                                                        {schedule.name.split(' - ')[0].replace('cours de ', '')}
                                                    </div>
                                                    {position.height > 65 && (
                                                        <div className="text-xs opacity-90 mt-1 flex items-center gap-1">
                                                            <span>📍</span>
                                                            <span>{schedule.location}</span>
                                                        </div>
                                                    )}
                                                    {position.height > 90 && schedule.name.includes('intervenant') && (
                                                        <div className="text-xs opacity-80 mt-0.5 flex items-center gap-1">
                                                            <span>👤</span>
                                                            <span>{schedule.name.split('intervenant : ')[1]?.split(' - ')[0] || ''}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                /* Desktop: contenu compact */
                                                <div className="p-1.5 h-full flex flex-col text-white text-xs">
                                                    <div className="font-semibold truncate">
                                                        {schedule.startTime} - {schedule.endTime}
                                                    </div>
                                                    <div className={`font-medium truncate mt-0.5 ${
                                                        schedule.statut_annule === 1 ? 'line-through opacity-75' : ''
                                                    }`}>
                                                        {schedule.name.split(' - ')[0].replace('cours de ', '')}
                                                    </div>
                                                    {position.height > 50 && (
                                                        <div className="text-xs opacity-90 truncate mt-0.5">
                                                            📍 {schedule.location}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Légende */}
            <div className={`flex items-center justify-center py-3 px-4 bg-gray-50 border-t border-gray-200 flex-wrap ${
                isMobile ? 'gap-3' : 'gap-6'
            }`}>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                    <span className="text-xs text-gray-600 font-medium">Cours</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span className="text-xs text-gray-600 font-medium">Examen</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-gray-600 font-medium">Contrôle</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-xs text-gray-600 font-medium">Conférence</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600 font-medium">Annulé</span>
                </div>
            </div>
        </div>
    );
}
