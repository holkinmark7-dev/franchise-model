import { useState } from 'react';
import { T } from '../theme';
import Card from './ui/Card';
import AddonBadge from './ui/Badge';
import InfoTip from './ui/InfoTip';
import { RUB } from '../helpers';

export default function OrgStructure() {
  const [selectedRole, setSelectedRole] = useState(null);

  const departments = [
    {
      name: "Отдел развития", subtitle: "Продажа франшиз", color: T.accent,
      roles: [
        { title: "Руководитель", desc: "Руководит отделом продаж франшиз, формирует стратегию масштабирования сети" },
        { title: "Менеджер по продажам", count: 2, desc: "Работает с входящими заявками, проводит презентации, сопровождает сделку" },
        { title: "Аналитик", desc: "Анализирует рынок, готовит аналитику по городам и конкурентам" },
      ],
    },
    {
      name: "Отдел открытия", subtitle: "Запуск точек", color: T.blue,
      roles: [
        { title: "Руководитель", desc: "Координирует все процессы запуска новой точки от подписания до открытия" },
        { title: "Проект-менеджер", desc: "Ведёт таймлайн проекта, контролирует подрядчиков и сроки" },
        { title: "Дизайнер", desc: "Разрабатывает дизайн-проект помещения в соответствии с брендбуком" },
        { title: "Специалист по снабжению", desc: "Организует закупку оборудования и материалов по оптимальным ценам" },
      ],
    },
    {
      name: "Отдел обучения", color: T.gold,
      roles: [
        { title: "Тренинг-менеджер", desc: "Проводит обучение партнёров и их персонала по стандартам сети" },
        { title: "Методолог", desc: "Разрабатывает учебные материалы, скрипты, регламенты" },
        { title: "Наставник партнёров", desc: "Сопровождает партнёра в первые месяцы работы, помогает с операционкой" },
      ],
    },
    {
      name: "Отдел маркетинга", color: T.green,
      roles: [
        { title: "Руководитель", desc: "Формирует маркетинговую стратегию сети и отдельных точек" },
        { title: "SMM-менеджер", desc: "Ведёт социальные сети бренда, создаёт контент-план" },
        { title: "Таргетолог", desc: "Настраивает и оптимизирует рекламные кампании для привлечения клиентов" },
        { title: "Контент-менеджер", desc: "Создаёт тексты, фото и видео контент для маркетинговых каналов" },
        { title: "Дизайнер", desc: "Создаёт рекламные материалы, баннеры, полиграфию" },
      ],
    },
    {
      name: "Отдел поддержки", subtitle: "Поддержка партнёров", color: T.purple,
      roles: [
        { title: "Куратор партнёров", count: 3, desc: "Персональный менеджер, который помогает партнёру с операционными вопросами ежедневно" },
        { title: "Аналитик", desc: "Анализирует показатели точек, формирует рекомендации по улучшению" },
        { title: "Техподдержка", desc: "Решает технические вопросы: CRM, кассы, оборудование" },
      ],
    },
  ];

  const serviceDepts = [
    { name: "IT-отдел", color: T.blueL, roles: [{ title: "Разработчик" }, { title: "CRM-специалист" }] },
    { name: "HR-отдел", color: T.greenL, roles: [{ title: "Рекрутер" }, { title: "Кадровик" }] },
    { name: "Юридический отдел", color: T.gray, roles: [{ title: "Юрист" }] },
  ];

  const totalPeople = departments.reduce((s, d) => s + d.roles.reduce((a, ro) => a + (ro.count || 1), 0), 0) +
    serviceDepts.reduce((s, d) => s + d.roles.length, 0) + 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AddonBadge price={`от 10 000 ${RUB}`} />
      <div style={{ fontSize: 10, color: T.gray, letterSpacing: 1.5, textTransform: "uppercase" }}>
        Орг. структура {String.fromCharCode(183)} Команда управляющей компании
      </div>

      <Card style={{ padding: 14, textAlign: "center", borderTop: `2px solid ${T.accent}`, position: "relative" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.white }}>Генеральный директор УК</div>
        <div style={{ fontSize: 10, color: T.gray, marginTop: 2 }}>Управление всеми процессами</div>
        <div style={{ position: "absolute", bottom: -11, left: "50%", width: 2, height: 10, background: T.border }} />
      </Card>

      <div style={{ height: 2, background: T.border, margin: "0 20px", borderRadius: 1 }} />

      {departments.map((dept, di) => (
        <Card key={di} style={{ borderLeft: `3px solid ${dept.color}`, overflow: "hidden" }}>
          <div style={{
            padding: "10px 14px", borderBottom: `1px solid ${T.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.white }}>{dept.name}</div>
              {dept.subtitle && <div style={{ fontSize: 9, color: dept.color, marginTop: 1 }}>{dept.subtitle}</div>}
            </div>
            <span style={{ fontSize: 10, color: dept.color, fontWeight: 600 }}>
              {dept.roles.reduce((a, ro) => a + (ro.count || 1), 0)} чел.
            </span>
          </div>
          {dept.roles.map((role, ri) => (
            <div key={ri}
              onClick={() => setSelectedRole(selectedRole === `${di}-${ri}` ? null : `${di}-${ri}`)}
              style={{
                padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
                borderBottom: ri < dept.roles.length - 1 ? `1px solid ${T.border}` : "none",
                cursor: "pointer", background: selectedRole === `${di}-${ri}` ? `${dept.color}08` : "transparent",
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: `${dept.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: dept.color, fontWeight: 700, flexShrink: 0,
              }}>
                {role.title[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: T.white, display: "flex", alignItems: "center", gap: 4 }}>
                  {role.title}
                  {role.count && role.count > 1 && (
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10, background: `${dept.color}22`, color: dept.color }}>
                      x{role.count}
                    </span>
                  )}
                </div>
                {selectedRole === `${di}-${ri}` && role.desc && (
                  <div style={{ fontSize: 10, color: T.gray, marginTop: 4, lineHeight: 1.5 }}>{role.desc}</div>
                )}
              </div>
            </div>
          ))}
        </Card>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {serviceDepts.map((dept, di) => (
          <Card key={di} style={{ padding: 10, borderTop: `2px solid ${dept.color}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.white, marginBottom: 6 }}>{dept.name}</div>
            {dept.roles.map((role, ri) => (
              <div key={ri} style={{ fontSize: 9, color: T.gray, marginBottom: 2 }}>{role.title}</div>
            ))}
          </Card>
        ))}
      </div>

      <Card style={{ padding: 16, textAlign: "center", borderTop: `2px solid ${T.accent}` }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: T.accent }}>{totalPeople}+</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.white, marginTop: 2 }}>специалистов работают на успех каждого партнёра</div>
      </Card>

      <div style={{ padding: 12, background: `${T.accent}08`, borderRadius: 8, border: `1px solid ${T.accent}22` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <InfoTip text="Структура настраивается под вашу франшизу. Количество отделов и ролей зависит от масштаба сети." />
          <span style={{ fontSize: 10, color: T.gray }}>Нажмите на роль для описания</span>
        </div>
      </div>
    </div>
  );
}
