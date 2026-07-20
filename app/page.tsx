"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Section =
  | "dashboard"
  | "products"
  | "new-product"
  | "china"
  | "wb"
  | "kaspi"
  | "profit"
  | "settings";

type Product = {
  code: string;
  name: string;
  image?: string;
  home: number;
  china: number;
  wbTransit: number;
  wbWarehouse: number;
  kaspi: number;
  cost: number;
  profit: number;
};

type ProductOperation =
  | "home-to-kaspi"
  | "kaspi-sold"
  | "home-to-wb"
  | "wb-received"
  | "wb-sold"
  | "china-received";

type OperationRecord = {
  id: string;
  date: string;
  code: string;
  name: string;
  operation: ProductOperation;
  quantity: number;
  profit: number;
};

const initialProducts: Product[] = [
  { code: "D-001", name: "Замок", home: 20, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 12500, profit: 0 },
  { code: "D-002", name: "Раскладушка PRO", home: 3, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 30000, profit: -29900 },
  { code: "D-003", name: "JRL машинка", home: 61, china: 0, wbTransit: 16, wbWarehouse: 0, kaspi: 1, cost: 29500, profit: 719100 },
  { code: "D-004", name: "Jump Starter", home: 31, china: 0, wbTransit: 0, wbWarehouse: 4, kaspi: 1, cost: 17400, profit: 261780 },
  { code: "D-005", name: "NexTool", home: 2, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 0 },
  { code: "D-006", name: "Первая помощь", home: 0, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 27700 },
  { code: "D-007", name: "Стулья", home: 2, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 0 },
  { code: "D-008", name: "Кресло-качалка (ақ)", home: 1, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 44500, profit: 38000 },
  { code: "D-009", name: "Раскладушка ACO2", home: 0, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 21000 },
  { code: "D-010", name: "Кресло кожа", home: 1, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 0 },
  { code: "D-011", name: "Матрас", home: 1, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 0 },
  { code: "D-012", name: "Раскладной стул-шезлонг", home: 12, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 0 },
  { code: "D-013", name: "Брызговик", home: 1, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 2820, profit: 3000 },
  { code: "D-014", name: "Haier аэрогриль", home: 2, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 0 },
  { code: "D-015", name: "Раскладушка без матраса", home: 1, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 1, cost: 13700, profit: 10900 },
  { code: "D-016", name: "Раскладушка матраспен", home: 4, china: 4, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 21000, profit: 28800 },
  { code: "D-017", name: "PROPLAST Relax Rocking", home: 3, china: 0, wbTransit: 1, wbWarehouse: 0, kaspi: 0, cost: 27000, profit: 40000 },
  { code: "D-018", name: "Гантель 50 кг", home: 0, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 307500 },
  { code: "D-019", name: "Столик", home: 1, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 0, profit: 26000 },
  { code: "D-020", name: "PROPLAST LUXE орындық (ақ)", home: 8, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 9700, profit: 0 },
  { code: "D-021", name: "Безкаркасный кресло", home: 0, china: 0, wbTransit: 0, wbWarehouse: 0, kaspi: 0, cost: 30000, profit: 35000 },
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

const money = {
  format(value: number) {
    return String(Math.trunc(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  },
};

const PROFIT_ADJUSTMENT = 15900; // Бұрынғы реестрдегі, бірақ нақты D-кодқа бөлінбеген пайда


export default function Home() {
  const [section, setSection] = useState<Section>("dashboard");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loaded, setLoaded] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [operationProduct, setOperationProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [history, setHistory] = useState<OperationRecord[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("damu-products-v3");
      if (saved) {
        setProducts(JSON.parse(saved) as Product[]);
      }
    } catch {
      setProducts(initialProducts);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("damu-operation-history");
      if (saved) {
        setHistory(JSON.parse(saved) as OperationRecord[]);
      }
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("damu-products-v3", JSON.stringify(products));
  }, [products, loaded]);

  useEffect(() => {
    if (!historyLoaded) return;
    localStorage.setItem("damu-operation-history", JSON.stringify(history));
  }, [history, historyLoaded]);

  const totals = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        acc.home += product.home;
        acc.marketplaceTransit += product.wbTransit + product.kaspi;
        acc.chinaTransit += product.china;
        acc.wbWarehouse += product.wbWarehouse;
        acc.profit += product.profit;
        return acc;
      },
      {
        home: 0,
        marketplaceTransit: 0,
        chinaTransit: 0,
        wbWarehouse: 0,
        profit: PROFIT_ADJUSTMENT,
      }
    );
  }, [products]);

  function addProduct(product: Product) {
    const exists = products.some(
      (item) => item.code.toLowerCase() === product.code.toLowerCase()
    );

    if (exists) {
      alert("Бұл кодпен тауар бұрыннан бар.");
      return false;
    }

    setProducts((current) => [...current, product]);
    setSection("products");
    return true;
  }

  function updateProduct(updated: Product) {
    setProducts((current) =>
      current.map((item) => (item.code === updated.code ? updated : item))
    );
    setEditingProduct(null);
  }

  function applyOperation({
    code,
    operation,
    quantity,
    profit,
  }: {
    code: string;
    operation: ProductOperation;
    quantity: number;
    profit: number;
  }) {
    let error = "";

    setProducts((current) =>
      current.map((product) => {
        if (product.code !== code) return product;

        const updated = { ...product };

        if (operation === "home-to-kaspi") {
          if (updated.home < quantity) error = "Үйдегі тауар саны жеткіліксіз.";
          else {
            updated.home -= quantity;
            updated.kaspi += quantity;
          }
        }

        if (operation === "kaspi-sold") {
          if (updated.kaspi < quantity) error = "Kaspi жолындағы тауар саны жеткіліксіз.";
          else {
            updated.kaspi -= quantity;
            updated.profit += profit;
          }
        }

        if (operation === "home-to-wb") {
          if (updated.home < quantity) error = "Үйдегі тауар саны жеткіліксіз.";
          else {
            updated.home -= quantity;
            updated.wbTransit += quantity;
          }
        }

        if (operation === "wb-received") {
          if (updated.wbTransit < quantity) error = "WB жолындағы тауар саны жеткіліксіз.";
          else {
            updated.wbTransit -= quantity;
            updated.wbWarehouse += quantity;
          }
        }

        if (operation === "wb-sold") {
          if (updated.wbWarehouse < quantity) error = "WB қоймасындағы тауар саны жеткіліксіз.";
          else {
            updated.wbWarehouse -= quantity;
            updated.profit += profit;
          }
        }

        if (operation === "china-received") {
          if (updated.china < quantity) error = "Қытайдан келе жатқан тауар саны жеткіліксіз.";
          else {
            updated.china -= quantity;
            updated.home += quantity;
          }
        }

        return error ? product : updated;
      })
    );

    if (error) {
      alert(error);
      return false;
    }

    const currentProduct = products.find((item) => item.code === code);
    if (currentProduct) {
      setHistory((current) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          date: new Date().toLocaleString("ru-RU"),
          code,
          name: currentProduct.name,
          operation,
          quantity,
          profit,
        },
        ...current,
      ]);
    }

    setOperationProduct(null);
    return true;
  }

  function deleteProduct(code: string) {
    const confirmed = window.confirm(`${code} тауарын өшіруге сенімдісіз бе?`);
    if (!confirmed) return;
    setProducts((current) => current.filter((item) => item.code !== code));
  }

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

          {section === "dashboard" && (
            <Dashboard products={products} totals={totals} />
          )}

          {section === "products" && (
            <Products
              products={products}
              onNew={() => setSection("new-product")}
              onEdit={setEditingProduct}
              onDelete={deleteProduct}
              onPreview={setPreviewImage}
              onOperation={setOperationProduct}
            />
          )}

          {section === "new-product" && <NewProduct onAdd={addProduct} />}
          {section === "china" && (
            <EmptyCard
              title="Қытай → Үй"
              text="Қытайдан келе жатқан тауарлар осы жерде көрсетіледі."
            />
          )}
          {section === "wb" && (
            <EmptyCard
              title="Wildberries"
              text="WB жолдағы және қоймадағы тауарлар осы бөлімде болады."
            />
          )}
          {section === "kaspi" && (
            <EmptyCard
              title="Kaspi"
              text="Kaspi тапсырыстары мен жолдағы тауарлар осы жерде көрсетіледі."
            />
          )}
          {section === "profit" && (
            <Profit
              products={products}
              totalProfit={totals.profit}
              history={history}
              onClearHistory={() => setHistory([])}
            />
          )}
          {section === "settings" && (
            <Settings onReset={() => setProducts(initialProducts)} />
          )}
        </section>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={updateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {operationProduct && (
        <OperationModal
          product={operationProduct}
          onApply={applyOperation}
          onClose={() => setOperationProduct(null)}
        />
      )}

      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </main>
  );
}

