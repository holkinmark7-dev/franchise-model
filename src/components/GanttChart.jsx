import { T } from '../theme';
import { RUB } from '../helpers';
import Card from './ui/Card';
import AddonBadge from './ui/Badge';
import InfoTip from './ui/InfoTip';

export default function GanttChart() {
  const totalWeeks = 14;

  const phases = [
    {
      name: "Подготовка", color: T.green,
      tasks: [
        { name: "Подписание договора", start: 0, dur: 0.3, exec: "ФЗИ" },
        { name: "Оплата паушального взноса", start: 0.3, dur: 0.15, exec: "ФЗИ" },
        { name: "Передача материалов и доступов", start: 0.3, dur: 0.3, exec: "УК" },
        { name: "Регистрация ИП/ООО", start: 0.5, dur: 1, exec: "ФЗИ" },
        { name: "Юр. готовность", start: 2, dur: 0, milestone: true },
      ],
    },
    {
      name: "Помещение", color: T.blue,
      tasks: [
        { name: "Подбор помещений (мин. 3)", start: 1.5, dur: 1.5, exec: "ФЗИ" },
        { name: "Согласование с УК", start: 3, dur: 0.3, exec: "УК" },
        { name: "Подписание аренды", start: 3.3, dur: 0.3, exec: "ФЗИ" },
        { name: "Дизайн-проект помещения", start: 3.5, dur: 1, exec: "УК" },
        { name: "Ремонт и отделка", start: 4.5, dur: 2.5, exec: "Подрядчик" },
        { name: "Помещение готово", start: 7, dur: 0, milestone: true },
      ],
    },
    {
      name: "Комплектация", color: T.gold,
      tasks: [
        { name: "Закупка оборудования", start: 5.5, dur: 0.5, exec: "ФЗИ" },
        { name: "Доставка и монтаж", start: 6.5, dur: 1, exec: "Подрядчик" },
        { name: "Мебель и брендинг", start: 7, dur: 1, exec: "Подрядчик" },
        { name: "IT-инфраструктура, CRM", start: 7.5, dur: 0.5, exec: "УК" },
        { name: "Точка укомплектована", start: 9, dur: 0, milestone: true },
      ],
    },
    {
      name: "Персонал", color: T.purple,
      tasks: [
        { name: "Размещение вакансий", start: 6.5, dur: 0.5, exec: "ФЗИ" },
        { name: "Собеседования и отбор", start: 7, dur: 1.5, exec: "ФЗИ" },
        { name: "Обучение персонала", start: 8.5, dur: 1.5, exec: "УК" },
        { name: "Стажировка", start: 10, dur: 1, exec: "УК" },
        { name: "Команда готова", start: 11, dur: 0, milestone: true },
      ],
    },
    {
      name: "Запуск", color: T.red,
      tasks: [
        { name: "Маркетинг запуска", start: 9.5, dur: 2, exec: "УК" },
        { name: "Тестовый период", start: 11.5, dur: 0.7, exec: "ФЗИ" },
        { name: "Корректировки", start: 12, dur: 0.5, exec: "УК" },
        { name: "Официальное открытие", start: 12.5, dur: 0.15, exec: "ФЗИ" },
        { name: "ОТКРЫТИЕ", start: 13, dur: 0, milestone: true },
      ],
    },
  ];

  const execColors = { "ФЗИ": T.green, "УК": T.blue, "Подрядчик": T.gray };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AddonBadge price={`10 000 ${RUB}`} />
      <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
        Процесс открытия {String.fromCharCode(183)} Диаграмма Ганта
      </div>

      <Card style={{ padding: "14px 10px", overflowX: "auto" }}>
        <div style={{ display: "flex", marginBottom: 8, marginLeft: 140, minWidth: totalWeeks * 42 }}>
          {Array.from({ length: totalWeeks }, (_, i) => (
            <div key={i} style={{
              width: 42, fontSize: 8, color: T.gray, textAlign: "center",
              borderLeft: `1px solid ${T.border}`, paddingBottom: 4,
            }}>H{i + 1}</div>
          ))}
        </div>

        {phases.map((phase, pi) => (
          <div key={pi} style={{ marginBottom: 8 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: phase.color, marginBottom: 4,
              padding: "4px 8px", background: `${phase.color}11`, borderRadius: 4, borderLeft: `3px solid ${phase.color}`,
            }}>{phase.name}</div>

            {phase.tasks.map((task, ti) => (
              <div key={ti} style={{
                display: "flex", alignItems: "center", marginBottom: 3, height: 22, minWidth: 140 + totalWeeks * 42,
              }}>
                <div style={{
                  width: 140, flexShrink: 0, fontSize: 9, color: task.milestone ? phase.color : T.white,
                  fontWeight: task.milestone ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", paddingRight: 6,
                }}>
                  {task.milestone ? `${String.fromCharCode(9670)} ${task.name}` : task.name}
                </div>

                <div style={{ position: "relative", flex: 1, height: "100%", minWidth: totalWeeks * 42 }}>
                  {Array.from({ length: totalWeeks }, (_, i) => (
                    <div key={i} style={{
                      position: "absolute", left: i * 42, top: 0, bottom: 0, width: 1,
                      background: T.border, opacity: 0.5,
                    }} />
                  ))}

                  {task.milestone ? (
                    <div style={{
                      position: "absolute", left: (task.start / totalWeeks) * (totalWeeks * 42) - 6,
                      top: 3, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
                      color: phase.color, fontSize: 12, fontWeight: 700,
                    }}>{String.fromCharCode(9670)}</div>
                  ) : (
                    <>
                      <div style={{
                        position: "absolute",
                        left: `${(task.start / totalWeeks) * 100}%`,
                        width: `${(task.dur / totalWeeks) * 100}%`,
                        top: 3, height: 16, borderRadius: 4,
                        background: `${phase.color}44`, border: `1px solid ${phase.color}66`,
                        minWidth: 8,
                      }} />
                      {task.exec && (
                        <div style={{
                          position: "absolute",
                          left: `calc(${((task.start + task.dur) / totalWeeks) * 100}% + 4px)`,
                          top: 4, fontSize: 7, fontWeight: 600, padding: "1px 4px", borderRadius: 3,
                          background: `${execColors[task.exec] || T.gray}22`,
                          color: execColors[task.exec] || T.gray,
                          whiteSpace: "nowrap",
                        }}>{task.exec}</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
          {Object.entries(execColors).map(([name, color]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 9, color: T.gray }}>{name}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: T.gold, fontSize: 10 }}>{String.fromCharCode(9670)}</span>
            <span style={{ fontSize: 9, color: T.gray }}>Milestone</span>
          </div>
        </div>
      </Card>

      <div style={{
        display: "flex", justifyContent: "space-between", padding: "10px 14px",
        background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: 11, color: T.gray }}>Общий срок: ~13 недель {String.fromCharCode(183)} Задач: 20+</span>
      </div>

      <div style={{ padding: 12, background: `${T.accent}08`, borderRadius: 8, border: `1px solid ${T.accent}22` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <InfoTip text="Процесс открытия настраивается под вашу франшизу. Типичный срок: 10-16 недель." />
          <span style={{ fontSize: 10, color: T.gray }}>Процесс и сроки адаптируются под вашу франшизу</span>
        </div>
      </div>
    </div>
  );
}
