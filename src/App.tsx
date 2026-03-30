import { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage";

export type Expense = {
  id: number;
  amount: number;
  category: string;
  note: string;
};

export type FixedExpense = {
  id: number;
  name: string;
  amount: number;
  dueDay: number;
};

export default function App() {
  const [money, setMoney] = useState<number>(() => {
    const saved = localStorage.getItem("money");
    return saved ? Number(saved) : 0;
  });

  const [paydayDay, setPaydayDay] = useState<number>(() => {
    const saved = localStorage.getItem("paydayDay");
    return saved ? Number(saved) : 15;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(() => {
    const saved = localStorage.getItem("fixedExpenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("Jedlo");
  const [newExpenseNote, setNewExpenseNote] = useState("");

  const [newFixedName, setNewFixedName] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");
  const [newFixedDay, setNewFixedDay] = useState("");

  useEffect(() => {
    localStorage.setItem("money", money.toString());
  }, [money]);

  useEffect(() => {
    localStorage.setItem("paydayDay", paydayDay.toString());
  }, [paydayDay]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("fixedExpenses", JSON.stringify(fixedExpenses));
  }, [fixedExpenses]);

  const addExpense = () => {
    const amount = Number(newExpenseAmount);

    if (!amount || amount <= 0 || !newExpenseCategory.trim()) {
      return;
    }

    const expense: Expense = {
      id: Date.now(),
      amount,
      category: newExpenseCategory.trim(),
      note: newExpenseNote.trim(),
    };

    setExpenses((prev) => [expense, ...prev]);
    setNewExpenseAmount("");
    setNewExpenseCategory("Jedlo");
    setNewExpenseNote("");
  };

  const addFixedExpense = () => {
    const amount = Number(newFixedAmount);
    const dueDay = Number(newFixedDay);

    if (!newFixedName.trim() || !amount || amount <= 0 || !dueDay || dueDay < 1 || dueDay > 31) {
      return;
    }

    const fixedExpense: FixedExpense = {
      id: Date.now(),
      name: newFixedName.trim(),
      amount,
      dueDay,
    };

    setFixedExpenses((prev) => [fixedExpense, ...prev]);
    setNewFixedName("");
    setNewFixedAmount("");
    setNewFixedDay("");
  };

  const deleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const deleteFixedExpense = (id: number) => {
    setFixedExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const updateExpense = (
    id: number,
    updatedExpense: { amount: number; category: string; note: string }
  ) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  const resetAll = () => {
    setMoney(0);
    setPaydayDay(15);
    setExpenses([]);
    setFixedExpenses([]);
    setNewExpenseAmount("");
    setNewExpenseCategory("Jedlo");
    setNewExpenseNote("");
    setNewFixedName("");
    setNewFixedAmount("");
    setNewFixedDay("");

    localStorage.removeItem("money");
    localStorage.removeItem("paydayDay");
    localStorage.removeItem("expenses");
    localStorage.removeItem("fixedExpenses");
  };

  return (
    <DashboardPage
      money={money}
      paydayDay={paydayDay}
      expenses={expenses}
      fixedExpenses={fixedExpenses}
      newExpenseAmount={newExpenseAmount}
      newExpenseCategory={newExpenseCategory}
      newExpenseNote={newExpenseNote}
      newFixedName={newFixedName}
      newFixedAmount={newFixedAmount}
      newFixedDay={newFixedDay}
      setMoney={setMoney}
      setPaydayDay={setPaydayDay}
      setNewExpenseAmount={setNewExpenseAmount}
      setNewExpenseCategory={setNewExpenseCategory}
      setNewExpenseNote={setNewExpenseNote}
      setNewFixedName={setNewFixedName}
      setNewFixedAmount={setNewFixedAmount}
      setNewFixedDay={setNewFixedDay}
      addExpense={addExpense}
      addFixedExpense={addFixedExpense}
      deleteExpense={deleteExpense}
      deleteFixedExpense={deleteFixedExpense}
      resetAll={resetAll}
      updateExpense={updateExpense}
    />
  );
}