function Dashboard({
  products,
  totals,
}: {
  products: Product[];
  totals: {
    home: number;
    marketplaceTransit: number;
    chinaTransit: number;
    wbWarehouse: number;
    profit: number;
  };
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Жалпы пайда"
          value={`${money.format(totals.profit)} ₸`}
          note="Барлық тауар бойынша"
        />
        <StatCard
          title="Шілде пайдасы"
          value="758 780 ₸"
          note="Ағымдағы ай"
        />
        <StatCard
          title="Үйдегі тауар"
          value={`${totals.home} дана`}
          note="Белсенді қалдық"
        />
        <StatCard
          title="WB + Kaspi жолда"
          value={`${totals.marketplaceTransit} дана`}
          note="Клиентке және WB-ға бара жатыр"
        />
        <StatCard
          title="Қытайдан келе жатыр"
          value={`${totals.chinaTransit} дана`}
          note="Қытай → Үй"
        />
        <StatCard
          title="WB қоймада"
          value={`${totals.wbWarehouse} дана`}
          note="Wildberries қоймасындағы қалдық"
        />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-xl font-bold">Негізгі тауарлар</h3>
          <p className="text-sm text-slate-500">Қоймадағы соңғы мәліметтер</p>
        </div>
        <ProductTable products={products.slice(0, 6)} />
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Жалпы пайдаға бұрынғы реестрден <strong>15 900 ₸</strong> түзету қосылды.
        Бұл сома нақты D-кодқа бөлінген кезде түзету автоматты түрде алынып тасталады.
      </div>
    </>
  );
}

