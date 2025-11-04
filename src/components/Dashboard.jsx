import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, StickyNote, Wallet, Activity, Smile, Plus, Trash2, Save } from 'lucide-react';
import Card from './Card';

// Local storage helpers
const useLocal = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (_) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (_) {
      /* ignore */
    }
  }, [key, state]);
  return [state, setState];
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <GoalsCard />
      <NotesCard />
      <FinanceCard />
      <HealthMoodCard />
    </div>
  );
}

function NeumoButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-xl bg-gradient-to-br from-white/70 to-white/20 dark:from-slate-800/70 dark:to-slate-800/20 border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),8px_8px_20px_rgba(0,0,0,0.2),-6px_-6px_16px_rgba(255,255,255,0.6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),12px_12px_28px_rgba(0,0,0,0.25),-8px_-8px_20px_rgba(255,255,255,0.7)] transition-all ${className}`}
    >
      {children}
    </button>
  );
}

function InputBase({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 px-3 py-2 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-sky-300/60 dark:focus:ring-sky-500/40 transition ${className}`}
    />
  );
}

function TextAreaBase({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 px-3 py-2 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-sky-300/60 dark:focus:ring-sky-500/40 transition ${className}`}
    />
  );
}

function GoalsCard() {
  const [goals, setGoals] = useLocal('goals', []);
  const [text, setText] = useState('');

  const addGoal = () => {
    if (!text.trim()) return;
    setGoals([{ id: crypto.randomUUID(), text: text.trim(), done: false }, ...goals]);
    setText('');
  };

  const toggle = (id) => setGoals(goals.map(g => (g.id === id ? { ...g, done: !g.done } : g)));
  const remove = (id) => setGoals(goals.filter(g => g.id !== id));

  return (
    <Card title="Daily Goals" icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}> 
      <div className="flex gap-2 mb-3">
        <InputBase
          placeholder="Add a goal..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
        />
        <NeumoButton onClick={addGoal} aria-label="Add goal">
          <Plus className="h-4 w-4" />
        </NeumoButton>
      </div>
      <ul className="space-y-2 max-h-56 overflow-auto pr-1">
        <AnimatePresence initial={false}>
          {goals.map((g) => (
            <motion.li
              key={g.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-white/50 dark:bg-slate-900/40 border border-white/40 dark:border-white/10"
            >
              <label className="flex items-center gap-3 w-full cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={g.done}
                  onChange={() => toggle(g.id)}
                  className="h-4 w-4 accent-emerald-500"
                />
                <span className={`flex-1 ${g.done ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>{g.text}</span>
              </label>
              <NeumoButton onClick={() => remove(g.id)} aria-label="Remove goal" className="p-2">
                <Trash2 className="h-4 w-4" />
              </NeumoButton>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}

function NotesCard() {
  const [note, setNote] = useLocal('note', '');
  const [savedAt, setSavedAt] = useState(null);

  const save = () => {
    setNote(note);
    setSavedAt(new Date());
  };

  return (
    <Card title="Notes" icon={<StickyNote className="h-5 w-5 text-violet-500" />}>
      <TextAreaBase
        rows={8}
        placeholder="Quick thoughts, ideas, scratchpad..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Autosaves to your browser'}
        </div>
        <NeumoButton onClick={save} className="inline-flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </NeumoButton>
      </div>
    </Card>
  );
}

function FinanceCard() {
  const [tx, setTx] = useLocal('finances', []); // {id, label, amount}
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');

  const add = () => {
    const val = parseFloat(amount);
    if (!label.trim() || isNaN(val)) return;
    setTx([{ id: crypto.randomUUID(), label: label.trim(), amount: val }, ...tx]);
    setLabel('');
    setAmount('');
  };
  const remove = (id) => setTx(tx.filter(t => t.id !== id));
  const balance = useMemo(() => tx.reduce((sum, t) => sum + t.amount, 0), [tx]);

  return (
    <Card title="Finances" icon={<Wallet className="h-5 w-5 text-sky-500" />}>
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
        <InputBase className="sm:col-span-2" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <InputBase className="sm:col-span-2" placeholder="Amount (+income / -expense)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <NeumoButton onClick={add} className="sm:col-span-1 w-full inline-flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> Add
        </NeumoButton>
      </div>

      <div className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 mb-3">
        <span className="text-sm text-slate-600 dark:text-slate-300">Balance</span>
        <span className={`font-semibold ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
        </span>
      </div>

      <ul className="space-y-2 max-h-44 overflow-auto pr-1">
        <AnimatePresence initial={false}>
          {tx.map((t) => (
            <motion.li key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-white/50 dark:bg-slate-900/40 border border-white/40 dark:border-white/10">
              <div className="flex-1">
                <div className="font-medium">{t.label}</div>
                <div className="text-xs text-slate-500">{new Date(parseInt(t.id.split('-')[0], 16)).toLocaleString?.() || ''}</div>
              </div>
              <div className={`font-semibold ${t.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{t.amount >= 0 ? '+' : ''}{t.amount.toFixed(2)}</div>
              <NeumoButton onClick={() => remove(t.id)} aria-label="Remove transaction" className="p-2">
                <Trash2 className="h-4 w-4" />
              </NeumoButton>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}

function HealthMoodCard() {
  const [health, setHealth] = useLocal('health', { water: 0, steps: 0, sleep: 8 });
  const [mood, setMood] = useLocal('mood', { value: '🙂', note: '' });

  const moods = ['😔', '🙁', '😐', '🙂', '😄'];

  return (
    <Card title="Health & Mood" icon={<Activity className="h-5 w-5 text-rose-500" />}>
      <div className="space-y-4">
        <div className="rounded-2xl p-3 bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Water</span>
            <span className="font-semibold">{health.water} cups</span>
          </div>
          <div className="flex gap-2">
            <NeumoButton onClick={() => setHealth({ ...health, water: Math.max(0, health.water - 1) })}>-</NeumoButton>
            <NeumoButton onClick={() => setHealth({ ...health, water: health.water + 1 })}>+</NeumoButton>
          </div>
        </div>

        <div className="rounded-2xl p-3 bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Steps</span>
            <span className="font-semibold">{health.steps.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <NeumoButton onClick={() => setHealth({ ...health, steps: Math.max(0, health.steps - 500) })}>-500</NeumoButton>
            <NeumoButton onClick={() => setHealth({ ...health, steps: health.steps + 500 })}>+500</NeumoButton>
          </div>
        </div>

        <div className="rounded-2xl p-3 bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Sleep</span>
            <span className="font-semibold">{health.sleep} h</span>
          </div>
          <input type="range" min="0" max="12" value={health.sleep} onChange={(e) => setHealth({ ...health, sleep: Number(e.target.value) })}
            className="w-full accent-sky-500" />
        </div>

        <div className="rounded-2xl p-3 bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Mood</span>
            </div>
            <span className="text-xl">{mood.value}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {moods.map(m => (
              <NeumoButton key={m} onClick={() => setMood({ ...mood, value: m })} className={`${mood.value === m ? 'ring-2 ring-sky-400' : ''}`}>{m}</NeumoButton>
            ))}
          </div>
          <TextAreaBase rows={3} placeholder="How are you feeling?" value={mood.note} onChange={(e) => setMood({ ...mood, note: e.target.value })} />
        </div>
      </div>
    </Card>
  );
}
