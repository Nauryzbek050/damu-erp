"use client";

import { useState } from "react";

type Section =
  | "dashboard"
  | "products"
  | "new-product"
  | "china"
  | "wb"
  | "kaspi"
  | "profit"
  | "settings";

const products = [
  {
    code: "D-003",
    name: "JRL машинка",
    home: 61,
    china: 0,
    wbTransit: 16,
    wbWarehouse: 0,
    kaspi: 1,
    cost: "29 500 ₸",
    profit: "719 100 ₸",
  },
  {
    code: "D-004",
    name: "Jump Starter",
    home: 31,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 4,
    kaspi: 1,
    cost: "17 400 ₸",
    profit: "261 780 ₸",
  },
  {
    code: "D-012",
    name: "Раскладной стул-шезлонг",
    home: 12,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: "—",
    profit: "0 ₸",
  },
  {
    code: "D-020",
    name: "PROPLAST LUXE орындық",
    home: 8,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: "9 700 ₸",
    profit: "0 ₸",
  },
];

const menuItems: { id: Section; label: string }[] = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "products", label: "📦 Тауарлар" },
  { id: "new-product", label: "➕ Жаңа тауар" },
  { id: "china", label: "🚛 Қытай → Үй" },
  { id: "wb", label: "🟣 Wildberries" },
  { id: "kaspi", label: "🟠 Kaspi" },
  { id: "profit", label: "📈 Пайда" },
  { id: "settings", label: "⚙️ Баптаулар" },
];