function Products({
  products,
  onNew,
  onEdit,
  onDelete,
  onPreview,
  onOperation,
}: {
  products: Product[];
  onNew: () => void;
  onEdit: (product: Product) => void;
  onDelete: (code: string) => void;
  onPreview: (image: string) => void;
  onOperation: (product: Product) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Барлық тауарлар</h3>
          <p className="text-sm text-slate-500">
            D-кодтар бойынша қойма тізімі
          </p>
        </div>

        <button
          onClick={onNew}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Жаңа тауар
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        onOperation={onOperation}
      />
    </div>
  );
}

function ProductTable({
  products,
  onEdit,
  onDelete,
  onPreview,
  onOperation,
}: {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (code: string) => void;
  onPreview?: (image: string) => void;
  onOperation?: (product: Product) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1150px] text-left text-sm">
        <thead>
          <tr className="border-b text-slate-500">
            <th className="px-3 py-3">Сурет</th>
            <th className="px-3 py-3">Код</th>
            <th className="px-3 py-3">Тауар атауы</th>
            <th className="px-3 py-3">🏠 Үйде</th>
            <th className="px-3 py-3">🚛 Қытай</th>
            <th className="px-3 py-3">🟣 WB жолда</th>
            <th className="px-3 py-3">🏢 WB қойма</th>
            <th className="px-3 py-3">🟠 Kaspi</th>
            <th className="px-3 py-3">Өзіндік құн</th>
            <th className="px-3 py-3">Пайда</th>
            {(onEdit || onDelete || onOperation) && (
              <th className="px-3 py-3">Әрекет</th>
            )}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.code}
              className="border-b last:border-0 hover:bg-slate-50"
            >
              <td className="px-3 py-4">
                {product.image ? (
                  <button
                    type="button"
                    onClick={() => onPreview?.(product.image!)}
                    className="block"
                    title="Үлкейтіп көру"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-slate-200 object-cover hover:opacity-80"
                    />
                  </button>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                    Фото жоқ
                  </div>
                )}
              </td>
              <td className="px-3 py-4 font-bold text-blue-600">
                {product.code}
              </td>
              <td className="px-3 py-4 font-medium">{product.name}</td>
              <td className="px-3 py-4">{product.home}</td>
              <td className="px-3 py-4">{product.china}</td>
              <td className="px-3 py-4">{product.wbTransit}</td>
              <td className="px-3 py-4">{product.wbWarehouse}</td>
              <td className="px-3 py-4">{product.kaspi}</td>
              <td className="px-3 py-4">
                {product.cost ? `${money.format(product.cost)} ₸` : "—"}
              </td>
              <td className="px-3 py-4 font-semibold">
                {money.format(product.profit)} ₸
              </td>
              {(onEdit || onDelete || onOperation) && (
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    {onOperation && (
                      <button
                        onClick={() => onOperation(product)}
                        className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Операция
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        Өңдеу
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(product.code)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Өшіру
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewProduct({ onAdd }: { onAdd: (product: Product) => boolean }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [home, setHome] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();
    const numericCost = Number(cost);
    const numericHome = Number(home);

    if (!cleanCode || !cleanName) {
      setMessage("Код пен тауар атауын толтырыңыз.");
      return;
    }

    if (
      Number.isNaN(numericCost) ||
      Number.isNaN(numericHome) ||
      numericCost < 0 ||
      numericHome < 0
    ) {
      setMessage("Баға мен сан дұрыс енгізілуі керек.");
      return;
    }

    const added = onAdd({
      code: cleanCode,
      name: cleanName,
      image,
      home: numericHome,
      china: 0,
      wbTransit: 0,
      wbWarehouse: 0,
      kaspi: 0,
      cost: numericCost,
      profit: 0,
    });

    if (added) {
      setCode("");
      setName("");
      setCost("");
      setHome("");
      setImage("");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold">Жаңа тауар қосу</h3>
      <p className="mt-1 text-sm text-slate-500">
        Сақталған тауар «Тауарлар» бөліміне бірден қосылады.
      </p>

      <div className="mt-6 grid gap-4">
        <Input label="Тауар коды" placeholder="D-022" value={code} onChange={setCode} />
        <Input label="Тауар атауы" placeholder="Тауар атауы" value={name} onChange={setName} />
        <ImageUploader image={image} onChange={setImage} />
        <Input label="Өзіндік құны" placeholder="0" value={cost} onChange={setCost} type="number" />
        <Input label="Үйдегі саны" placeholder="0" value={home} onChange={setHome} type="number" />

        {message && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Сақтау
        </button>
      </div>
    </form>
  );
}

function EditProductModal({
  product,
  onSave,
  onClose,
}: {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [image, setImage] = useState(product.image ?? "");
  const [home, setHome] = useState(String(product.home));
  const [china, setChina] = useState(String(product.china));
  const [wbTransit, setWbTransit] = useState(String(product.wbTransit));
  const [wbWarehouse, setWbWarehouse] = useState(String(product.wbWarehouse));
  const [kaspi, setKaspi] = useState(String(product.kaspi));
  const [cost, setCost] = useState(String(product.cost));
  const [profit, setProfit] = useState(String(product.profit));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = {
      home: Number(home),
      china: Number(china),
      wbTransit: Number(wbTransit),
      wbWarehouse: Number(wbWarehouse),
      kaspi: Number(kaspi),
      cost: Number(cost),
      profit: Number(profit),
    };

    if (
      !name.trim() ||
      Object.values(values).some(
        (value) => Number.isNaN(value) || value < 0
      )
    ) {
      alert("Барлық мәнді дұрыс толтырыңыз.");
      return;
    }

    onSave({
      ...product,
      name: name.trim(),
      image,
      ...values,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Тауарды өңдеу</h3>
            <p className="mt-1 text-sm text-slate-500">{product.code}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold hover:bg-slate-200"
          >
            Жабу
          </button>
        </div>

        <div className="mb-4">
          <ImageUploader image={image} onChange={setImage} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Тауар атауы" placeholder="" value={name} onChange={setName} />
          <Input label="Өзіндік құны" placeholder="0" value={cost} onChange={setCost} type="number" />
          <Input label="🏠 Үйде" placeholder="0" value={home} onChange={setHome} type="number" />
          <Input label="🚛 Қытай → Үй" placeholder="0" value={china} onChange={setChina} type="number" />
          <Input label="🟣 WB жолда" placeholder="0" value={wbTransit} onChange={setWbTransit} type="number" />
          <Input label="🏢 WB қойма" placeholder="0" value={wbWarehouse} onChange={setWbWarehouse} type="number" />
          <Input label="🟠 Kaspi жолда" placeholder="0" value={kaspi} onChange={setKaspi} type="number" />
          <Input label="Жиналған пайда" placeholder="0" value={profit} onChange={setProfit} type="number" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold"
          >
            Болдырмау
          </button>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Өзгерісті сақтау
          </button>
        </div>
      </form>
    </div>
  );
}


function OperationModal({
  product,
  onApply,
  onClose,
}: {
  product: Product;
  onApply: (payload: {
    code: string;
    operation: ProductOperation;
    quantity: number;
    profit: number;
  }) => boolean;
  onClose: () => void;
}) {
  const [operation, setOperation] =
    useState<ProductOperation>("home-to-kaspi");
  const [quantity, setQuantity] = useState("1");
  const [profit, setProfit] = useState("0");

  const needsProfit = operation === "kaspi-sold" || operation === "wb-sold";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericQuantity = Number(quantity);
    const numericProfit = Number(profit);

    if (
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0 ||
      Number.isNaN(numericProfit) ||
      numericProfit < 0
    ) {
      alert("Саны мен пайданы дұрыс енгізіңіз.");
      return;
    }

    onApply({
      code: product.code,
      operation,
      quantity: numericQuantity,
      profit: needsProfit ? numericProfit : 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Тауар операциясы</h3>
            <p className="mt-1 text-sm text-slate-500">
              {product.code} — {product.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold hover:bg-slate-200"
          >
            Жабу
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">🏠 Үйде: {product.home}</div>
          <div className="rounded-xl bg-slate-50 p-3">🚛 Қытай: {product.china}</div>
          <div className="rounded-xl bg-slate-50 p-3">🟣 WB жолда: {product.wbTransit}</div>
          <div className="rounded-xl bg-slate-50 p-3">🏢 WB қойма: {product.wbWarehouse}</div>
          <div className="rounded-xl bg-slate-50 p-3">🟠 Kaspi: {product.kaspi}</div>
          <div className="rounded-xl bg-slate-50 p-3">
            💰 Пайда: {money.format(product.profit)} ₸
          </div>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Операция түрі</span>
          <select
            value={operation}
            onChange={(event) =>
              setOperation(event.target.value as ProductOperation)
            }
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="home-to-kaspi">Үйден Kaspi жолына жіберу</option>
            <option value="kaspi-sold">Kaspi сатылды</option>
            <option value="home-to-wb">Үйден WB жолына жіберу</option>
            <option value="wb-received">WB қоймасына қабылданды</option>
            <option value="wb-sold">WB сатылды</option>
            <option value="china-received">Қытайдан үйге келді</option>
          </select>
        </label>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Саны"
            placeholder="1"
            value={quantity}
            onChange={setQuantity}
            type="number"
          />

          {needsProfit && (
            <Input
              label="Осы сатудан түскен таза пайда"
              placeholder="0"
              value={profit}
              onChange={setProfit}
              type="number"
            />
          )}
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
          Жіберу операциясында тауар үйдегі саннан бірден азаяды. Сату кезінде
          тауар тиісті жолдан немесе қоймадан азайып, пайдаға қосылады.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold"
          >
            Болдырмау
          </button>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Операцияны орындау
          </button>
        </div>
      </form>
    </div>
  );
}

function Profit({
  products,
  totalProfit,
  history,
  onClearHistory,
}: {
  products: Product[];
  totalProfit: number;
  history: OperationRecord[];
  onClearHistory: () => void;
}) {
  const best = [...products].sort((a, b) => b.profit - a.profit)[0];

  const labels: Record<ProductOperation, string> = {
    "home-to-kaspi": "Үйден Kaspi жолына",
    "kaspi-sold": "Kaspi сатылды",
    "home-to-wb": "Үйден WB жолына",
    "wb-received": "WB қоймасына қабылданды",
    "wb-sold": "WB сатылды",
    "china-received": "Қытайдан үйге келді",
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Жалпы пайда"
          value={`${money.format(totalProfit)} ₸`}
          note="Барлық кезең"
        />
        <StatCard
          title="Тауар саны"
          value={`${products.length} позиция`}
          note="Белсенді база"
        />
        <StatCard
          title="Ең пайдалы тауар"
          value={best?.code ?? "—"}
          note={best ? `${money.format(best.profit)} ₸` : "Дерек жоқ"}
        />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Операциялар тарихы</h3>
            <p className="text-sm text-slate-500">
              Соңғы қозғалыстар мен сатулар
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Операциялар тарихын толық өшіруге сенімдісіз бе?")) {
                  onClearHistory();
                }
              }}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Тарихты тазалау
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Әзірге операция жоқ.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="px-3 py-3">Күні</th>
                  <th className="px-3 py-3">Код</th>
                  <th className="px-3 py-3">Тауар</th>
                  <th className="px-3 py-3">Операция</th>
                  <th className="px-3 py-3">Саны</th>
                  <th className="px-3 py-3">Пайда</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-3 py-4 text-slate-500">{item.date}</td>
                    <td className="px-3 py-4 font-bold text-blue-600">
                      {item.code}
                    </td>
                    <td className="px-3 py-4">{item.name}</td>
                    <td className="px-3 py-4">{labels[item.operation]}</td>
                    <td className="px-3 py-4">{item.quantity}</td>
                    <td className="px-3 py-4 font-semibold">
                      {item.profit > 0 ? `${money.format(item.profit)} ₸` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Settings({ onReset }: { onReset: () => void }) {
  function reset() {
    const confirmed = window.confirm(
      "Барлық өзгерісті өшіріп, бастапқы тауарларды қайтаруға сенімдісіз бе?"
    );
    if (confirmed) onReset();
  }

  return (
    <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <h3 className="text-2xl font-bold">Баптаулар</h3>
      <p className="mt-3 text-slate-500">
        Қазіргі нұсқада мәліметтер осы браузерде автоматты сақталады.
      </p>

      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100"
      >
        Бастапқы базаға қайтару
      </button>
    </div>
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
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}


function ImageUploader({
  image,
  onChange,
}: {
  image: string;
  onChange: (value: string) => void;
}) {
  function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Тек сурет файлын таңдаңыз.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Сурет көлемі 2 МБ-тан аспауы керек.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-3 text-sm font-medium">Тауар суреті</p>

      <div className="flex flex-wrap items-center gap-4">
        {image ? (
          <img
            src={image}
            alt="Тауар суреті"
            className="h-24 w-24 rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400">
            Фото жоқ
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Сурет таңдау
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={selectImage}
            />
          </label>

          {image && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Суретті өшіру
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        JPG, PNG немесе WEBP. Ең жоғары көлемі — 2 МБ.
      </p>
    </div>
  );
}

function ImagePreviewModal({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[95vh] max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full bg-white px-3 py-2 text-sm font-bold shadow"
        >
          ✕
        </button>

        <img
          src={image}
          alt="Үлкейтілген тауар суреті"
          className="max-h-[90vh] max-w-full rounded-2xl bg-white object-contain shadow-2xl"
        />
      </div>
    </div>
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
