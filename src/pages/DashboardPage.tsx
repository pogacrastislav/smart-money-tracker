import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Expense, FixedExpense } from "../App";

type DashboardPageProps = {
  money?: number;
  paydayDay?: number;
  expenses?: Expense[];
  fixedExpenses?: FixedExpense[];
  newExpenseAmount?: string;
  newExpenseCategory?: string;
  newExpenseNote?: string;
  newFixedName?: string;
  newFixedAmount?: string;
  newFixedDay?: string;
  setMoney?: (value: number) => void;
  setPaydayDay?: (value: number) => void;
  setNewExpenseAmount?: (value: string) => void;
  setNewExpenseCategory?: (value: string) => void;
  setNewExpenseNote?: (value: string) => void;
  setNewFixedName?: (value: string) => void;
  setNewFixedAmount?: (value: string) => void;
  setNewFixedDay?: (value: string) => void;
  addExpense?: () => void;
  addFixedExpense?: () => void;
  deleteExpense?: (id: number) => void;
  deleteFixedExpense?: (id: number) => void;
  resetAll?: () => void;
  updateExpense?: (
    id: number,
    updatedExpense: { amount: number; category: string; note: string }
  ) => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  Jedlo: "#10b981",
  Auto: "#3b82f6",
  Zábava: "#a855f7",
  Bývanie: "#f97316",
  Ostatné: "#64748b",
};