export default function Home() {
const [section, setSection] = useState<Section>("dashboard");

  return (

    <main className="min-h-screen bg-slate-100 text-slate-900">

      <div className="flex min-h-screen">

        <aside className="w-64 shrink-0 bg-slate-950 p-5 text-white">

          <div className="mb-8">

            <h1 className="text-2xl font-bold">ДАМУ</h1>

            <p className="mt-1 text-sm text-slate-400">

              Бизнес басқару жүйесі

            </p>

          </div>

          <nav className="space-y-2">

            {menuItems.map((item) => (

              <button

                key={item.id}

                onClick={() => setSection(item.id)}

                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${

                  section === item.id

                    ? "bg-blue-600 text-white"

                    : "text-slate-300 hover:bg-slate-800"

                }`}

              >

                {item.label}

              </button>

            ))}

          </nav>

        </aside>

        <section className="flex-1 p-6 md:p-8">

          <header className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="text-3xl font-bold">

                {menuItems.find((item) => item.id === section)?.label}

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                ДАМУ жүйесінің жұмыс бөлімі

              </p>

            </div>

            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">

              Наурызбек

            </div>

          </header>

          {section === "dashboard" && <Dashboard />}

          {section === "products" && <Products />}

          {section === "new-product" && <NewProduct />}

          {section === "china" && <China />}

          {section === "wb" && <Wildberries />}

          {section === "kaspi" && <Kaspi />}

          {section === "profit" && <Profit />}

          {section === "settings" && <Settings />}

        </section>

      </div>

    </main>

  );

}

function Dashboard() {

  return (

    <>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard title="Жалпы пайда" value="1 504 780 ₸" note="Барлық кезең" />

        <StatCard title="Шілде пайдасы" value="758 780 ₸" note="Ағымдағы ай" />

        <StatCard title="Үйдегі тауар" value="158 дана" note="Белсенді қалдық" />

        <StatCard title="Жолдағы тауар" value="27 дана" note="WB, Kaspi, Қытай" />

      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">

        <div className="mb-5">

          <h3 className="text-xl font-bold">Негізгі тауарлар</h3>

          <p className="text-sm text-slate-500">Қоймадағы соңғы мәліметтер</p>

        </div>

        <ProductTable />

      </div>

    </>

  );

}

function Products() {

  return (

    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h3 className="text-xl font-bold">Барлық тауарлар</h3>

          <p className="text-sm text-slate-500">

            D-кодтар бойынша қойма тізімі

          </p>

        </div>

        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">

          + Жаңа тауар

        </button>

      </div>

      <ProductTable />

    </div>

  );

}

function ProductTable() {

  return (

    <div className="overflow-x-auto">

      <table className="w-full min-w-[950px] text-left text-sm">

        <thead>

          <tr className="border-b text-slate-500">

            <th className="px-3 py-3">Код</th>

            <th className="px-3 py-3">Тауар атауы</th>

            <th className="px-3 py-3">🏠 Үйде</th>

            <th className="px-3 py-3">🚛 Қытай</th>

            <th className="px-3 py-3">🟣 WB жолда</th>

            <th className="px-3 py-3">🏢 WB қойма</th>

            <th className="px-3 py-3">🟠 Kaspi</th>

            <th className="px-3 py-3">Өзіндік құн</th>
            <th className="px-3 py-3">Пайда</th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr

              key={product.code}

              className="border-b last:border-0 hover:bg-slate-50"

            >

              <td className="px-3 py-4 font-bold text-blue-600">

                {product.code}

              </td>

              <td className="px-3 py-4 font-medium">{product.name}</td>

              <td className="px-3 py-4">{product.home}</td>

              <td className="px-3 py-4">{product.china}</td>

              <td className="px-3 py-4">{product.wbTransit}</td>

              <td className="px-3 py-4">{product.wbWarehouse}</td>

              <td className="px-3 py-4">{product.kaspi}</td>

              <td className="px-3 py-4">{product.cost}</td>

              <td className="px-3 py-4 font-semibold">{product.profit}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

function NewProduct() {

  return (

    <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">Жаңа тауар қосу</h3>

      <div className="mt-6 grid gap-4">

        <Input label="Тауар коды" placeholder="D-022" />

        <Input label="Тауар атауы" placeholder="Тауар атауы" />

        <Input label="Өзіндік құны" placeholder="0 ₸" />

        <Input label="Үйдегі саны" placeholder="0" />

        <button className="mt-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">

          Сақтау

        </button>

      </div>

    </div>

  );

}

function China() {

  return (

    <EmptyCard

      title="Қытай → Үй"

      text="Қытайдан келе жатқан тауарлар осы жерде көрсетіледі."

    />

  );

}

function Wildberries() {

  return (

    <EmptyCard

      title="Wildberries"

      text="WB жолдағы және қоймадағы тауарлар осы бөлімде болады."

    />

  );

}

function Kaspi() {

  return (

    <EmptyCard

      title="Kaspi"

      text="Kaspi тапсырыстары мен жолдағы тауарлар осы жерде көрсетіледі."

    />

  );

}

function Profit() {

  return (

    <div className="grid gap-4 md:grid-cols-3">

      <StatCard title="Жалпы пайда" value="1 504 780 ₸" note="Барлық кезең" />

      <StatCard title="Шілде" value="758 780 ₸" note="Ағымдағы ай" />

      <StatCard title="Ең пайдалы тауар" value="D-003" note="719 100 ₸" />

    </div>

  );

}

function Settings() {

  return (

    <EmptyCard

      title="Баптаулар"

      text="Профиль, валюта, ескертулер және жүйе параметрлері осы жерде болады."

    />

  );

}

function StatCard({

  title,

  value,

  note,

}: {

  title: string;

  value: string;

  note: string;

}) {

  return (

    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 text-2xl font-bold">{value}</p>

      <p className="mt-2 text-xs text-blue-600">{note}</p>

    </div>

  );

}

function Input({

  label,

  placeholder,

}: {

  label: string;

  placeholder: string;

}) {

  return (

    <label className="grid gap-2">

      <span className="text-sm font-medium">{label}</span>

      <input

        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"

        placeholder={placeholder}

      />

    </label>

  );

}

function EmptyCard({ title, text }: { title: string; text: string }) {

  return (

    <div className="rounded-2xl bg-white p-8 shadow-sm">

      <h3 className="text-2xl font-bold">{title}</h3>

      <p className="mt-3 text-slate-500">{text}</p>

    </div>

  );

}