export default function DashboardPage({
  money = 0,
  paydayDay = 15,
  expenses = [],
  fixedExpenses = [],
  newExpenseAmount = "",
  newExpenseCategory = "Jedlo",
  newExpenseNote = "",
  newFixedName = "",
  newFixedAmount = "",
  newFixedDay = "",
  setMoney,
  setPaydayDay,
  setNewExpenseAmount,
  setNewExpenseCategory,
  setNewExpenseNote,
  setNewFixedName,
  setNewFixedAmount,
  setNewFixedDay,
  addExpense,
  addFixedExpense,
  deleteExpense,
  deleteFixedExpense,
  resetAll,
  updateExpense,
}: DashboardPageProps) {
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [editingCategory, setEditingCategory] = useState("Jedlo");
  const [editingNote, setEditingNote] = useState("");

  const today = new Date();
  const currentDay = today.getDate();

  let daysLeft = paydayDay - currentDay;
  if (daysLeft < 0) daysLeft += 30;
  if (daysLeft === 0) daysLeft = 30;

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalFixed = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = money - totalExpenses - totalFixed;
  const perDay = daysLeft > 0 ? remaining / daysLeft : remaining;

  const status =
    remaining < 100 ? "POZOR" : remaining < 250 ? "OPATRNE" : "SAFE";

  const statusText =
    remaining < 100
      ? "Rozpočet je už dosť napnutý. Brzdi trošku."
      : remaining < 250
        ? "Stále v pohode, ale radšej si dávaj pozor."
        : "Vyzerá to dobre. Zatiaľ to držíš pod kontrolou.";

  const statusStyles =
    remaining < 100
      ? "from-red-500 to-rose-500"
      : remaining < 250
        ? "from-yellow-400 to-orange-400"
        : "from-emerald-500 to-green-500";

  const cardClass =
    "rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]";

  const sectionTitleClass =
    "mb-5 text-2xl font-extrabold tracking-tight text-slate-900";

  const inputClass =
    "w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100";

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Jedlo":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Auto":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Zábava":
        return "bg-violet-100 text-violet-700 border border-violet-200";
      case "Bývanie":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const expenseByCategory = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const startEditingExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditingAmount(expense.amount.toString());
    setEditingCategory(expense.category);
    setEditingNote(expense.note);
  };

  const cancelEditingExpense = () => {
    setEditingExpenseId(null);
    setEditingAmount("");
    setEditingCategory("Jedlo");
    setEditingNote("");
  };

  const saveEditedExpense = (id: number) => {
    const amount = Number(editingAmount);

    if (!amount || amount <= 0) return;

    updateExpense?.(id, {
      amount,
      category: editingCategory,
      note: editingNote.trim(),
    });

    cancelEditingExpense();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white/90 px-8 py-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl shadow-lg">
              💸
            </div>

            <div className="min-w-0">
              <h1 className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-3xl font-black leading-[1.2] tracking-tight text-transparent md:text-4xl xl:text-5xl">
                Smart Money Tracker
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600 md:text-base">
                Jednoduchý prehľad, koľko ti zostáva do výplaty a kde miznú
                peniaze.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mb-10 rounded-[2rem] bg-gradient-to-r ${statusStyles} p-[2px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]`}
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-white px-6 py-6 md:px-10 md:py-8">
            <div
              className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${statusStyles} opacity-20 blur-3xl`}
            />

            <div className="relative z-10 grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow">
                  ⚠️ {status}
                </span>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                  Stav rozpočtu
                </h2>

                <p className="mt-3 max-w-xl text-lg font-medium text-slate-600">
                  {statusText}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Zostáva</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {remaining.toFixed(2)} €
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Na deň</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {perDay.toFixed(2)} €
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">
                    Do výplaty
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {daysLeft} dní
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className={cardClass}>
            <p className="text-sm font-bold text-slate-500">💰 Aktuálne peniaze</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {money.toFixed(2)} €
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-sm font-bold text-slate-500">📅 Do výplaty</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {daysLeft} dní
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-sm font-bold text-slate-500">🧾 Bežné výdavky</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {totalExpenses.toFixed(2)} €
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-sm font-bold text-slate-500">🏠 Fixné výdavky</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {totalFixed.toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 xl:grid-cols-2">
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Základné nastavenie</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Koľko máš teraz (€)
                </label>
                <input
                  type="number"
                  min="0"
                  value={money}
                  onChange={(e) => setMoney?.(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Deň výplaty v mesiaci
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={paydayDay}
                  onChange={(e) => setPaydayDay?.(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              <button
                onClick={() => resetAll?.()}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
              >
                Resetovať všetko
              </button>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Prehľad</h3>

            <div className="space-y-4 text-lg">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">📅 Do výplaty</span>
                <span className="font-black text-slate-950">{daysLeft} dní</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">🧾 Bežné výdavky</span>
                <span className="font-black text-slate-950">
                  {totalExpenses.toFixed(2)} €
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">🏠 Fixné výdavky</span>
                <span className="font-black text-slate-950">
                  {totalFixed.toFixed(2)} €
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">🪙 Zostáva ti</span>
                <span className="font-black text-slate-950">
                  {remaining.toFixed(2)} €
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">📊 Na deň</span>
                <span className="font-black text-slate-950">
                  {perDay.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 xl:grid-cols-2">
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Pridať výdavok</h3>

            <div className="space-y-4">
              <input
                type="number"
                min="0"
                placeholder="Suma"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount?.(e.target.value)}
                className={inputClass}
              />

              <select
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory?.(e.target.value)}
                className={inputClass}
              >
                <option>Jedlo</option>
                <option>Auto</option>
                <option>Zábava</option>
                <option>Bývanie</option>
                <option>Ostatné</option>
              </select>

              <input
                type="text"
                placeholder="Poznámka"
                value={newExpenseNote}
                onChange={(e) => setNewExpenseNote?.(e.target.value)}
                className={inputClass}
              />

              <button
                onClick={() => addExpense?.()}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
              >
                Pridať výdavok
              </button>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Pridať fixný výdavok</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Názov (napr. nájom)"
                value={newFixedName}
                onChange={(e) => setNewFixedName?.(e.target.value)}
                className={inputClass}
              />

              <input
                type="number"
                min="0"
                placeholder="Suma"
                value={newFixedAmount}
                onChange={(e) => setNewFixedAmount?.(e.target.value)}
                className={inputClass}
              />

              <input
                type="number"
                min="1"
                max="31"
                placeholder="Deň splatnosti"
                value={newFixedDay}
                onChange={(e) => setNewFixedDay?.(e.target.value)}
                className={inputClass}
              />

              <button
                onClick={() => addFixedExpense?.()}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
              >
                Pridať fixný výdavok
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className={cardClass}>
            <div className="mb-4">
              <h3 className={sectionTitleClass}>Graf výdavkov podľa kategórií</h3>
              <p className="text-sm font-medium text-slate-500">
                Rýchly vizuálny prehľad, kam ti tečú peniaze.
              </p>
            </div>

            {chartData.length === 0 ? (
              <p className="text-lg font-medium text-slate-500">
                Zatiaľ nie sú žiadne výdavky do grafu.
              </p>
            ) : (
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={115}
                      innerRadius={55}
                      paddingAngle={4}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={CATEGORY_COLORS[entry.name] || "#64748b"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toFixed(2)} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Výdavky</h3>

            {expenses.length === 0 ? (
              <p className="text-lg font-medium text-slate-500">
                Zatiaľ žiadne výdavky.
              </p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    {editingExpenseId === expense.id ? (
                      <div className="space-y-3">
                        <input
                          type="number"
                          min="0"
                          value={editingAmount}
                          onChange={(e) => setEditingAmount(e.target.value)}
                          className={inputClass}
                          placeholder="Suma"
                        />

                        <select
                          value={editingCategory}
                          onChange={(e) => setEditingCategory(e.target.value)}
                          className={inputClass}
                        >
                          <option>Jedlo</option>
                          <option>Auto</option>
                          <option>Zábava</option>
                          <option>Bývanie</option>
                          <option>Ostatné</option>
                        </select>

                        <input
                          type="text"
                          value={editingNote}
                          onChange={(e) => setEditingNote(e.target.value)}
                          className={inputClass}
                          placeholder="Poznámka"
                        />

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => saveEditedExpense(expense.id)}
                            className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-emerald-700"
                          >
                            Uložiť
                          </button>

                          <button
                            onClick={cancelEditingExpense}
                            className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            Zrušiť
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getCategoryStyle(
                              expense.category
                            )}`}
                          >
                            {expense.category}
                          </span>

                          <p className="text-sm font-medium text-slate-500">
                            {expense.note || "Bez poznámky"}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-black text-slate-950">
                            -{expense.amount.toFixed(2)} €
                          </p>

                          <button
                            onClick={() => startEditingExpense(expense)}
                            className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            Upraviť
                          </button>

                          <button
                            onClick={() => deleteExpense?.(expense.id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                          >
                            Zmazať
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Fixné výdavky</h3>

            {fixedExpenses.length === 0 ? (
              <p className="text-lg font-medium text-slate-500">
                Zatiaľ žiadne fixné výdavky.
              </p>
            ) : (
              <div className="space-y-3">
                {fixedExpenses.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-base font-black text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-sm font-medium text-slate-500">
                          Splatnosť: {item.dueDay}. deň v mesiaci
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-lg font-black text-slate-950">
                          -{item.amount.toFixed(2)} €
                        </p>
                        <button
                          onClick={() => deleteFixedExpense?.(item.id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                        >
                          Zmazať
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}